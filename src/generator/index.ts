import Mustache from "mustache";
import { getTableName } from "@partials/tableNameStatement";
import { getModelFileName, getModelName } from "@utils/helpers";
import {
  getMigrationContent,
  getPartialReverseTemplate,
  getTemplate,
  saveGenerateApiRest,
  saveGenerateHttpRequests,
  saveGenerateModel,
  saveGenerateTypes,
} from "@utils/fileSystem";
import {
  DataOfFileType,
  HttpRequestType,
  ModelType,
  TypesType,
} from "src/@types";
import {
  getDataForHttpRequests,
  getDataForModel,
  getDataForTypes,
} from "./processMigration";
export const generateModelFromMigration = (fileName: string): void => {
  let model_template = getTemplate("model.mustache");
  let data: ModelType = getDataForModel(fileName);
  let generatedModelContent: string = Mustache.render(model_template, data);

  saveGenerateModel(`${data.model_file_name}.ts`, generatedModelContent);
};

export const generateTypesFromMigrations = (fileNames: string[]): void => {
  let types_model = getTemplate("types.mustache");
  let data: TypesType = getDataForTypes(fileNames);
  let generatedTypesContent: string = Mustache.render(types_model, data);
  saveGenerateTypes(`index.d.ts`, generatedTypesContent);
};

export const generateHttpRequestsFromMigrations = (fileName: string): void => {
  let data: HttpRequestType = getDataForHttpRequests(fileName);

  let dataOfFiles: DataOfFileType[] = [
    { templateName: "create_http.mustache", fileName: "create.http" },
    { templateName: "read_http.mustache", fileName: "read.http" },
    { templateName: "read_one_http.mustache", fileName: "read_one.http" },
    { templateName: "edit_http.mustache", fileName: "edit.http" },
    { templateName: "delete_http.mustache", fileName: "delete.http" },
  ];
  for (let dataFile of dataOfFiles) {
    let template = getTemplate(dataFile.templateName);
    let generatedContent = Mustache.render(template, data);
    saveGenerateHttpRequests(
      dataFile.fileName,
      data.table_name,
      generatedContent
    );
  }
};

export const generateApiRestFromMigration = (fileName: string): void => {
  let data: ModelType = getDataForModel(fileName);
  let dataOfFiles : DataOfFileType[] = [
    { templateName: "api_rest/create_and_read.mustache", fileName: "index.ts" },
    {
      templateName: "api_rest/edit.mustache",
      folderName: "[id]",
      fileName: "edit.ts",
    },
    {
      templateName: "api_rest/delete.mustache",
      folderName: "[id]",
      fileName: "delete.ts",
    },
    { templateName: "api_rest/read_one.mustache", fileName: "[id].ts" },
  ];
  for (let dataFile of dataOfFiles) {
    let template = getTemplate(dataFile.templateName);
    let generatedContent = Mustache.render(template, data);
    saveGenerateApiRest(dataFile, data.table_name, generatedContent);
  }
};
