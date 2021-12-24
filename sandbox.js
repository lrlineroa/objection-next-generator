var str = "KEY `REQ` (`doc`, `doc_type_id`, `first_name`, `last_name`)";
var parts = str.split("`");
parts = parts.filter(
  (part) => /\w/g.test(part) && part.trim() !== "KEY" && part.trim() !== "REQ"
);
console.log(parts);
