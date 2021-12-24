import {
  extractSQLColumnDefinitions,
  extractSQLForeignKeysDefinition,
  extractSQLPKDefinition,
  extractSQLRequiredPropertiesDefinition,
  extractSQLUniquePropertiesDefinition,
} from "@partials/columnsDefinition";
import {
  extractSQLTableDefinitions,
  extractSQLTableNameStatement,
} from "@partials/tableNameStatement";
import { sql_timestamps_definition_regexp } from "@regexps";
import {
  getPartialSQLReverseTemplate,
  getSQLFileContent,
} from "@utils/fileSystem";
import {
  DataModelType,
  ForeignType,
  GeneratedForeignType,
  ModelType,
  PropertyType,
} from "src/@types/datamodel";

const reverseMustache = require("reverse-mustache");
export const getProperties = (
  coincidence: string,
  primary_key: string,
  required_properties: string[] | null,
  unique_properties: string[] | null,
  foreign_keys: GeneratedForeignType[]
): PropertyType[] => {
  const properties: PropertyType[] = [];
  const coincidenceColumns: string[] | null =
    extractSQLColumnDefinitions(coincidence);
  for (let columnCoincidence of coincidenceColumns!) {
    let reversedTemplate = getPartialSQLReverseTemplate(
      "column_definition.mustache"
    );
    let reversedContent = reverseMustache({
      template: reversedTemplate,
      content: columnCoincidence,
    });

    let property: PropertyType = {
      column_name: reversedContent?.column_name,
      column_type: reversedContent?.column_type,
    };
    if (property.column_name === primary_key) property.primary = true;
    if (
      required_properties &&
      required_properties.includes(property.column_name)
    )
      property.required = true;
    if (unique_properties && unique_properties.includes(property.column_name))
      property.unique = true;
    const existingForeignKey = foreign_keys.find(
      (fk) => fk.column_name === property.column_name
    );
    if (existingForeignKey) {
      property.foreign = existingForeignKey.foreign;
    }
    properties.push(property);
  }
  return properties;
};
export const getModel = (coincidence: string): ModelType => {
  let table_name_string = extractSQLTableNameStatement(coincidence);
  let reversedTemplate = getPartialSQLReverseTemplate("table_name.mustache");
  let result = reverseMustache({
    template: reversedTemplate,
    content: table_name_string,
  });
  const primary_key = getPrimaryKey(coincidence);
  const required_properties = getRequiredProperties(coincidence);
  const unique_properties = getUniqueProperties(coincidence);
  const foreign_keys: GeneratedForeignType[] = getForeignKeys(coincidence);
  const properties = getProperties(
    coincidence,
    primary_key,
    required_properties,
    unique_properties,
    foreign_keys
  );
  sql_timestamps_definition_regexp.lastIndex = 0;
  const timestamps: boolean =
    sql_timestamps_definition_regexp.test(coincidence);
  return {
    table_name: result?.table_name,
    properties,
    timestamps,
  };
};
export const getDataModel = (): DataModelType => {
  const sqlContent = getSQLFileContent();
  const coincidences = extractSQLTableDefinitions(sqlContent);
  let models: ModelType[] = [];
  for (let coincidence of coincidences!) {
    models.push(getModel(coincidence));
  }
  return {
    models,
  };
};

const getPrimaryKey = (coincidence: string): string => {
  const pKContent = extractSQLPKDefinition(coincidence);
  const reversedTemplate = getPartialSQLReverseTemplate("primary_key.mustache");
  const result = reverseMustache({
    template: reversedTemplate,
    content: pKContent,
  });
  return result?.column_name;
};

const getRequiredProperties = (coincidence: string): string[] | null => {
  const requiredPropertiesContent =
    extractSQLRequiredPropertiesDefinition(coincidence);
  var parts: string[] = requiredPropertiesContent
    ? requiredPropertiesContent.split("`")
    : [];
  parts = parts.filter(
    (part) => /\w/g.test(part) && part.trim() !== "KEY" && part.trim() !== "REQ"
  );
  return parts;
};

const getUniqueProperties = (coincidence: string): string[] | null => {
  const uniquePropertiesContent =
    extractSQLUniquePropertiesDefinition(coincidence);
  var parts: string[] = uniquePropertiesContent
    ? uniquePropertiesContent.split("`")
    : [];
  parts = parts.filter(
    (part) =>
      /\w/g.test(part) && part.trim() !== "KEY" && part.trim() !== "UNIQ"
  );
  return parts;
};

const getForeignKeys = (coincidence: string): GeneratedForeignType[] => {
  const parts = extractSQLForeignKeysDefinition(coincidence);
  let foreign_keys: GeneratedForeignType[] = [];
  if (!parts) return [];
  for (let part of parts) {
    const reversedTemplate = getPartialSQLReverseTemplate(
      "foreign_key.mustache"
    );
    const result = reverseMustache({
      template: reversedTemplate,
      content: part,
    });
    const foreign_key: GeneratedForeignType = {
      column_name: result?.column_name,
      foreign: {
        table: result?.foreign_table,
        column: result?.foreign_column,
      },
    };
    foreign_keys.push(foreign_key);
  }
  return foreign_keys;
};
