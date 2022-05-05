import * as path from "path";
import * as fs from "fs";

export const addDirElement = (
  dirPaths: string[],
  conbineContainer: HTMLDivElement
): void => {
  dirPaths.forEach((dirPath) => {
    if (fs.lstatSync(path.normalize(dirPath)).isDirectory()) {
      const folderName = path.basename(dirPath);
      const div = document.createElement("div");
      div.className = "folder-icon-container";

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "folder-delete-btn";

      const xmlns = "http://www.w3.org/2000/svg";
      const folderSvgElem = document.createElementNS(xmlns, "svg");
      folderSvgElem.setAttributeNS(null, "viewBox", "0 0 20 20");
      folderSvgElem.setAttributeNS(null, "fill", "currentColor");

      const xSvgElem = document.createElementNS(xmlns, "svg");
      xSvgElem.setAttributeNS(null, "viewBox", "0 0 20 20");
      xSvgElem.setAttributeNS(null, "fill", "currentColor");

      // draw folder
      const folderCoords =
        "M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z";
      const folderPathElem = document.createElementNS(xmlns, "path");
      folderPathElem.setAttributeNS(null, "d", folderCoords);

      const xCoords =
        "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z";
      const xPathElem = document.createElementNS(xmlns, "path");
      xPathElem.setAttributeNS(null, "d", xCoords);
      xPathElem.setAttributeNS(null, "fill-rule", "evenodd");
      xPathElem.setAttributeNS(null, "clip-rule", "evenodd");

      const span = document.createElement("span");
      span.className = "folder-name";
      span.innerText = folderName;

      conbineContainer.appendChild(div);
      div.appendChild(deleteBtn);
      deleteBtn.appendChild(xSvgElem);
      xSvgElem.appendChild(xPathElem);
      div.appendChild(folderSvgElem);
      folderSvgElem.appendChild(folderPathElem);
      div.appendChild(span);
    } else {
      return;
    }
  });
};
