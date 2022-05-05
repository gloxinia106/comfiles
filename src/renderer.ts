import "module-alias/register";
import { ipcRenderer } from "electron";
import * as path from "path";
import { addDirElement } from "@src/control-element";

const localFolderPath: HTMLDivElement = document.querySelector(".local-folder");
const localFolderBtn: HTMLButtonElement =
  document.querySelector(".local-folder-btn");
const conbineContainer: HTMLDivElement = document.querySelector(
  ".conbine-folders-container"
);

let savedLocalPath = __dirname;
let localFoldersPath: string[] = [];

localFolderPath.innerText = __dirname;

localFolderBtn.addEventListener("click", onClickLocalFolderBtn);

function onClickLocalFolderBtn() {
  ipcRenderer.send("click-local-folder");
  ipcRenderer.on("folder-path", (_, folderPath) => {
    localFolderPath.innerText = folderPath;
    savedLocalPath = folderPath;
  });
}

conbineContainer.addEventListener("drop", (event) => {
  event.preventDefault();
  event.stopPropagation();

  const dirs = event.dataTransfer.files;
  const dirPaths = Array.prototype.map.call(dirs, (dir: File) => dir.path);
  localFoldersPath = [...localFoldersPath, ...dirPaths];
  addDirElement(dirPaths, conbineContainer);
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
});

conbineContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.stopPropagation();
});
