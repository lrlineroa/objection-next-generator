import { DataModelType, ModelType } from "src/@types/datamodel";
import {
  getFileContents,
  getFilesFromMigrations,
  saveGeneratedDataModel,
} from "@utils/fileSystem";
import { getDataModel } from "./datamodel";
import {
  generateApiRestFromMigration,
  generateHttpRequestsFromKnexModels,
  generateMigrationFromSQLModel,
  generateModelFromMigration,
  generateModelsFromKnexModels,
  generateTypesFromMigrations,
  generatetApiRestFromKnexModels,
} from "./generator";
import { KnexModelsType } from "src/@types";
import { generated_knex_models_location } from "./constants/locations";

// //read the migration file from the disk
// const migrationFiles = getFilesFromMigrations();
// for (let fileName of migrationFiles) {
let knexModels: KnexModelsType = JSON.parse(
  getFileContents(generated_knex_models_location, "knex_models.json")
);
try {
  generateModelsFromKnexModels(knexModels);
} catch (error: unknown) {
  console.error(error);
}
try {
  generateHttpRequestsFromKnexModels(knexModels);
} catch (error: unknown) {
  console.error(error);
}
try {
  generatetApiRestFromKnexModels(knexModels);
} catch (error: unknown) {
  console.error(error);
}
try {
  generateTypesFromKnexModels(knexModels);
} catch (error: unknown) {
  console.error(error);
}
//   try {
//     generateApiRestFromMigration(fileName);
//   } catch (error) {
//     console.log("error at generate API REST: " + fileName);
//     console.log(error);
//   }
// }

// try {
//   generateTypesFromMigrations(migrationFiles);
// } catch (error) {
//   console.log("error : at generating Types");
//   console.log(error);
// }
