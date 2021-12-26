import { PropertyType } from "src/@types/datamodel";
import { getPartialReverseTemplate } from "@utils/fileSystem";
import { translateDataTypes } from "@utils/helpers";
import { JSONSchemaPropertyType, JSONSchemaType } from "src/@types";
import {
  extractOnlyTheColumnDefinition,
  getColumnDefinitions,
} from "./columnsDefinition";

const reverseMustache = require("reverse-mustache");
export const getJSONSchema = (content: string): JSONSchemaType => {
  const column_definition_statement_template = getPartialReverseTemplate(
    "column_definition.mustache"
  );
  let properties: JSONSchemaPropertyType[] = [];
  let required_properties: string[] = [];
  let column_definitions = getColumnDefinitions(content);
  if (!column_definitions) {
    return { properties, required_properties };
  }
  for (let column_definition_content of column_definitions) {
    //table.xxxx("yyyy")
    if (column_definition_content.includes("timestamp")) {
      properties.push({ column_name: "created_at", column_type: "date" });
      properties.push({ column_name: "updated_at", column_type: "date" });
    } else {
      const isRequired = column_definition_content.includes("notNullable");
      const only_column_definition = extractOnlyTheColumnDefinition(
        column_definition_content
      );
      let reversed: JSONSchemaPropertyType = reverseMustache({
        template: column_definition_statement_template,
        content: only_column_definition,
      });
      reversed = translateDataTypes(reversed);
      properties.push(reversed);
      if (isRequired) {
        required_properties.push(reversed.column_name || "");
      }
    }
  }
  return { properties, required_properties };
};
export const getJSONSchemaFromModel = (
  properties: PropertyType[],
  withTimestamps: boolean = false
): JSONSchemaType => {
  const required_properties: string[] = properties
    .filter((property) => property.required)
    .map((property) => property.column_name);
  const properties_json_schema: JSONSchemaPropertyType[] = properties.map(
    (property) => {
      return {
        column_name: property.column_name,
        column_type: property.column_type,
      };
    }
  );
  if(withTimestamps){
    properties_json_schema.push({ column_name: "created_at", column_type: "string" });
    properties_json_schema.push({ column_name: "updated_at", column_type: "string" });
  }
  return { properties: properties_json_schema, required_properties };
};
