export function downloadBase64File(base64Data, filename) {
  var element = document.createElement('a');
  element.setAttribute('href', base64Data);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function base64StringtoFile(base64String, filename) {
  var arr = base64String.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export function extractImageFileExtensionFromBase64(base64Data) {
  return base64Data.substring("data:image/".length, base64Data.indexOf(";base64"))
}

export function image64toCanvasRef(canvasRef, image64, pixelCrop, imageWidth, imageHeight, callback) {
  // const canvas = canvasRef // document.createElement('canvas');
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width * imageWidth / 100;
  canvas.height = pixelCrop.height * imageHeight / 100;
  const ctx = canvas.getContext('2d');
  const image = new Image();
  image.src = image64;
  image.crossOrigin = "anonymous";
  image.onload = function () {
    ctx.drawImage(
      image,
      pixelCrop.x * image.naturalWidth / 100,
      pixelCrop.y * image.naturalHeight / 100,
      pixelCrop.width * image.naturalWidth / 100,
      pixelCrop.height * image.naturalHeight / 100,
      0,
      0,
      pixelCrop.width * imageWidth / 100,
      pixelCrop.height * imageHeight / 100
    )
    callback(canvas.toDataURL('image/jpeg'));
  }
}