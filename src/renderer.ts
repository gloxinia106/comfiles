import "module-alias/register";
import * as fs from "fs";
import { ipcRenderer } from "electron";
import * as path from "path";
import { addDirElement } from "@src/control-element";
import { ADD_FOLDER, LOCAL_FOLDER } from "@src/constant";
import { sortArray } from "@src/tools";

const localFolderPath: HTMLDivElement = document.querySelector(".local-folder");
const localFolderBtn: HTMLButtonElement =
  document.querySelector(".local-folder-btn");
const conbineContainer: HTMLDivElement = document.querySelector(
  ".conbine-folders-container"
);
const addFolder: HTMLDivElement = document.querySelector(".add-folder");

let savedLocalPath = __dirname;
let localFoldersPath: string[] = [];

localFolderPath.innerText = __dirname;

localFolderBtn.addEventListener("click", onClickLocalFolderBtn);

function onClickLocalFolderBtn() {
  ipcRenderer.send("click-local-folder", LOCAL_FOLDER);
}

ipcRenderer.on("local-folder-path", (_, folderPaths) => {
  localFolderPath.innerText = folderPaths[0];
  savedLocalPath = folderPaths[0];
});

addFolder.addEventListener("click", onClickAddFolder);

function onClickAddFolder() {
  ipcRenderer.send("click-local-folder", ADD_FOLDER, "multiSelections");
}

ipcRenderer.on("add-folder-path", (_, folderPaths) => {
  folderPaths.forEach((folderPath: string) => {
    localFoldersPath.push(folderPath);
  });
  localFoldersPath = sortArray(localFoldersPath);
  addDirElement(localFoldersPath, conbineContainer);
  deleteBtnControl();
});

conbineContainer.addEventListener("drop", (event) => {
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
  localFoldersPath = [...localFoldersPath, ...dirPaths];
  localFoldersPath = sortArray(localFoldersPath);
  addDirElement(localFoldersPath, conbineContainer);
  deleteBtnControl();
});

conbineContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.stopPropagation();
});

const deleteBtnControl = () => {
  const deleteBtns = document.querySelectorAll(".folder-delete-btn");
  deleteBtns.forEach((folder) => {
    folder.addEventListener("click", (e) => {
      const deletedFolders = localFoldersPath.filter((folderPath) => {
        const spanFolderName = (<Element>e.target).nextElementSibling
          .nextElementSibling.textContent;
        const arrayFolderName = path.basename(path.normalize(folderPath));
        console.log(spanFolderName);
        return spanFolderName !== arrayFolderName;
      });
      localFoldersPath = deletedFolders;
      console.log(localFoldersPath);
      folder.parentElement.remove();
    });
  });
};
