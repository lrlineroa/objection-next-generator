export type DataModelType = {
  models: ModelType[];
};
export type ModelType = {
  table_name: string;
  timestamps?: boolean;
  properties: PropertyType[];
};
export type PropertyType = {
  column_name: string;
  column_type: string;
  primary?: boolean;
  autoincrement?: boolean;
  required?: boolean;
  unique?: boolean;
  foreign?: ForeignType;
};
export type ForeignType = {
  table: string;
  column: string;
};

export type GeneratedForeignType = {
  column_name: string;
  foreign: ForeignType;
};
