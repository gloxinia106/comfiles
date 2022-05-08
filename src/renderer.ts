import "module-alias/register";
import * as fs from "fs";
import * as path from "path";
import { ipcRenderer } from "electron";
import { addDirElement } from "@src/control-element";
import { sortArray } from "@src/tools";
import { ADD_FOLDER, LOCAL_FOLDER } from "@src/constant";
import { startBtn } from "@src/process";

const localFolderElement: HTMLDivElement =
  document.querySelector(".local-folder");
const localFolderBtnElement: HTMLButtonElement =
  document.querySelector(".local-folder-btn");
const foldersContainerElement: HTMLDivElement =
  document.querySelector(".folders-container");
const plusFolderElement: HTMLDivElement =
  document.querySelector(".plus-folder");

const startBtnElement: HTMLButtonElement = document.querySelector(".start-btn");

let destLocalPath = __dirname;
let foldersPath: string[] = [];

localFolderElement.innerText = __dirname;

localFolderBtnElement.addEventListener("click", () => {
  ipcRenderer.send("select-folder", LOCAL_FOLDER);
});

ipcRenderer.on("local-folder-path", (_, paths) => {
  localFolderElement.innerText = paths[0];
  destLocalPath = paths[0];
});

plusFolderElement.addEventListener("click", () => {
  ipcRenderer.send("select-folder", ADD_FOLDER, "multiSelections");
});

ipcRenderer.on("add-folder-path", (_, paths) => {
  paths.forEach((path: string) => {
    foldersPath.push(path);
  });
  foldersPath = sortArray(foldersPath);
  const sortedPaths = sortArray(paths);
  addDirElement(sortedPaths, foldersContainerElement);
  deleteBtnControl();
});

foldersContainerElement.addEventListener("drop", (event) => {
  event.preventDefault();
  event.stopPropagation();

  const dirs = event.dataTransfer.files;
  const dirPaths = Array.prototype.map
    .call(dirs, (dir: File) => {
      if (fs.lstatSync(path.normalize(dir.path)).isDirectory()) {
        return dir.path;
      }
    })
    .filter(Boolean);
  foldersPath = [...foldersPath, ...dirPaths];
  foldersPath = sortArray(foldersPath);
  const sortedDirPaths = sortArray(dirPaths);
  addDirElement(sortedDirPaths, foldersContainerElement);
  deleteBtnControl();
});

foldersContainerElement.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.stopPropagation();
});

startBtnElement.addEventListener("click", () => {
  startBtn(destLocalPath, foldersPath);
  window.alert("완료했습니다!");
});

const deleteBtnControl = () => {
  const deleteBtns = document.querySelectorAll(".folder-delete-btn");
  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", (e) => {
      const deletedFolders = foldersPath.filter((folderPath) => {
        const spanFolderName = (<Element>e.target).nextElementSibling
          .nextElementSibling.textContent;
        const arrayFolderName = path.basename(path.normalize(folderPath));
        return spanFolderName !== arrayFolderName;
      });
      foldersPath = deletedFolders;
      deleteBtn.parentElement.remove();
    });
  });
};
