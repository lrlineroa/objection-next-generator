import {
  getFileContents,
} from "@utils/fileSystem";
import {
  generateHttpRequestsFromKnexModels,
  generateModelsFromKnexModels,
  generatetApiRestFromKnexModels,
  generateTypesFromKnexModels,
} from "./generator";
import { KnexModelsType } from "src/@types";
import { generated_knex_models_location } from "./constants/locations";

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