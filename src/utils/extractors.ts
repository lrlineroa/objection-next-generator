export const extract = (
  regexp: RegExp,
  testString: string
): string[] | null => {
  return regexp.exec(testString);
};

export const extractMatch= (
  regexp: RegExp,
  testString: string
): string[] | null => {
  return testString.match(regexp);
};
