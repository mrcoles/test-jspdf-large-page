import jsPDF from "jspdf";

import { dataToBlob } from "./blob";

const $ = (sel, ctx) => (ctx || document).querySelectorAll(sel);
const on = (elt, evtName, fn) => elt.addEventListener(evtName, fn, false);

const pdfWrapElt = $("#pdf-wrap")[0];
const makePdfBtn = $("#makepdf")[0];
const toggleCanvasBtn = $("#toggle")[0];
const canvas = $("#c")[0];
const ctx = canvas.getContext("2d");

const width = 1400;
const height = 20000;

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
  canvas.width = width;
  canvas.height = height;

  Object.assign(canvas.style, {
    width: `${width}px`,
    height: `${height}px`
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
  while (i * rowHeight < height) {
    ctx.fillStyle = nextColor();
    ctx.fillRect(0, i * rowHeight, width, rowHeight);
    ctx.fillStyle = "#fff";
    ctx.fillText(`ROW: ${i}`, 20, i * rowHeight + 10);
    i++;
  }
};

const makePdf = () => {
  let doc = new jsPDF({
    orientation: "portrait",
    unit: "pt", // in, mm
    format: [width, height],
    compressPdf: true
  });

  let dataURL = canvas.toDataURL("image/png", 1);
  doc.addImage(dataURL, "JPEG", 0, 0, width, height);
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

//

main();
