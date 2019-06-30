/* eslint-disable no-console */
/* eslint-disable no-debugger */
/* global document, window */

function getHex(n) {
  return n.toString(16).padStart(2, '0');
}

function getFramesFromPiskel(layer, width, height) {
  const { layout, base64PNG } = layer.chunks[0];
  const { frameCount } = layer;
  const img = document.createElement('img');
  img.src = base64PNG;
  document.body.appendChild(img);
  const canvas = document.createElement('canvas');
  canvas.width = frameCount * width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  img.remove();
  const { data } = ctx.getImageData(0, 0, img.width, img.height);
  const frames = [];
  const pixels = [];
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = data.slice(i, i + 4);
    pixels.push(`#${getHex(r)}${getHex(g)}${getHex(b)}${getHex(a)}`);
  }

  layout.forEach((item, index) => {
    const frame = [];
    for (let i = width * index; i < pixels.length; i += width * frameCount) {
      for (let j = i; j - i < width; j += 1) {
        frame.push(pixels[j]);
      }
    }
    frames.push(frame);
  });

  return frames;
}

function loadFile() {
  const promise = new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.piskel, .own';
    input.style = 'display: none';

    const readFile = (file) => {
      if (file === null) return;
      const reader = new window.FileReader();
      reader.onload = () => {
        resolve({ result: reader.result, fileName: file.name });
      };
      reader.onerror = () => {
        reject(new Error('error'));
      };
      reader.readAsText(file);
    };

    input.onchange = () => {
      readFile(input.files[0]);
      input.remove();
    };
    document.body.appendChild(input);
    input.click();
  });

  return promise;
}

export { loadFile, getFramesFromPiskel };
