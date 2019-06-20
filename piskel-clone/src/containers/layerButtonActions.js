/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

function Add(state) {
  console.log('add');
  console.log(state);
  const {
    frames, scale, framesKeys,
    layers, currentLayerIndex, layersNumber,
  } = state;
  let { currentLayerName } = state;

  const newLayers = layers.slice();
  newLayers[currentLayerIndex] = {
    name: currentLayerName,
    frames: frames.slice(),
    framesKeys: framesKeys.slice(),
  };

  const newLayer = {
    name: `Layer ${layersNumber + 1}`,
    frames: [new Array(scale ** 2).fill('#ffffff00')],
    framesKeys: [Math.random()],
  };

  newLayers.splice(currentLayerIndex, 0, newLayer);
  currentLayerName = `Layer ${layersNumber + 1}`;

  return { newLayers, currentLayerIndex, currentLayerName };
}

function Del(state) {
  console.log('Del');
  const {
    layers,
  } = state;
  let { currentLayerIndex, currentLayerName } = state;
  if (layers.length === 1) return null;
  const newLayers = layers.slice();
  newLayers.splice(currentLayerIndex, 1);
  if (currentLayerIndex === layers.length - 1) {
    currentLayerIndex -= 1;
  }
  currentLayerName = newLayers[currentLayerIndex].name;
  return { newLayers, currentLayerIndex, currentLayerName };
}

function Up(state) {
  console.log('Up');
  const { layers, currentLayerName } = state;
  let { currentLayerIndex } = state;
  if (layers.length === 1 || currentLayerIndex === 0) return null;
  const newLayers = layers.slice();
  newLayers.splice(currentLayerIndex - 1, 0, ...newLayers.splice(currentLayerIndex, 1));
  currentLayerIndex -= 1;
  return { newLayers, currentLayerIndex, currentLayerName };
}

function Down(state) {
  console.log('Down');
  const { layers, currentLayerName } = state;
  let { currentLayerIndex } = state;
  if (layers.length === 1 || currentLayerIndex === layers.length - 1) return null;
  const newLayers = layers.slice();
  newLayers.splice(currentLayerIndex, 0, ...newLayers.splice(currentLayerIndex + 1, 1));
  currentLayerIndex += 1;
  return { newLayers, currentLayerIndex, currentLayerName };
}

const buttonActionMap = {
  Add,
  Del,
  Up,
  Down,
};

export default buttonActionMap;
