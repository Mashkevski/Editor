function findBottomElement(evt, topElement) {
  topElement.style.display = 'none';
  const botElement = document.elementFromPoint(evt.clientX, evt.clientY);
  topElement.style.display = '';
  if (botElement === null) {
    return null;
  }
  return botElement.closest('li');
}

function highlightElement(botElement, conf) {
  if (botElement) botElement.style.opacity = '0.5';

  if (conf.prevElement && conf.prevElement !== botElement) {
    conf.prevElement.style.opacity = ''
  }
  conf.prevElement = botElement;
}

const onMouseMove = (conf, evt) => {
  const shift = conf.startPointerCoord - evt.clientY;
  conf.startPointerCoord = evt.clientY;
  const positionTop = conf.targetElement.node.offsetTop - shift;
  conf.targetElement.node.style.top = `${positionTop}px`;
  conf.bottomElement = findBottomElement(evt, conf.targetElement.node);
  // conf.bottomElement.style.opacity = ''
  highlightElement(conf.bottomElement, conf);
};

function swapElements(targetElement, bottomElement) {
  const { node } = targetElement;
  node.style.top = `${bottomElement.offsetTop}px`;
  bottomElement.style.top = `${targetElement.startPosition}px`;
}

const onMouseUp = (conf) => {
  const {
    bindOnMouseMove,
    bindOnMouseUp,
    callbackFunction,
    targetElement,
    bottomElement
  } = conf;

  if (bottomElement) {
    swapElements(targetElement, bottomElement);
    const { node } = targetElement;
    const topElementNumber = node.dataset.number;
    const bottomElementNumber = bottomElement.dataset.number;
    callbackFunction(topElementNumber, bottomElementNumber);
    bottomElement.style.opacity = ''
  } else {
    conf.targetElement.node.style.top = `${conf.targetElement.startPosition}px`;
  }

  conf.targetElement.node.style.zIndex = ``;

  document.removeEventListener('mousemove', bindOnMouseMove);
  document.removeEventListener('mouseup', bindOnMouseUp);
};

const onMouseDown = (evt, fn) => {
  const conf = {
    targetElement: {
      node: null,
      startPosition: null,
    },
    startPointerCoord: null,
    bottomElement: null,
    prevElement: null,
    callbackFunction: fn || null,
    bindOnMouseMove: null,
    bindOnMouseUp: null,
  };

  if (evt.target.tagName === 'BUTTON' || evt.button !== 0) return;
  conf.targetElement.node = evt.target.closest('li');
  conf.targetElement.startPosition = conf.targetElement.node.offsetTop;
  conf.startPointerCoord = evt.clientY;
  conf.targetElement.node.style.zIndex = `100`;

  conf.bindOnMouseMove = onMouseMove.bind(this, conf);
  conf.bindOnMouseUp = onMouseUp.bind(this, conf);

  document.addEventListener('mousemove', conf.bindOnMouseMove);
  document.addEventListener('mouseup', conf.bindOnMouseUp);
};

export default onMouseDown;


