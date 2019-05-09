export function canvasToBlob(canvas, format, quality) {
  // Returns a Promise that resolves to a blob
  //
  // canvas: HTMLCanvasElement
  // format: string - via image-formats format.canvas, e.g., 'image/png'
  //
  format = format || 'image/png';
  quality = quality || 1;
  if (window.HTMLCanvasElement && HTMLCanvasElement.prototype.toBlob) {
    return new Promise(resolve =>
      canvas.toBlob(blob => resolve(blob), format, quality)
    );
  } else {
    return new Promise(resolve => {
      let dataURL = canvas.toDataURL(format, quality);
      let blob = dataURIToBlob(dataURL);
      resolve(blob);
    });
  }
}

export function dataURIToBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs
  let byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  let mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0];

  return dataToBlob(byteString, mimeString);
}

export function dataToBlob(byteString, type) {
  // write the bytes of the string to an ArrayBuffer
  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  let i = byteString.length;
  while (i--) {
    ia[i] = byteString.charCodeAt(i);
  }

  // create a blob for writing to a file
  let blob = new Blob([ab], { type: type });
  return blob;
}
