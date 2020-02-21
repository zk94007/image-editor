import { GROUP_STATE } from "./EditableDiv";
import { calculatePositionFromShape, calculatePostionFromStageRef } from "./EditOptions/EditOptionsUtil";
import { isNullOrUndefined } from "util";
import { ELEMENT_SUB_TYPE } from "../ElementsPicker/ElementsPicker";

export function createTransperantRect(shapeRef, id) {

  let groupClientRect = shapeRef.current.getClientRect({
    skipTransform: true,
    skipShadow: true,
    skipStroke: true
  });

  let rect = {
    type: 'Rect',
    scaleX: 1,
    scaleY: 1,
    fill: "white",
    opacity: 0,
    transperantRect: true,
    draggable: false,
    isChildren: true,
    listening: false,
    id: `BACKGROUND_${id}`,
    key: `BACKGROUND_${id}`,
    parentId: id,
    offsetX: 0,
    offsetY: 0,
    ...groupClientRect
  }

  return rect;
}

const getMinXAndY = (elements) => {
  let minX = elements[0].x;
  let minY = elements[0].y;
  elements.forEach((el, index) => {
    if (el.x < minX) {
      minX = el.x;
    }
    if (el.y < minY) {
      minY = el.y
    }
  });
  //let min = elements.map(el => el.x).reduce((acc, currentValue) => Math.min(acc, currentValue));

  return { minX, minY };
}

const setChildPosition = (childElements, minX, minY) => {
  return childElements.map((el) => {
    el.x = el.x - minX;
    el.y = el.y - minY;
    return el;
  });
}

export const createGroup = (minX, minY, childElements, hasChildGroup, hasChildElement, generatedId) => {
  childElements = setChildPosition(childElements, minX, minY);
  let groupObj = {
    type: "Group",
    x: minX,
    y: minY,
    childElements: childElements,
    draggable: true,
    groupState: GROUP_STATE.TEMPORARY,
    hasChildGroup: hasChildGroup,
    hasChildElement: hasChildElement,
    id: generatedId,
    key: generatedId,
    name: 'object',
    subType: ELEMENT_SUB_TYPE.GROUP
  };
  return groupObj;
}

export const createTempGroup = (selectedElements, layers, generatedId) => {
  let copyLayers = [...layers];
  let childElements = [];
  let hasChildGroup = false;
  let hasChildElement = false;
  let index = -1;

  for (let i = layers.length - 1; i >= 0; i--) {
    let item = layers[i];

    if (selectedElements.indexOf(item.id) > -1) {
      let attrs = {
        ...item,
        isChildren: true,
        parentId: generatedId,
        oldPosition: i
      };

      hasChildGroup = hasChildGroup || attrs.type === 'Group';
      hasChildElement = hasChildElement || attrs.type !== 'Group';
      index = (index !== -1 && i === index + 1) ? index : i;
      childElements.unshift(attrs);
      copyLayers.splice(i, 1);
    }
  };

  let { minX, minY } = getMinXAndY(childElements);

  let groupObj = createGroup(minX, minY, childElements, hasChildGroup, hasChildElement, generatedId)
  index >= 0 ? copyLayers.splice(index, 0, groupObj) : copyLayers.push(groupObj);

  return copyLayers;
}

function extractChild(obj, shapeRefCurrent, copyLayers, stageRef) {
  if (obj.transperantRect) return;
  let child = { ...obj };
  let oldPosition = child.oldPosition;

  let shapeRefChild = shapeRefCurrent.findOne((node) => node.getId() === obj.id);
  if (!shapeRefChild) return;

  let absolutePosition = shapeRefChild.getAbsolutePosition();
  const matrix = shapeRefChild.getAbsoluteTransform().getMatrix();
  const attrs = decompose(matrix, shapeRefCurrent);

  child = {
    ...child,
    ...attrs,
    oldPosition: null,
    isChildren: false,
    parentId: null,
    x: calculatePositionFromShape(absolutePosition.x, shapeRefCurrent) - calculatePostionFromStageRef(stageRef.current.x(), stageRef),
    y: calculatePositionFromShape(absolutePosition.y, shapeRefCurrent) - calculatePostionFromStageRef(stageRef.current.y(), stageRef)
  };
  if (oldPosition >= 0 && !isNullOrUndefined) {
    copyLayers.splice(oldPosition, 0, child);
  } else {
    copyLayers.push(child);
  }

  return child.id;
}

