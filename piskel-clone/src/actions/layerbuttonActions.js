import DEFAULT from '../containers/Editor/constant/constants';

function Add(state) {
  const {
    frames, scale, framesKeys,
    layers, activeLayerIndex, layersNumber,
  } = state;
  let { layerName } = state;

  const newLayers = layers.slice();
  newLayers[activeLayerIndex] = {
    name: layerName,
    frames: frames.slice(),
    framesKeys: framesKeys.slice(),
  };

  const newLayer = {
    name: `Layer ${layersNumber + 1}`,
    frames: new Array(frames.length),
    framesKeys: [],
  };

  newLayer.frames.fill(new Array(scale ** 2).fill(DEFAULT.color.background));
  for (let i = 0; i < frames.length; i += 1) {
    newLayer.framesKeys.push(Math.random());
  }

  newLayers.splice(activeLayerIndex, 0, newLayer);
  layerName = `Layer ${layersNumber + 1}`;

  return { newLayers, activeLayerIndex, layerName };
}

function Del(state) {
  const {
    layers,
  } = state;
  let { activeLayerIndex, layerName } = state;
  if (layers.length === 1) return null;
  const newLayers = layers.slice();
  newLayers.splice(activeLayerIndex, 1);
  if (activeLayerIndex === layers.length - 1) {
    activeLayerIndex -= 1;
  }
  layerName = newLayers[activeLayerIndex].name;
  return { newLayers, activeLayerIndex, layerName };
}

function Up(state) {
  const { layers, layerName } = state;
  let { activeLayerIndex } = state;
  if (layers.length === 1 || activeLayerIndex === 0) return null;
  const newLayers = layers.slice();
  newLayers.splice(activeLayerIndex - 1, 0, ...newLayers.splice(activeLayerIndex, 1));
  activeLayerIndex -= 1;
  return { newLayers, activeLayerIndex, layerName };
}

function Down(state) {
  const { layers, layerName } = state;
  let { activeLayerIndex } = state;
  if (layers.length === 1 || activeLayerIndex === layers.length - 1) return null;
  const newLayers = layers.slice();
  newLayers.splice(activeLayerIndex, 0, ...newLayers.splice(activeLayerIndex + 1, 1));
  activeLayerIndex += 1;
  return { newLayers, activeLayerIndex, layerName };
}

const buttonActionMap = {
  Add,
  Del,
  Up,
  Down,
};

export default buttonActionMap;
