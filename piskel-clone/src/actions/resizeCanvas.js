/* global document */

import { getHex } from '../utils/utils';
import { drawFullCanvas } from './tools/toolAction';

const resizeFrame = (frame, prevScale, nextScale) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = prevScale;
  canvas.height = prevScale;
  drawFullCanvas(canvas, frame, prevScale);
  const nextCanvas = document.createElement('canvas');
  const nextCtx = nextCanvas.getContext('2d');
  nextCanvas.width = nextScale;
  nextCanvas.height = nextScale;
  const coord = Math.abs((nextScale - prevScale) / 2);
  if (prevScale < nextScale) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    nextCtx.putImageData(imageData, coord, coord);
  } else {
    const imageData = ctx.getImageData(coord, coord, nextCanvas.width, nextCanvas.height);
    nextCtx.putImageData(imageData, 0, 0);
  }
  const { data } = nextCtx.getImageData(0, 0, nextCanvas.width, nextCanvas.height);
  return data;
};

const resizeFrames = (resizedFrames, prevScale, nextScale) => resizedFrames.map((frame) => {
  const pixels = [];
  const data = resizeFrame(frame, prevScale, nextScale);
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = data.slice(i, i + 4);
    pixels.push(`#${getHex(r)}${getHex(g)}${getHex(b)}${getHex(a)}`);
  }
  return pixels;
});

export default resizeFrames;
