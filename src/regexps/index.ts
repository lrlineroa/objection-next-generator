export const table_name_statement_regex=/createTable\(\"([a-z_])+\"/gi;
export const column_definition_statement_regex=/table(\t|\n|\r| )*\.(string|increments|boolean|date|integer)\(\"([a-z_])+\"\)/gi;
export const column_definition_statement_global=/table[^; =>]+;/g;
export const column_required_statement_regex=/table(\t|\n|\r| )*\.(string|increments|boolean|date|integer)\(\"([a-z_])+\"\)(.*).notNullable\(\)/gi;
export const trim_all_spaces_regex=/(\t|\n|\r| )+/g;
export const reference_definition=/references\(\"(.)+\"\)/gi;