const extractChildElements = (layers, layerIndex, layer, shapeRef, canDeletePermanentGroup, stageRef) => {
  let copyLayers = [...layers];
  copyLayers.splice(layerIndex, 1);
  let selectedIds = [];

  layer.childElements.forEach(l => {
    if (l.type === 'Group' && canDeletePermanentGroup) {
      l.childElements.forEach((innerChildEl) => {
        let id = extractChild(innerChildEl, shapeRef, copyLayers, stageRef);
        if (id) {
          selectedIds.push(id);
        }
      });
    } else {
      extractChild(l, shapeRef, copyLayers, stageRef);
    }
  });
  return { copyLayers, selectedIds };
}

export const deleteTempGroup = (layers, groupId, stageRef, canDeletePermanentGroup, generateKey) => {
  let shapeRefCurrent = stageRef.current.findOne((node) => node.getId() === groupId);
  if (!shapeRefCurrent) {
    return { copyLayers: layers, groupId: null };
  };

  let layerIndex = layers.findIndex(l => l.id === shapeRefCurrent.attrs.id);
  let layer = layers[layerIndex];

  if (layer && layer.groupState !== GROUP_STATE.PERMANENT) {
    let { copyLayers, selectedIds } = extractChildElements(layers, layerIndex, layer, shapeRefCurrent, canDeletePermanentGroup, stageRef);
    if (canDeletePermanentGroup) {
      let generatedId = generateKey();
      copyLayers = createTempGroup(selectedIds, copyLayers, generatedId);
      return { copyLayers: copyLayers, groupId: generatedId };
    }
    return { copyLayers: copyLayers, groupId: null };
  }

  return { copyLayers: layers, groupId: null };
};

export const createPermanentGroup = (layers, shapeRef) => {
  let layerIndex = layers.findIndex(l => l.id === shapeRef.current.attrs.id);
  let layer = { ...layers[layerIndex] };

  if (layer) {
    layer.groupState = GROUP_STATE.PERMANENT;
    layer.childElements = layer.childElements.map(l => {
      let copy = { ...l };
      copy.oldPosition = null;
      copy.listening = true;
      return copy;
    });
    let copyLayers = [...layers];
    copyLayers[layerIndex] = layer;
    return copyLayers;
  }

  return layers;
}

const disableBackground = (layer) => {
  let childElements = [...layer.childElements];
  let backgroundElementIndex = childElements.findIndex(child => child.id === `BACKGROUND_${layer.id}`);
  let backgroundElement = { ...childElements[backgroundElementIndex] };
  backgroundElement.listening = false;
  childElements[backgroundElementIndex] = backgroundElement;
  layer.childElements = childElements;
}

export const deletePermanentGroup = (layers, groupId, stageRef) => {
  if (!(stageRef && stageRef.current)) return;

  let shapeRefCurrent = stageRef.current.findOne((node) => node.getId() === groupId);

  if (!shapeRefCurrent) return;

  let copyLayers = [...layers];
  let layerIndex = layers.findIndex(l => l.id === shapeRefCurrent.attrs.id);
  let layer = { ...layers[layerIndex] };

  if (layer) {
    layer.groupState = GROUP_STATE.TEMPORARY;
    disableBackground(layer);
    copyLayers[layerIndex] = layer;
  }

  return copyLayers;
}

export const findOneRef = () => {

}

export function decompose(mat, shapeRefCurrent) {
  var a = mat[0];
  var b = mat[1];
  var c = mat[2];
  var d = mat[3];
  var e = mat[4];
  var f = mat[5];

  // var delta = a * d - b * c;

  let result = {
    x: calculatePositionFromShape(e, shapeRefCurrent),
    y: calculatePositionFromShape(f, shapeRefCurrent),
    rotation: 0,
  };

  // Apply the QR-like decomposition.
  if (a !== 0 || b !== 0) {
    var r = Math.sqrt(a * a + b * b);
    result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
    //result.scaleX = r;
    //result.scaleY = delta / r;
  } else if (c !== 0 || d !== 0) {
    var s = Math.sqrt(c * c + d * d);
    result.rotation =
      Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
    //result.scaleX = delta / s
    //result.scaleY = s;
  } else {
    // a = b = c = d = 0
  }

  result.rotation *= 180 / Math.PI;
  return result;
}

export function getAbsoluteRotation(shape) {
  const matrix = shape.getAbsoluteTransform().getMatrix();
  const attrs = decompose(matrix, shape);
  return attrs.rotation
}

// Deprecated.

export const findElement = (layers) => {
  var copyLayers = [...layers];
  let index = -1;
  for (let i = 0; i < copyLayers.length; i++) {
    let l = copyLayers[i];
    if (l.type === 'Group') {
      index = findElement(l.childElements);
      if (index >= 0) {
        return index;
      }
    } else {
      return i;
    }
  }
  return index;
}