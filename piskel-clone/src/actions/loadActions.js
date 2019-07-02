/* global document, window */

function getHex(n) {
  return n.toString(16).padStart(2, '0');
}

function initImg(img, base64PNG) {
  const image = img;
  const promise = new Promise((resolve) => {
    image.onload = () => {
      resolve('load');
    };
    image.src = base64PNG;
  });
  return promise;
}

async function getFramesFromPiskel(layer, width, height) {
  const { layout, base64PNG } = layer.chunks[0];
  const { frameCount } = layer;
  const img = document.createElement('img');
  img.width = width * frameCount;
  img.height = height;
  await initImg(img, base64PNG);
  const canvas = document.createElement('canvas');
  canvas.width = frameCount * width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
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

async function getLayer(layerItem, width, height) {
  const layer = JSON.parse(layerItem);
  const tempFramesKeys = layer.chunks[0].layout.map(() => Math.random());
  const tempFrames = await getFramesFromPiskel(layer, width, height);
  return {
    name: layer.name,
    frames: tempFrames,
    framesKeys: tempFramesKeys,
  };
}

async function getTempLayers(piskel) {
  const { width, height } = piskel;
  if (!(width === height && (width === 32 || width === 64 || width === 128))) {
    throw new Error(`[${width}x${height}]. Only 32x32, 64x64, 128x28 resolutions are supported.`);
  }
  const layers = await Promise.all(piskel.layers.map(
    layerItem => getLayer(layerItem, width, height),
  ));
  return layers;
}

function loadFile() {
  const promise = new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.own, .piskel';
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

export { loadFile, getTempLayers };
