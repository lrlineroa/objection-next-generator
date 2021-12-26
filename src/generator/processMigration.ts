import { getJSONSchema } from "@partials/jsonSchema";
import { getRelationMappings } from "@partials/relationMappings";
import { getTableName } from "@partials/tableNameStatement";
import { trim_all_spaces_regex } from "@regexps";
import { getMigrationContent } from "@utils/fileSystem";
import {
  getModelFileName,
  getModelName,
  translateDataTypes,
  translateDataTypesForType,
} from "@utils/helpers";
import {
  ColumnType,
  HttpRequestType,
  JSONSchemaType,
  ModelType,
  ReversedColumnType,
  TypesType,
  TypeType,
} from "src/@types";
import _ from "lodash";
export const getDataForModel = (fileName: string): ModelType => {
  let migrationFile = getMigrationContent(fileName);
  migrationFile = migrationFile.replace(trim_all_spaces_regex, "");
  const table_name = getTableName(migrationFile);
  let model_name = getModelName(table_name);
  let model_file_name = getModelFileName(table_name);
  let json_schema = getJSONSchema(migrationFile);
  let relation_mappings = getRelationMappings(migrationFile);
  return {
    table_name,
    model_name,
    model_file_name,
    json_schema,
    relation_mappings,
  };
};

export const getDataForTypes = (fileNames: string[]): TypesType => {
  const data: TypesType = {
    types: [],
  };
  for (let fileName of fileNames) {
    let migrationFile = getMigrationContent(fileName);
    migrationFile = migrationFile.replace(trim_all_spaces_regex, "");
    const table_name = getTableName(migrationFile);
    let model_name = getModelName(table_name);
    let json_schema: JSONSchemaType = getJSONSchema(migrationFile);
    let type: TypeType = {
      related_model_name: model_name || "",
      columns: [],
    };
    if (json_schema.properties)
      for (let property of json_schema.properties) {
        let type_property: ColumnType = {
          column_name:
            `${property.column_name}${
              _.includes(json_schema.required_properties, property.column_name)
                ? ""
                : "?"
            }` || "",
          column_type: property.column_type || "",
        };
        type_property = translateDataTypesForType(type_property);
        type.columns.push(type_property);
      }
    data.types.push(type);
  }
  return data;
};

export const getDataForHttpRequests = (model:ModelType): HttpRequestType => {
  const data: HttpRequestType = {
    table_name: model.table_name,
    columns: [],
    local_host: "{{local_host}}",
    remote_host: "{{remote_host}}",
    listColumns: function () {
      var result = "";
      for (var i = 0; i < this.columns.length; i++) {
        result +=
          `\"${this.columns[i].column_name}\" : \"\"${(i !== this.columns.length - 1 ? ", \n\t" : "")}`;
      }
      return result;
    },
  };
  let json_schema: JSONSchemaType = model.json_schema!;
  if (json_schema.properties)
    for (let property of json_schema.properties) {
      let column: ReversedColumnType = {
        column_name: property.column_name || "",
      };
      data.columns.push(column);
    }
  return data;
};
