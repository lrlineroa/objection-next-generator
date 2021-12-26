import {
  InversedRelationMappingType,
  JSONSchemaType,
  ModelType,
  RelationMappingType,
} from "src/@types";
import { getFileContents, saveGeneratedKnexModels } from "@utils/fileSystem";
import { DataModelType } from "src/@types/datamodel";
import { generated_data_model_location } from "./constants/locations";
import { getModelFileName, getModelName } from "@utils/helpers";
import { getJSONSchemaFromModel } from "@partials/jsonSchema";
import { getRelationMappingsFromModel } from "@partials/relationMappings";

const getHasManyAndManyToManyRelationMappings = (
  relation_mappings: RelationMappingType[],
  currentTableName: string,
  currentModelName: string,
  currentModelFileName: string
): InversedRelationMappingType[] => {
  const hasManyAndManyToManyRelationMappings: InversedRelationMappingType[] =
    [];
  const belongsToOneRelations = relation_mappings.filter(
    (relation) => relation.relation_type === "BelongsToOneRelation"
  );

  for (let belongsToOneRelation of belongsToOneRelations) {
    const relation_type = "HasManyRelation";
    let from = belongsToOneRelation.to;
    let to = belongsToOneRelation.from;
    let relation_name = currentTableName;
    let related_model_name = currentModelName;
    let related_model_file_name = currentModelFileName;
    let model_to_edit = belongsToOneRelation.related_model_name;
    hasManyAndManyToManyRelationMappings.push({
      relation_type,
      from,
      to,
      relation_name,
      related_model_name,
      related_model_file_name,
      model_to_edit,
    });
  }
  return hasManyAndManyToManyRelationMappings;
};

let dataModel: DataModelType = JSON.parse(
  getFileContents(generated_data_model_location, "data_model.json")
);
let knexModels: ModelType[] = [];
let hasManyAndManyToManyRelationMappings: InversedRelationMappingType[] = [];
for (let modelToKnex of dataModel.models) {
  let table_name = modelToKnex.table_name;
  let model_name = getModelName(modelToKnex.table_name);
  let model_file_name = getModelFileName(modelToKnex.table_name);
  let json_schema: JSONSchemaType = getJSONSchemaFromModel(
    modelToKnex.properties,
    modelToKnex.timestamps
  );
  let relation_mappings: RelationMappingType[] =
    getRelationMappingsFromModel(modelToKnex);
  let relations = getHasManyAndManyToManyRelationMappings(
    relation_mappings,
    table_name,
    model_name || "",
    model_file_name || ""
  );
  hasManyAndManyToManyRelationMappings = [
    ...hasManyAndManyToManyRelationMappings,
    ...relations,
  ];
  knexModels.push({
    table_name,
    model_name,
    model_file_name,
    json_schema,
    relation_mappings,
  });
}
for (let hasManyAndManyToManyRelationMapping of hasManyAndManyToManyRelationMappings) {
  //buscar el modelo
  let modelToEdit: ModelType = knexModels.find(
    (model) =>
      model.model_name === hasManyAndManyToManyRelationMapping.model_to_edit
  )!;
  const { model_to_edit, ...rest } = hasManyAndManyToManyRelationMapping;
  modelToEdit?.relation_mappings?.push({ ...rest });
  knexModels = knexModels.map((model) =>
    model.model_name === modelToEdit?.model_name ? modelToEdit : model
  );
}
saveGeneratedKnexModels(
  "knex_models.json",
  JSON.stringify({ models: knexModels }, null, 4)
);
