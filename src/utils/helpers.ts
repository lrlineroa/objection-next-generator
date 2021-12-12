import { ColumnType, JSONSchemaPropertyType } from "src/@types";
import { translationMigToModel, translationMigToType } from "./translators/datatypes";

var pluralize = require("pluralize");
//first capitalized string
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getModelName = (str: string | undefined): string | undefined => {
  let parts = str?.split("_");
  return parts
    ?.map((part: string) => pluralize.singular(part))
    .map((part: string) => capitalize(part))
    .join("");
};
export const getModelFileName = (
  str: string | undefined

): string | undefined => {
  let parts = str?.split("_");
  return parts
    ?.map((part: string) => pluralize.singular(part))
    .map((part: string, index: number) =>
      index !== 0 ? capitalize(part) : part
    )
    .join("");
};

export const translateDataTypes = (
  data: JSONSchemaPropertyType
): JSONSchemaPropertyType => {
  data.column_type =
    (translationMigToModel as any)[data.column_type||'0'] || data.column_type;
  return data;
};

export const translateDataTypesForType=(data:ColumnType):ColumnType=>{
  data.column_type =
    (translationMigToType as any)[data.column_type] || data.column_type;
  return data;
}

export const getRelationName = (table_name: string, relation_type: string): string => {
  return relation_type === "BelongsToOneRelation" ?getSingularizedName(table_name):table_name;
}

const getSingularizedName = (table_name: string): string => {
  if(!table_name.includes("_")){
    return pluralize.singular(table_name);
  }
  let parts = table_name?.split("_");
  return parts
    ?.map((part: string) => pluralize.singular(part))
    .join("_");
}