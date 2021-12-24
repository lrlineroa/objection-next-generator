import {
  column_definition_statement_global,
  column_definition_statement_regex,
  foreign_key_definition_regexp,
  primary_key_definition_regexp,
  reference_definition,
  required_properties_definition_regexp,
  sql_column_definition_regexp,
  trim_all_spaces_regex,
  unique_properties_definition_regexp,
} from "@regexps";
import { RelationDefinitionInfoType } from "src/@types";
import { extractMatch } from "@utils/extractors";

const deletePartCommas = (parts: string[] | null): string[] => {
  if (!parts) {
    return [];
  }
  parts = parts.map((part) => part.replace(/,/g, ""));
  return parts;
};

const deletePartSpaces = (parts: string[] | null): string[] => {
  if (!parts) {
    return [];
  }
  parts = parts.map((part) => part.replace(trim_all_spaces_regex, ""));
  return parts;
};

export const extractOnlyTheColumnDefinition = (content: string): string => {
  const regex = column_definition_statement_regex;

  regex.lastIndex = 0;

  let extraction = extractMatch(regex, content);
  extraction = deletePartSpaces(extraction);
  return extraction[0];
};

export const extractColumnDefinitions = (content: string): string[] => {
  const regex = column_definition_statement_global;
  regex.lastIndex = 0;
  let extraction = extractMatch(regex, content);
  extraction = deletePartSpaces(extraction);
  return extraction;
};

export const getColumnDefinitions = (content: string): string[] => {
  const column_definitions = extractColumnDefinitions(content);
  return column_definitions;
};

export const getReferencesColumnDefinitions = (content: string): string[] => {
  let column_definitions: string[] = extractColumnDefinitions(content);
  column_definitions = column_definitions.filter((column_definition) =>
    column_definition.includes("references")
  );
  //table.xxxx("yyyy")
  return column_definitions;
};

export const getColumnAndReferencesDefinitionContent = (
  definitions: string[]
): RelationDefinitionInfoType[] => {
  let relationsInfo: RelationDefinitionInfoType[] = [];
  for (let definition of definitions) {
    if (definition.includes("references")) {
      relationsInfo.push(extractRelationInfo(definition));
    }
  }
  return relationsInfo;
};

const extractRelationInfo = (
  definition: string
): RelationDefinitionInfoType => {
  let column_definition = extractOnlyTheColumnDefinition(definition);
  const references_definition = extractReferenceDefinition(definition);
  return { column_definition, references_definition };
};

export const extractReferenceDefinition = (content: string): string => {
  const regex = reference_definition;
  regex.lastIndex = 0;
  let extraction = extractMatch(regex, content);
  return extraction ? extraction[0] : "";
};

export const extractSQLColumnDefinitions = (
  content: string
): string[] | null => {
  const regex = sql_column_definition_regexp;
  regex.lastIndex = 0;
  let extraction = extractMatch(regex, content);
  // extraction = deletePartSpaces(extraction);
  return extraction;
};

export const extractSQLPKDefinition = (content: string): string => {
  const regex = primary_key_definition_regexp;
  regex.lastIndex = 0;
  let extraction = extractMatch(regex, content);
  return extraction![0];
};

export const extractSQLRequiredPropertiesDefinition = (
  content: string
): string | null => {
  const regex = required_properties_definition_regexp;
  regex.lastIndex = 0;
  let extraction = extractMatch(regex, content);
  return extraction ? extraction![0] : null;
};
export const extractSQLUniquePropertiesDefinition = (
  content: string
): string | null => {
  const regex = unique_properties_definition_regexp;
  regex.lastIndex = 0;
  let extraction = extractMatch(regex, content);
  return extraction ? extraction![0] : null;
};

export const extractSQLForeignKeysDefinition = (
  content: string
): string[] | null => {
  const regex = foreign_key_definition_regexp;
  regex.lastIndex = 0;
  let extraction = extractMatch(regex, content);
  return extraction;
}
