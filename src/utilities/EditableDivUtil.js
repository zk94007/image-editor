import { ANCHOR_POSITION } from "../components/DesignSection/EditableDiv/EditOptions/Spacing/Spacing";
import Quill from 'quill';

export const getRange = () => {
  if (window.getSelection) {
    var sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    }
  } else if (document.selection && document.selection.createRange) {
    return document.selection.createRange();
  }
  return null;
}

export const getClosestParent = (selector) => {
  let parent = getParent();
  if (parent) {
    return parent.closest(selector);
  }
  return null;
}

export const getParent = () => {
  let range = getRange();
  if (range) {
    return range.startContainer.parentNode
  }
  return null;
}
export const saveSelection = () => {
  return getRange();
}

export const restoreSelection = (range) => {
  if (range) {
    if (window.getSelection) {
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (document.selection && range.select) {
      range.select();
    }
  }
}

export const isContentSelected = () => {
  let range = getRange();
  if (range) {
    if (range.startOffset !== range.endOffset) {
      return true;
    }
  }
  return false;
}

const setStyleToElement = (element, getStyleValue, styleName, attrName) => {

  let colorAttr = attrName ? element.getAttribute(attrName) : null;
  let colorStyle = styleName ? element.style[styleName] : null;

  if (colorAttr) {
    element.setAttribute(attrName, getStyleValue(element));
  } else if (colorStyle) {
    element.style[styleName] = getStyleValue(element);
  }
}

export const applyStyleToChildElements = (element, getStyleValue, styleName, attrName) => {
  if (element.children && element.children.length > 0) {
    let children = element.children;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      setStyleToElement(child, getStyleValue, styleName, attrName);
      if (child.children.length > 0) {
        applyStyleToChildElements(child, getStyleValue, styleName, attrName);
      }
    }
  }
}

export const execComm = (command, value = null) => {
  document.execCommand(command, false, value);
}

export const getQueryCommandValue = (command) => {
  return document.queryCommandValue(command);
}

export const changeTopOfEditableDiv = (zoomLevel) => {
  let editableDiv = document.getElementById('contenteditable');
  let oldHeight = editableDiv.clientHeight;

  return (anchorPosition) => {
    editableDiv = document.getElementById('contenteditable');
    let currentTop = parseFloat(editableDiv.style.top);
    let newHeight = editableDiv.clientHeight;

    if (anchorPosition === ANCHOR_POSITION.TOP) {
      editableDiv.style.top = currentTop - ((newHeight - oldHeight) * zoomLevel) + 'px';
    } else if (anchorPosition === ANCHOR_POSITION.CENTRE) {
      editableDiv.style.top = currentTop - (((newHeight - oldHeight) / 2) * zoomLevel) + 'px';
    }
    oldHeight = newHeight;
  }
}

export const findElementWithStyle = (element, styleName) => {
  if (!element || !element.style) return null;
  if (element.style[styleName] || element.getAttribute(styleName)) {
    return element;
  }
  if (element.parentNode) {
    return findElementWithStyle(element.parentNode, styleName);
  }
}

export const getQuillContainer = () => {
  let container = document.querySelector('#container');
  if (container) {
    return Quill.find(document.querySelector('#container'));
  }

  return null;
}

export const getFormat = () => {
  let quill = getQuillContainer();
  if (quill) {
    let format = quill.getFormat();
    return format;
  }
  return {};
}

export const getFonts = (font) => {
  const fonts = [{
    label: 'Arial',
    font: 'arial'
  },
  {
    label: 'Mirza',
    font: 'mirza'
  },
  {
    label: 'Comic Sans MS',
    font: 'Comic Sans MS'
  },
  {
    label: 'Impact',
    font: 'Impact'
  },
  {
    label: 'Lucida Sans Unicode',
    font: 'Lucida Sans Unicode'
  },
  {
    label: 'Tahoma',
    font: 'Tahoma'
  }];
  if (font) {
    return fonts.find(f => f.font === font);
  } else {
    return fonts;
  }
}


// const createEvent = () => {
//   event = new CustomEvent('formatChanged');
// }

export const createAndDispatchEvent = (data, eventName) => {
  let event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
}

export const registerUpperCase = () => {
  const Parchment = Quill.import('parchment');
  const config = {
    scope: Parchment.Scope.BLOCK,
    whitelist: ['uppercase', 'none']
  };

  var style = new Parchment.Attributor.Style('texttransform', 'text-transform', config);
  Quill.register(style, true);
}
registerUpperCase();

export const registerBlockColor = () => {
  const Parchment = Quill.import('parchment');
  const config = {
    scope: Parchment.Scope.BLOCK,
    whitelist: null
  };

  var style = new Parchment.Attributor.Style('listcolor', 'color', config);
  Quill.register(style, true);
}
registerBlockColor();

const registerFontSize = () => {
  const Parchment = Quill.import('parchment');
  var Size = Quill.import('attributors/style/size');
  //let whiteListFontSizeList = fontSizeList.map(fontSize => fontSize + 'px');
  Size.scope = Parchment.Scope.BLOCK;
  Size.whitelist = null;;
  Quill.register(Size, true);
}

registerFontSize();

export const addColorToParent = (color, range) => {
  let quill = getQuillContainer();

  if (quill && range) {
    let selectedText = quill.getText(range.index, range.length);

    if (selectedText && selectedText !== quill.getText()) {
      let parent = getClosestParent('li, p');
      if (parent) {
        if (parent.innerText === selectedText) {
          quill.format('listcolor', color);
        }
      }
    } else {
      quill.format('listcolor', color);
    }
  }
}