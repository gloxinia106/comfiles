import * as path from "path";

export const sortArray = (arr: string[]): string[] => {
  return arr.sort(function (a, b) {
    a = path.normalize(path.basename(a));
    b = path.normalize(path.basename(b));
    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
};
