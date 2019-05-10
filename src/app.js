import jsPDF from "jspdf";

import { dataToBlob } from "./blob";

const $ = (sel, ctx) => (ctx || document).querySelectorAll(sel);
const on = (elt, evtName, fn) => elt.addEventListener(evtName, fn, false);

const pdfWrapElt = $("#pdf-wrap")[0];
const makePdfBtn = $("#makepdf")[0];
const toggleCanvasBtn = $("#toggle")[0];
const canvas = $("#c")[0];
const ctx = canvas.getContext("2d");

const WIDTH = 1400;
const HEIGHT = 20000;

const MAX_WIDTH = 14400;
const MAX_HEIGHT = 14400;

// Main

const main = () => {
  paintCanvas();

  on(makePdfBtn, "click", evt => {
    pdfWrapElt.innerHTML = "making...";
    console.log("clicked...");
    window.setTimeout(makePdf, 100);
  });

  on(toggleCanvasBtn, "click", evt => {
    canvas.classList.toggle("show");
  });
};

// Functions

const paintCanvas = () => {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  Object.assign(canvas.style, {
    width: `${WIDTH}px`,
    height: `${HEIGHT}px`
  });

  const _colors = ["#F00", "#F90", "#FF0", "#0F0", "#00F", "#0FF"];
  let _colorI = -1;

  const nextColor = () => {
    _colorI = (_colorI + 1) % _colors.length;
    return _colors[_colorI];
  };

  ctx.font = "160px Helvetica";
  ctx.textBaseline = "top";

  const rowHeight = 200;

  let i = 0;
  while (i * rowHeight < HEIGHT) {
    ctx.fillStyle = nextColor();
    ctx.fillRect(0, i * rowHeight, WIDTH, rowHeight);
    ctx.fillStyle = "#fff";
    ctx.fillText(`ROW: ${i}`, 20, i * rowHeight + 10);
    i++;
  }
};

const makePdf = () => {
  let doc;
  let remainingWidth = canvas.width;
  let remainingHeight = canvas.height;
  let curX = 0;
  let curY = 0;

  let first = true;

  while (true) {
    let [curWidth, curHeight] = getNextDims(remainingWidth, remainingHeight);
    console.log("CUR_WIDTH", curWidth, "CUR_HEIGHT", curHeight); //REMM
    if (curWidth <= 0 || curHeight <= 0) {
      break;
    }
    if (first) {
      doc = new jsPDF({
        orientation: "portrait",
        unit: "pt", // in, mm
        format: [curWidth, curHeight],
        compressPdf: true
      });
      first = false;
    } else {
      doc.addPage(curWidth, curHeight);
    }

    const img = sliceImage(canvas, curX, curY, curWidth, curHeight);
    const dataURL = img.toDataURL("image/jpeg", 1);
    doc.addImage(dataURL, "JPEG", 0, 0, curWidth, curHeight);

    // TODO - cut width also...
    remainingHeight -= curHeight;
    curY += curHeight;
  }

  let blob = dataToBlob(doc.output(), "application/pdf");
  let url = window.URL.createObjectURL(blob);

  // window.location.assign(url);
  const link = document.createElement("a");
  link.download = "image.pdf";
  link.href = url;
  link.textContent = "Download PDF";
  pdfWrapElt.innerHTML = "";
  pdfWrapElt.appendChild(link);
};

const getNextDims = (width, height) => {
  return [Math.min(width, MAX_WIDTH), Math.min(height, MAX_HEIGHT)];
};

const sliceImage = (img, x, y, width, height) => {
  const canv = document.createElement("canvas");
  const ctx = canv.getContext("2d");
  canv.width = width;
  canv.height = height;
  ctx.drawImage(img, -x, -y);
  return canv;
};

// Main

main();
