import {
  column_definition_statement_global,
  column_definition_statement_regex,
  reference_definition,
  trim_all_spaces_regex,
} from "@regexps";
import { RelationDefinitionInfoType } from "src/@types";
import { extractMatch } from "@utils/extractors";

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
