import { getFilesFromMigrations } from "@utils/fileSystem";
import {
  generateApiRestFromMigration,
  generateHttpRequestsFromMigrations,
  generateModelFromMigration,
  generateTypesFromMigrations,
} from "./generator";

//read the migration file from the disk
const migrationFiles = getFilesFromMigrations();
for (let fileName of migrationFiles) {
  try {
    generateModelFromMigration(fileName);
  } catch (error) {
    console.log("error at generationModels: " + fileName);
    console.log(error);
  }
  try {
    generateHttpRequestsFromMigrations(fileName);
  } catch (error) {
    console.log("error at generation Http requests: " + fileName);
    console.log(error);
  }
  try {
    generateApiRestFromMigration(fileName);
  } catch (error) {
    console.log("error at generate API REST: " + fileName);
    console.log(error);
  }
}

try {
  generateTypesFromMigrations(migrationFiles);
} catch (error) {
  console.log("error : at generating Types");
  console.log(error);
}

