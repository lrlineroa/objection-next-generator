import { table_name_statement_regex } from "@regexps";
import { extract } from "@utils/extractors";
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
