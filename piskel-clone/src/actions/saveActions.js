/* global window, document */

import { drawFullCanvas } from './tools/toolAction';
import APNGencoder from './apng';
import GIFEncoder from '../utils/gif/GIFEncoder';
import { getUpdatedLayers } from '../utils/utils';

const DEFAULT_FILE_NAME = 'my-file';

const makeTextFile = (text) => {
  const data = new window.Blob([text], { type: 'text/plain' });

  return window.URL.createObjectURL(data);
};

function getCanvasData(layerItem, scale) {
  const canvas = document.createElement('canvas');
  canvas.width = layerItem.frames.length * scale;
  canvas.height = scale;
  const layout = layerItem.frames.map((frame, i) => {
    drawFullCanvas(canvas, frame, scale, i);
    return [i];
  });
  const base64PNG = canvas.toDataURL();
  return { layout, base64PNG };
}

function downloadFile(data, type) {
  const link = document.createElement('a');
  link.download = `${DEFAULT_FILE_NAME}.${type}`;
  link.href = data;
  link.click();
}

function savePiskelFormat(state) {
  const { scale, fps } = state;

  const piskelFile = {
    modelVersion: 2,
    piskel: {
      name: 'New Piskel',
      description: '',
      fps,
      height: scale,
      width: scale,
      layers: [],
      hiddenFrames: [],
    },
  };
  const updatedLayers = getUpdatedLayers(state);

  updatedLayers.forEach((layerItem) => {
    const { layout, base64PNG } = getCanvasData(layerItem, scale);
    const layer = {
      name: layerItem.name,
      opacity: 1,
      frameCount: layerItem.frames.length,
      chunks: [
        {
          layout,
          base64PNG,
        },
      ],
    };

    piskelFile.piskel.layers.push(JSON.stringify(layer));
  });

  const jsonPiskelFile = JSON.stringify(piskelFile);

  downloadFile(makeTextFile(jsonPiskelFile), 'piskel');
}

function saveOwnFormat(state) {
  const jsonPiskelFile = JSON.stringify(state);
  downloadFile(makeTextFile(jsonPiskelFile), 'own');
}

function saveApng(state) {
  const { scale, frames, fps } = state;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = scale;
  canvas.height = scale;

  const encoder = new APNGencoder(canvas);
  encoder.setRepeat(0);
  encoder.setDelay(100 / fps);
  encoder.setDispose(1);
  encoder.setBlend(1);
  encoder.start();

  const updatedLayers = getUpdatedLayers(state);
  for (let i = 0; i < frames.length; i += 1) {
    if (i > 0) ctx.clearRect(0, 0, scale, scale);
    updatedLayers.forEach((layerItem) => {
      drawFullCanvas(canvas, layerItem.frames[i], scale);
    });
    encoder.addFrame(ctx);
  }

  encoder.finish();
  encoder.download(`${DEFAULT_FILE_NAME}`);
}

function saveGif(state) {
  const { scale, frames, fps } = state;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = scale;
  canvas.height = scale;
  const encoder = new GIFEncoder();
  encoder.setRepeat(0);
  encoder.setDelay(1000 / fps);
  encoder.setDispose(2);
  encoder.setQuality(1);
  encoder.start();

  const updatedLayers = getUpdatedLayers(state);
  for (let i = 0; i < frames.length; i += 1) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    updatedLayers.forEach((layerItem) => {
      drawFullCanvas(canvas, layerItem.frames[i], scale);
    });
    encoder.addFrame(ctx);
  }

  encoder.finish();
  encoder.download(`${DEFAULT_FILE_NAME}`);
}

const saveActionMap = {
  piskel: savePiskelFormat,
  own: saveOwnFormat,
  apng: saveApng,
  gif: saveGif,
};

export default saveActionMap;
