import _ from 'lodash';
import DEFAULT from '../../containers/Editor/constant/constants';

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

function drawPixel({ coord, prevCoord }, { scale, primaryColor }, { canvas }, evt, mirrorFlag) {
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

function drawMirrorPixels(...args) {
  const mirrorFlag = true;
  return drawPixel(...args, mirrorFlag);
}

function drawDitheringPixel({ coord }, { scale, primaryColor }, { canvas }) {
  const { x, y } = coord;
  const drawnPixels = [];
  const ctx = canvas.getContext('2d');
  const pixelSize = canvas.width / scale;

  ctx.fillStyle = primaryColor;
  if ((y % 2 === 0 && x % 2 === 0) || (y % 2 !== 0 && x % 2 !== 0)) {
    return { isNextAction: true };
  }
  ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  drawnPixels.push({ x, y, color: primaryColor });
  return { drawnPixels, isNextAction: true };
}

function erasePixel({ coord }, { scale }, { canvas }) {
  const { x, y } = coord;
  const drawnPixels = [];
  const ctx = canvas.getContext('2d');
  const pixelSize = canvas.width / scale;
  ctx.clearRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  drawnPixels.push({ x, y, color: DEFAULT.color.background });
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

function lightenPixel({ coord }, { scale }, { canvas, pixels }, evt) {
  const { x, y } = coord;
  const reg = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{0,2})/i;
  const [baseColor, r, g, b, a] = pixels[y * scale + x].match(reg);
  if (baseColor === DEFAULT.color.background) return { isNextAction: false };
  const drawnPixels = [];
  let color = '';
  if (evt.ctrlKey) {
    color = `#${darkenHex(r)}${darkenHex(g)}${darkenHex(b)}${a}`;
  } else {
    color = `#${lightenHex(r)}${lightenHex(g)}${lightenHex(b)}${a}`;
  }
  drawnPixels.push({ x, y, color });
  drawCanvas(canvas, drawnPixels, scale);
  return { drawnPixels, isNextAction: true };
}

function fillPixels({ coord }, { scale, primaryColor }, { canvas, pixels }) {
  const pixelStack = [[coord.x, coord.y]];
  const targetColor = pixels[coord.y * scale + coord.x];
  if (targetColor === primaryColor) return { isNextAction: false };
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

function drawLine({ startCoord, coord }, { scale, primaryColor }, { pixels, canvas }) {
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

function drawRectangle({ startCoord, coord }, state, { pixels, canvas }, { ctrlKey }) {
  const { scale, primaryColor } = state;
  const coordinatesArray = [];
  const xStart = Math.min(startCoord.x, coord.x);
  const yStart = Math.min(startCoord.y, coord.y);
  let xEnd = Math.max(startCoord.x, coord.x);
  let yEnd = Math.max(startCoord.y, coord.y);
  if (ctrlKey) {
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

function drawEllipsis({ startCoord, coord }, { scale, primaryColor }, { pixels, canvas }, evt) {
  if (coord.x === startCoord.x
    && coord.y === startCoord.y) {
    return { isNextAction: true };
  }
  const coordinatesArray = [];
  let rx = Math.abs((coord.x - startCoord.x) / 2);
  let ry = Math.abs((coord.y - startCoord.y) / 2);
  if (evt.ctrlKey) {
    rx = Math.min(rx, ry);
    ry = rx;
  }
  const xc = Math.min(coord.x, startCoord.x) + rx;
  const yc = Math.min(coord.y, startCoord.y) + ry;

  let dx; let dy; let d1; let d2; let x; let y;
  const even = (rx - Math.floor(rx)) === 0;
  x = rx - Math.floor(rx);
  y = ry;

  d1 = (ry * ry) - (rx * rx * ry) + (0.25 * rx * rx);
  dx = 2 * ry * ry * x;
  dy = 2 * rx * rx * y;

  while (dx < dy) {
    coordinatesArray.push({ x: x + xc, y: y + yc, color: primaryColor });
    coordinatesArray.push({ x: -x + xc, y: y + yc, color: primaryColor });
    coordinatesArray.push({ x: x + xc, y: -y + yc, color: primaryColor });
    coordinatesArray.push({ x: -x + xc, y: -y + yc, color: primaryColor });
    if (d1 < 0 && (even || rx > 3)) {
      x += 1;
      dx += (2 * ry * ry);
      d1 = d1 + dx + (ry * ry);
    } else {
      x += 1;
      y -= 1;
      dx += (2 * ry * ry);
      dy -= (2 * rx * rx);
      d1 = d1 + dx - dy + (ry * ry);
    }
  }

  d2 = ((ry * ry) * ((x + 0.5) * (x + 0.5)))
  + ((rx * rx) * ((y - 1) * (y - 1)))
  - (rx * rx * ry * ry);

  while (y >= 0) {
    coordinatesArray.push({ x: x + xc, y: y + yc, color: primaryColor });
    coordinatesArray.push({ x: -x + xc, y: y + yc, color: primaryColor });
    coordinatesArray.push({ x: x + xc, y: -y + yc, color: primaryColor });
    coordinatesArray.push({ x: -x + xc, y: -y + yc, color: primaryColor });

    if (d2 > 0) {
      y -= 1;
      dy -= (2 * rx * rx);
      d2 = d2 + (rx * rx) - dy;
    } else {
      y -= 1;
      x += 1;
      dx += (2 * ry * ry);
      dy -= (2 * rx * rx);
      d2 = d2 + dx - dy + (rx * rx);
    }
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

function selectIdenticalPixels({ coord }, { scale }, { canvas, pixels }) {
  const shapeConf = {
    scale,
    primaryColor: SELECT_COLOR,
  };

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.width);
  drawFullCanvas(canvas, pixels, scale);

  const { drawnPixels, isNextAction } = fillPixels({ coord }, shapeConf, { canvas, pixels });
  return { coordinatesArray: drawnPixels, isNextAction, isSelectFunction: true };
}

function fillIdenticalPixels({ coord }, { scale, primaryColor }, { pixels, canvas }) {
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

function movePixels({ startCoord, coord }, { scale }, { pixels, canvas }) {
  if (coord.x === startCoord.x
    && coord.y === startCoord.y) {
    return { isNextAction: true };
  }
  const dx = startCoord.x - coord.x;
  const dy = startCoord.y - coord.y;
  const coordinatesArray = [];

  pixels.forEach((color, i) => {
    const y = Math.floor(i / scale) - dy;
    const x = i - Math.floor(i / scale) * scale - dx;
    if ((x >= 0 && x < scale) && (y >= 0 && y < scale)) {
      coordinatesArray.push({ x, y, color });
    }
  });

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.width);
  drawCanvas(canvas, coordinatesArray, scale);
  return { coordinatesArray, isNextAction: true };
}

function pickColor({ coord }, { scale }, { pixels }) {
  const selectedColor = pixels[coord.y * scale + coord.x];
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

const throttledLine = _.throttle(drawLine, 70);
const throttleDrawEllipsis = _.throttle(drawEllipsis, 50);
const throttleRectangle = _.throttle(drawRectangle, 50);
const throttleMove = _.throttle(movePixels, 50);

const toolActionMap = {
  pen: drawPixel,
  mirror: drawMirrorPixels,
  eraser: erasePixel,
  bucket: fillPixels,
  line: throttledLine,
  rectangle: throttleRectangle,
  circle: throttleDrawEllipsis,
  dithering: drawDitheringPixel,
  lighten: lightenPixel,
  fillRectangle,
  paintAll: fillIdenticalPixels,
  move: throttleMove,
  shape: selectIdenticalPixels,
  picker: pickColor,
};

export {
  toolActionMap, getPixelPosition,
  drawFullCanvas, drawCanvas,
};
