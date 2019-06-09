/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
function draw({ coord }, { scale, primaryColor }, canvas, pixels) {
  const { x, y } = coord;
  const drawnPixels = pixels;
  const ctx = canvas.getContext('2d');
  const pixelSize = canvas.width / scale;
  ctx.fillStyle = primaryColor;
  ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  drawnPixels[y * scale + x] = primaryColor;
  return {};
}

function getPixelPosition(event, scale) {
  const { target } = event;
  const targetPosition = target.getBoundingClientRect();
  const x = event.clientX - targetPosition.left;
  const y = event.clientY - targetPosition.top;
  const pixelSize = target.width / scale;
  return {
    x: (x - (x % pixelSize)) / pixelSize,
    y: (y - (y % pixelSize)) / pixelSize,
  };
}

const toolActionMap = {
  draw,
};

export { toolActionMap, getPixelPosition };
