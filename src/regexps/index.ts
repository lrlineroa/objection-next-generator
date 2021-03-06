export const table_name_statement_regex=/createTable\(\"([a-z_])+\"/gi;
export const column_definition_statement_regex=/table(\t|\n|\r| )*\.(string|increments|boolean|date|integer)\(\"([a-z_])+\"\)/gi;
export const column_definition_statement_global=/table[^; =>]+;/g;
export const column_required_statement_regex=/table(\t|\n|\r| )*\.(string|increments|boolean|date|integer)\(\"([a-z_])+\"\)(.*).notNullable\(\)/gi;
export const trim_all_spaces_regex=/(\t|\n|\r| )+/g;
export const reference_definition=/references\(\"(.)+\"\)/gi;
export const sql_table_definition_regexp=/CREATE TABLE((\t|\n|\r|.)*?)\);/g;
export const sql_table_name_regexp=/CREATE TABLE((\t|\n|\r|.)*?)\(/g;
export const sql_column_definition_regexp=/`.+`\s\w+/g;
export const sql_timestamps_definition_regexp=/timestamps/g;
export const primary_key_definition_regexp=/PRIMARY KEY \(`\w+`\)/g;
export const required_properties_definition_regexp=/KEY `REQ` \(.*\)/g;
export const unique_properties_definition_regexp=/KEY `UNIQ` \(.*\)/g;
export const foreign_key_definition_regexp=/FOREIGN KEY \(`\w+`\) REFERENCES `\w+`\(`\w+`\)/g;