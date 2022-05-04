import { ipcRenderer } from "electron";
import * as path from "path";

const localFilePath: HTMLDivElement = document.querySelector(".local-file");
const localFileBtn: HTMLButtonElement =
  document.querySelector(".local-file-btn");

localFilePath.innerText = __dirname;

localFileBtn.addEventListener("click", onClickLocalFileBtn);

function onClickLocalFileBtn() {
  ipcRenderer.invoke("showDialog");
}
