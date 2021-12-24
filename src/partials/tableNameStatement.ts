import { sql_table_definition_regexp, sql_table_name_regexp, table_name_statement_regex } from "@regexps";
import { extract, extractMatch } from "@utils/extractors";
import { getPartialReverseTemplate } from "@utils/fileSystem";
const reverseMustache = require("reverse-mustache");
const extractTableNameStatement = (content: string): string | null => {
  table_name_statement_regex.lastIndex = 0;
  let extraction = extract(table_name_statement_regex, content);
  return extraction?.[0] || null;
};

export const getTableName = (migrationFile: string): string=> {
  const table_name_statement_template = getPartialReverseTemplate(
    "table_name_statement.mustache"
  );
  const table_name_statement = extractTableNameStatement(migrationFile);
  let result = reverseMustache({
    template: table_name_statement_template,
    content: table_name_statement,
  });
  return result?.table_name;
};

export const extractSQLTableDefinitions=(content: string): string[] | null => {
  sql_table_definition_regexp.lastIndex = 0;
  let extraction = extractMatch(sql_table_definition_regexp, content);
  return extraction;
}

export const extractSQLTableNameStatement = (content: string): string | null => {
  sql_table_name_regexp.lastIndex = 0;
  let extraction = extract(sql_table_name_regexp, content);
  return extraction?.[0] || null;
};