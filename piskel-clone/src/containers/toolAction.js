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

function eraser({ coord }, { scale, backgroundColor }, canvas, pixels) {
  const { x, y } = coord;
  const drawnPixels = pixels;
  const ctx = canvas.getContext('2d');
  const pixelSize = canvas.width / scale;
  ctx.fillStyle = backgroundColor;
  ctx.clearRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  drawnPixels[y * scale + x] = backgroundColor;
}

function drawCanvas(node, pixels, scale) {
  const pixelSize = node.width / scale;
  const ctx = node.getContext('2d');
  for (let i = 0; i < scale; i += 1) {
    const y = i * pixelSize;
    for (let j = 0; j < scale; j += 1) {
      const x = j * pixelSize;
      ctx.fillStyle = pixels[y / pixelSize * scale + x / pixelSize];
      ctx.fillRect(x, y, pixelSize, pixelSize);
    }
  }
}

function fill({ coord }, { scale, primaryColor }, canvas, pixels) {
  const { x, y } = coord;
  const drawnPixels = pixels;
  const around = [{dx: -1, dy: 0}, {dx: 1, dy: 0},
    {dx: 0, dy: -1}, {dx: 0, dy: 1}];
  let targetColor = pixels[y * scale + x];
  let drawn = [{x, y, color: primaryColor}];
  for (let i = 0; i < drawn.length; i++) {
    for (let {dx, dy} of around) {
      let x = drawn[i].x + dx;
      let y = drawn[i].y + dy;
      if (x >= 0 && x <= scale &&
      y >= 0 && y <= scale &&
      drawnPixels[y * scale + x] === targetColor &&
      !drawn.some(p => p.x === x && p.y === y)) {
      drawn.push({x, y, color: primaryColor});
      }
    }
  }
  drawn.forEach(item => drawnPixels[item.y * scale + item.x] = item.color)
  drawCanvas(canvas, drawnPixels, scale);
}

function fillAll({ coord }, { scale, primaryColor }, canvas, pixels) {
  const { x, y } = coord;
  const drawnPixels = pixels;
  let targetColor = drawnPixels[y * scale + x];
  drawnPixels.forEach((pixel, i, arr) => {
    if (pixel === targetColor) arr[i] = primaryColor;
  })
  drawCanvas(canvas, drawnPixels, scale);
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
  eraser,
  fill,
  fillAll,
};

export { toolActionMap, getPixelPosition };
