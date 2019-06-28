const LIGHTEN_STEP = 17;
const MAX_COLOR_VALUE = 255;
const MIN_COLOR_VALUE = 0;
const SELECT_COLOR = '#006a8a55';

function drawFullCanvas(canvas, pixels, scale, frameIndex = 0) {
  const pixelSize = canvas.height / scale;
  const ctx = canvas.getContext('2d');
  for (let i = 0; i < scale; i += 1) {
    const y = i * pixelSize;
    for (let j = 0; j < scale; j += 1) {
      const x = j * pixelSize;
      const color = pixels[y / pixelSize * scale + x / pixelSize];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x + canvas.height * frameIndex, y, pixelSize, pixelSize);
      }
    }
  }
}

function drawCanvas(canvas, drawnPixels, scale) {
  const pixelSize = canvas.height / scale;
  const ctx = canvas.getContext('2d');
  drawnPixels.forEach((pixel) => {
    const { x, y, color } = pixel;
    ctx.fillStyle = color;
    // ctx.clearRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  });
}

function getPixels({ shiftKey, ctrlKey }, x, y, color, scale) {
  const drawnPixels = [];

  if (ctrlKey) {
    drawnPixels.push({ x, y: scale - y - 1, color });
  } else if (shiftKey) {
    drawnPixels.push({ x, y: scale - y - 1, color });
    drawnPixels.push({ x: scale - x - 1, y: scale - y - 1, color });
    drawnPixels.push({ x: scale - x - 1, y, color });
  } else drawnPixels.push({ x: scale - x - 1, y, color });

  return drawnPixels;
}

function draw({ coord, prevCoord }, { scale, primaryColor }, { canvas }, evt, mirrorFlag) {
  const drawnPixels = [];
  if (Math.abs(prevCoord.x - coord.x) > 1 || Math.abs(prevCoord.y - coord.y)) {
    let x1 = prevCoord.x;
    let y1 = prevCoord.y;
    const x2 = coord.x;
    const y2 = coord.y;
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = (x1 < x2) ? 1 : -1;
    const sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;
    drawnPixels.push({ x: x1, y: y1, color: primaryColor });
    if (mirrorFlag) {
      drawnPixels.push(...getPixels(evt, x1, y1, primaryColor, scale));
    }
    while (!((x1 === x2) && (y1 === y2))) {
      const e2 = err * 2;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
      drawnPixels.push({ x: x1, y: y1, color: primaryColor });
      if (mirrorFlag) {
        drawnPixels.push(...getPixels(evt, x1, y1, primaryColor, scale));
      }
    }
    drawCanvas(canvas, drawnPixels, scale);
    return { drawnPixels, isNextAction: true };
  }

  const { x, y } = coord;
  drawnPixels.push({ x, y, color: primaryColor });
  if (mirrorFlag) {
    drawnPixels.push(...getPixels(evt, x, y, primaryColor, scale));
  }
  drawCanvas(canvas, drawnPixels, scale);
  return { drawnPixels, isNextAction: true };
}

function mirror(...args) {
  const mirrorFlag = true;
  return draw(...args, mirrorFlag);
}

function eraser({ coord }, { scale, backgroundColor }, { canvas }) {
  const { x, y } = coord;
  const drawnPixels = [];
  const ctx = canvas.getContext('2d');
  const pixelSize = canvas.width / scale;
  ctx.clearRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  drawnPixels.push({ x, y, color: backgroundColor });
  return { drawnPixels, isNextAction: true };
}

function lightenHex(n) {
  let num = +`0x${n}`;
  num += LIGHTEN_STEP;
  return num > MAX_COLOR_VALUE ? 'ff' : num.toString(16).padStart(2, '0');
}

function darkenHex(n) {
  let num = +`0x${n}`;
  num -= LIGHTEN_STEP;
  return num < MIN_COLOR_VALUE ? '00' : num.toString(16).padStart(2, '0');
}

function lighten({ coord }, { scale, backgroundColor }, { canvas, pixels }, evt) {
  const { x, y } = coord;
  const reg = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{0,2})/i;
  const [baseColor, r, g, b, a] = pixels[y * scale + x].match(reg);
  if (baseColor === backgroundColor) return { isNextAction: false };
  const drawnPixels = [];
  let color = '';
  if (evt.shiftKey) {
    color = `#${darkenHex(r)}${darkenHex(g)}${darkenHex(b)}${a}`;
  } else {
    color = `#${lightenHex(r)}${lightenHex(g)}${lightenHex(b)}${a}`;
  }
  drawnPixels.push({ x, y, color });
  drawCanvas(canvas, drawnPixels, scale);
  return { drawnPixels, isNextAction: false };
}

function bucket({ coord }, { scale, primaryColor }, { canvas, pixels }) {
  const pixelStack = [[coord.x, coord.y]];
  const targetColor = pixels[coord.y * scale + coord.x];
  const newPixels = pixels.slice();
  const drawnPixels = [];
  let newPos;
  let x;
  let y;
  let pixelPos;
  let reachLeft;
  let reachRight;

  while (pixelStack.length) {
    newPos = pixelStack.pop();
    [x, y] = newPos;
    pixelPos = (y * scale + x);
    while (y >= 0 && targetColor === newPixels[pixelPos]) {
      y -= 1;
      pixelPos -= scale;
    }
    pixelPos += scale;
    reachLeft = false;
    reachRight = false;
    while (y < scale - 1 && targetColor === newPixels[pixelPos]) {
      y += 1;
      newPixels[pixelPos] = primaryColor;
      const y1 = Math.floor(pixelPos / scale);
      const x1 = pixelPos - scale * y1;
      drawnPixels.push({ x: x1, y: y1, color: primaryColor });
      if (x > 0) {
        if (targetColor === newPixels[pixelPos - 1]) {
          if (!reachLeft) {
            pixelStack.push([x - 1, y]);
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }
      if (x < scale - 1) {
        if (targetColor === newPixels[pixelPos + 1]) {
          if (!reachRight) {
            pixelStack.push([x + 1, y]);
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }
      pixelPos += scale;
    }
  }
  drawCanvas(canvas, drawnPixels, scale);
  return { drawnPixels, isNextAction: false };
}

function line({ startCoord, coord }, { scale, primaryColor }, { pixels, canvas }) {
  let x1 = startCoord.x;
  let y1 = startCoord.y;
  const x2 = coord.x;
  const y2 = coord.y;
  const coordinatesArray = [];
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = (x1 < x2) ? 1 : -1;
  const sy = (y1 < y2) ? 1 : -1;
  let err = dx - dy;
  coordinatesArray.push({ x: x1, y: y1, color: primaryColor });

  while (!((x1 === x2) && (y1 === y2))) {
    const e2 = err * 2;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
    coordinatesArray.push({ x: x1, y: y1, color: primaryColor });
  }

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.width);
  drawFullCanvas(canvas, pixels, scale);
  drawCanvas(canvas, coordinatesArray, scale);

  return { coordinatesArray, isNextAction: true };
}

function fillRectangle({ startCoord, coord }, { scale }, { canvas, pixels }) {
  const coordinatesArray = [];
  const xStart = Math.min(startCoord.x, coord.x);
  const yStart = Math.min(startCoord.y, coord.y);
  const xEnd = Math.max(startCoord.x, coord.x);
  const yEnd = Math.max(startCoord.y, coord.y);
  for (let y = yStart; y <= yEnd; y += 1) {
    for (let x = xStart; x <= xEnd; x += 1) {
      coordinatesArray.push({ x, y, color: SELECT_COLOR });
    }
  }
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.width);
  drawFullCanvas(canvas, pixels, scale);
  drawCanvas(canvas, coordinatesArray, scale);
  return { coordinatesArray, isNextAction: true, isSelectFunction: true };
}

function rectangle({ startCoord, coord }, state, { pixels, canvas }, { shiftKey }) {
  const { scale, primaryColor } = state;
  const coordinatesArray = [];
  const xStart = Math.min(startCoord.x, coord.x);
  const yStart = Math.min(startCoord.y, coord.y);
  let xEnd = Math.max(startCoord.x, coord.x);
  let yEnd = Math.max(startCoord.y, coord.y);
  if (shiftKey) {
    const minShift = Math.min(xEnd - xStart, yEnd - yStart);
    yEnd = minShift + yStart;
    xEnd = minShift + xStart;
  }

  for (let x = xStart; x <= xEnd; x += 1) {
    coordinatesArray.push({ x, y: yStart, color: primaryColor });
    coordinatesArray.push({ x, y: yEnd, color: primaryColor });
  }

  for (let y = yStart; y <= yEnd; y += 1) {
    coordinatesArray.push({ x: xStart, y, color: primaryColor });
    coordinatesArray.push({ x: xEnd, y, color: primaryColor });
  }

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.width);
  drawFullCanvas(canvas, pixels, scale);
  drawCanvas(canvas, coordinatesArray, scale);

  return { coordinatesArray, isNextAction: true };
}

function paintAll({ coord }, { scale, primaryColor }, { pixels, canvas }) {
  const targetColor = pixels[coord.y * scale + coord.x];
  const drawnPixels = [];
  pixels.forEach((color, i) => {
    if (targetColor === color) {
      const y = Math.floor(i / scale);
      const x = i - y * scale;
      drawnPixels.push({ x, y, color: primaryColor });
    }
  });

  drawCanvas(canvas, drawnPixels, scale);
  return { drawnPixels, isNextAction: false };
}

function pickColor({ coord }, { scale }, { pixels }) {
  const selectedColor = pixels[coord.y * scale + coord.x];
  console.log(selectedColor);
  return { selectedColor, isNextAction: false };
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
  pen: draw,
  mirror,
  eraser,
  bucket,
  line,
  rectangle,
  paintAll,
  lighten,
  fillRectangle,
  picker: pickColor,
};

export {
  toolActionMap, getPixelPosition,
  drawFullCanvas, drawCanvas,
};
