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
    let relation_type = "BelongsToOneRelation";
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
