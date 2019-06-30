
export function getUpdatedLayers(state) {
  const {
    activeLayerIndex,
    layers, layerName, frames,
    framesKeys,
  } = state;
  const updatedLayers = layers.slice();
  updatedLayers[activeLayerIndex] = {
    name: layerName,
    frames: frames.slice(),
    framesKeys: framesKeys.slice(),
  };
  return updatedLayers;
}

export function getHex(n) {
  return n.toString(16).padStart(2, '0');
}
