import * as path from "path";

export const sortArray = (arr: string[]): string[] => {
  console.log(arr);
  return arr.sort(function (a, b) {
    a = path.normalize(path.basename(a));
    b = path.normalize(path.basename(b));
    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
};
