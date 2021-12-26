export type ModelType = {
  table_name: string;
  model_name: string | undefined;
  json_schema?: JSONSchemaType;
  model_file_name: string | undefined;
  relation_mappings?: RelationMappingType[];
};

export type JSONSchemaType = {
  required_properties?: string[];
  properties?: JSONSchemaPropertyType[];
};

export type JSONSchemaPropertyType = {
  column_name?: string;
  column_type?: string;
};

export type RelationMappingType = {
  relation_name: string;
  relation_type:
    | "BelongsToOneRelation"
    | "HasOneRelation"
    | "HasManyRelation"
    | "ManyToManyRelation"
    | "HasOneThroughRelation";
  related_model_name: string;
  related_model_file_name: string;
  from: string;
  through?: RelationMappingThroughType;
  to: string;
  pk_table_name?:string;
  is_auto_reference?: boolean;

};

export type RelationMappingThroughType = {
  from?: string;
  to?: string;
};

export type RelationDefinitionInfoType = {
  column_definition: string;
  references_definition: string;
};

export type ReversedReferenceType = {
  table_name: string;
  primary_key: string;
};

export type ReversedColumnType = {
  column_name: string;
};

export type TypesType = {
  types: TypeType[];
};

export type TypeType = {
  related_model_name: string;
  columns: ColumnType[];
};

export type ColumnType = {
  column_name: string;
  column_type: string;
};

export type HttpRequestType = {
  table_name: string;
  local_host: "{{local_host}}";
  remote_host: "{{remote_host}}";
  columns: ReversedColumnType[];
  listColumns: () => string;
};

export type DataOfFileType = {
  templateName: string;
  fileName: string;
  folderName?: string;
};

export type InversedRelationMappingType = RelationMappingType & {
  model_to_edit: string;
};

export type KnexModelsType = {
  models: ModelType[];
};
