import { ModelType, PropertyType } from "src/@types/datamodel";
import { getPartialReverseTemplate } from "@utils/fileSystem";
import {
  getModelFileName,
  getModelName,
  getRelationName,
} from "@utils/helpers";
import {
  RelationMappingType,
  RelationDefinitionInfoType,
  ReversedReferenceType,
  ReversedColumnType,
} from "src/@types";
import {
  getColumnAndReferencesDefinitionContent,
  getReferencesColumnDefinitions,
} from "./columnsDefinition";
import { property } from "lodash";

const reverseMustache = require("reverse-mustache");
export const getRelationMappings = (content: string): RelationMappingType[] => {
  const relations_mappings: RelationMappingType[] = [];
  const foreignKeyDefinitions: string[] =
    getReferencesColumnDefinitions(content);
  const column_definition_statement_template = getPartialReverseTemplate(
    "column_definition.mustache"
  );
  const references_definition_template = getPartialReverseTemplate(
    "references_definition.mustache"
  );

  let relationsInfo: RelationDefinitionInfoType[] =
    getColumnAndReferencesDefinitionContent(foreignKeyDefinitions);
  for (let info of relationsInfo) {
    let reversedReference: ReversedReferenceType = reverseMustache({
      template: references_definition_template,
      content: info.references_definition,
    });
    let reversedColumn: ReversedColumnType = reverseMustache({
      template: column_definition_statement_template,
      content: info.column_definition,
    });
    const { table_name, primary_key } = reversedReference;
    const { column_name } = reversedColumn;
    const related_model_name = getModelName(table_name);
    const relation_type = "BelongsToOneRelation";
    const relation_name = getRelationName(table_name, relation_type);
    const from = column_name;
    const to = `${table_name}.${primary_key}`;
    const related_model_file_name = getModelFileName(table_name);
    const relation_mapping: RelationMappingType = {
      relation_name,
      from,
      to,
      relation_type,
      related_model_name: related_model_name || "",
      related_model_file_name: related_model_file_name || "",
    };
    relations_mappings.push(relation_mapping);
  }
  return relations_mappings;
};

export const getRelationMappingsFromModel = (
  model: ModelType
): RelationMappingType[] => {
  const properties = model.properties;
  const relation_mappings: RelationMappingType[] = [];
  const foreingProperties = properties.filter((property) => property.foreign);
  for (let fkProperty of foreingProperties) {
    const pk_table_name: string = fkProperty.foreign?.table!;
    const pk_column_name = fkProperty.foreign?.column;
    const column_name = fkProperty.column_name;
    const related_model_name = getModelName(pk_table_name);
    const relation_type = "BelongsToOneRelation";
    const is_auto_reference = pk_table_name !== model.table_name;
    const relation_name = getRelationName(pk_table_name || "", relation_type);
    const from = `${model.table_name}.${column_name}`;
    const to: string = `${pk_table_name}.${pk_column_name}`;
    const related_model_file_name = getModelFileName(pk_table_name);
    relation_mappings.push({
      relation_name,
      from,
      to,
      relation_type,
      related_model_name: related_model_name || "",
      related_model_file_name: related_model_file_name || ""
    });
  }
  return relation_mappings;
};
