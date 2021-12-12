import { DataOfFileType } from "src/@types";
import fs from "fs";
import path from "path";
import {
  generated_api_rest_location,
  generated_http_requests_location,
  generated_models_location,
  generated_types_location,
  migrations_location,
  reverse_templates_locations_partials,
  templates_locations,
} from "src/constants/locations";
export const getFileContents = (locationsArray: string[], fileName: string) => {
  return fs.readFileSync(
    path.join(__dirname, ...[...locationsArray, fileName]),
    "utf8"
  );
};

export const saveFileContents = (
  locationsArray: string[],
  fileName: string,
  content: string
) => {
  if (!fs.existsSync(path.join(__dirname, ...[...locationsArray]))) {
    fs.mkdirSync(path.join(__dirname, ...[...locationsArray]));
  }
  return fs.writeFileSync(
    path.join(__dirname, ...[...locationsArray, fileName]),
    content
  );
};

export const getTemplate = (fileName: string) => {
  return getFileContents(templates_locations, fileName);
};
export const getPartialReverseTemplate = (fileName: string) => {
  return getFileContents(reverse_templates_locations_partials, fileName);
};
export const getMigrationContent = (fileName: string) => {
  return getFileContents(migrations_location, fileName);
};

export const saveGenerateModel = (fileName: string, content: string) => {
  return saveFileContents(generated_models_location, fileName, content);
};

export const saveGenerateTypes = (fileName: string, content: string) => {
  return saveFileContents(generated_types_location, fileName, content);
};
export const saveGenerateHttpRequests = (
  fileName: string,
  table_name: string,
  content: string
) => {
  return saveFileContents(
    [...generated_http_requests_location, table_name],
    fileName,
    content
  );
};

export const saveGenerateApiRest = (
  dataOfFile: DataOfFileType,
  table_name: string,
  content: string
) => {
  let locationArray = [...generated_api_rest_location, table_name];
  if (dataOfFile.folderName) {
    locationArray.push(dataOfFile.folderName);
  }
  return saveFileContents(
    [...locationArray, table_name],
    dataOfFile.fileName,
    content
  );
};

export const getFilesFromMigrations = () => {
  return fs.readdirSync(path.join(__dirname, ...migrations_location));
};
