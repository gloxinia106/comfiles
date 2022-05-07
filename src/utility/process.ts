import * as fs from "fs";
import * as path from "path";

export const startBtn = (localPath: string, foldersPath: string[]): void => {
  const nomalLocalPath = path.normalize(localPath);
  let startNum = 1;

  const newFolderPath = path.join(nomalLocalPath, "newFolder");
  if (!fs.existsSync(newFolderPath)) {
    fs.mkdirSync(newFolderPath);
  }

  foldersPath.forEach((folderPath) => {
    const nomalFolderPath = path.normalize(folderPath);
    const fileNames = fs.readdirSync(nomalFolderPath);
    fileNames.forEach((fileName) => {
      const oldFilePath = path.join(folderPath, fileName);
      const newFilePath = path.join(
        newFolderPath,
        fileName.replace(/^[^.]*/, startNum + "")
      );
      startNum++;
      fs.copyFileSync(oldFilePath, newFilePath);
    });
  });
};
