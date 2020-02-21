import { GROUP_STATE } from "../EditableDiv";
import { LAYER_POSTION } from "./Position/Position";

export function handleFontStyle(style, props) {
  var layer = [...props.layer];
  var index = layer.findIndex(obj => obj.id === props.shapeRef.current.attrs.id);
  if (layer[index].fontStyle) {
    var stylesArr = layer[index].fontStyle.split(" ");
    var styleIndex = stylesArr.indexOf(style)
    if (styleIndex !== -1) {
      stylesArr.splice(styleIndex, 1);
    } else {
      stylesArr.push(" " + style);
    }
    layer[index].fontStyle = stylesArr.join(" ");
  } else {
    layer[index].fontStyle = style;
  }
  props.onChange(layer);
}

export function handleTextDecoration(decoration, props) {
  var layer = [...props.layer];
  var index = layer.findIndex(obj => obj.id === props.shapeRef.current.attrs.id);
  if (layer[index].textDecoration) {
    layer[index].textDecoration = "";
  } else {
    layer[index].textDecoration = decoration;
  }
  props.onChange(layer);
}

export const setLayerPosition = (position, layer, shapeCurrent, parentHeight, parentWidth, scale, groupX = 0, groupY = 0, containerOffset = null, zoomLevel) => {
  let copyLayer = { ...layer };
  let { verticalPadding, horizontalPadding, rectWidth, rectHeight } = containerOffset;

  let width = 0;
  let height = 0;
  if (copyLayer.subType === 'IMAGE' || copyLayer.subType === 'RECT') {
    width = copyLayer.width / 2;
    height = copyLayer.height / 2;
  } else if (copyLayer.subType === 'CIRCLE') {
    width = copyLayer.radius;
    height = copyLayer.radius;
  } else if (copyLayer.subType === 'CHART') {
    rectWidth -= copyLayer.width;
    rectHeight -= copyLayer.height;
  }
  if (position === LAYER_POSTION.TOP) {
    copyLayer.y = verticalPadding + height;
  } else if (position === LAYER_POSTION.MIDDLE) {
    copyLayer.y = verticalPadding + rectHeight / 2;
  } else if (position === LAYER_POSTION.BOTTOM) {
    copyLayer.y = verticalPadding + rectHeight - height;
  } else if (position === LAYER_POSTION.LEFT) {
    copyLayer.x = horizontalPadding + width;
  } else if (position === LAYER_POSTION.CENTRE) {
    copyLayer.x = horizontalPadding + rectWidth / 2;
  } else if (position === LAYER_POSTION.RIGHT) {
    copyLayer.x = horizontalPadding + rectWidth - width;
  }
  return copyLayer;
}

export function handlePostionChange(position, layerList, shapeRef, stageRef, onChange, containerOffset, zoomLevel) {
  if (shapeRef && shapeRef.current && stageRef && stageRef.current) {
    let scale = stageRef.current.scaleX();
    let copyLayerList = [...layerList];
    let shapeCurrent = shapeRef.current;
    let id = shapeCurrent.attrs.parentId || shapeCurrent.attrs.id;
    let layerIndex = copyLayerList.findIndex(l => l.id === id);

    if (shapeCurrent.attrs.type === 'Group' && shapeCurrent.attrs.groupState === GROUP_STATE.TEMPORARY) {
      if (layerIndex > -1) {
        let groupLayer = { ...copyLayerList[layerIndex] };
        let children = [...groupLayer.childElements];
        let groupClientRect = shapeRef.current.getClientRect();

        let transperantRect = shapeCurrent.findOne(el => el.attrs.transperantRect);
        if (transperantRect) {
          transperantRect.destroy();
          stageRef.current.draw();
        }

        children = children.filter(ch => !ch.transperantRect).map((child, i) => {
          return setLayerPosition(position, child, shapeCurrent.children[i], groupClientRect.height, groupClientRect.width, scale, groupClientRect.x, groupClientRect.y);
        });

        groupLayer.childElements = children;
        copyLayerList[layerIndex] = groupLayer;
        onChange(copyLayerList);
      }
    } else {
      if (layerIndex > -1) {
        let stageAtts = stageRef.current.attrs;
        let shape = stageRef.current.findOne(el => el.getId() === id);
        let layer = setLayerPosition(position, copyLayerList[layerIndex], shape, stageAtts.height, stageAtts.width, scale, 0, 0, containerOffset, zoomLevel);
        copyLayerList[layerIndex] = layer;
        onChange(copyLayerList);
      }
    }
  }
}

export const getZoomLevelFromStageRef = (stageRef) => {
  if (stageRef && stageRef.current) {
    return stageRef.current.scaleX();
  }

  return 1;
}

export const getZoomLevelFromShapeRef = (shapeRefCurrent) => {
  if (shapeRefCurrent) {
    let stage = shapeRefCurrent.getStage();
    if (stage) {
      return stage.scaleX();
    }
  }
  
  return 1;
}

export const calculatePositionFromShape = (val, shapeRefCurrent) => {
  let zoomLevel = 1 / getZoomLevelFromShapeRef(shapeRefCurrent);
  return val * zoomLevel;
}

export const calculatePostionFromStage = (val, stage) => {
  if (!stage) return val;

  let zoomLevel = 1 / stage.scaleX();
  return val * zoomLevel;
}

export const calculatePostionFromStageRef = (val, stageRef) => {
  let zoomLevel = 1 / getZoomLevelFromStageRef(stageRef);
  return val * zoomLevel;
}

export const getStageXAndYCoordinates = (stage) => {
  return {
    x: calculatePostionFromStage(stage.x(), stage),
    y: calculatePostionFromStage(stage.y(), stage)
  };
}

export const getTransfomerCornerPosition = (shapeRef) => {
  let parent = shapeRef.current.getParent();
  let children = parent.children;
  let transformer = children.filter(child => child.attrs.type === 'Transformer')[0];
  var topLeft = transformer.findOne('.top-left').getAbsolutePosition(parent);
  var topRight = transformer.findOne('.top-right').getAbsolutePosition(parent);
  var bottomLeft = transformer.findOne('.bottom-left').getAbsolutePosition(parent);
  var bottomRight = transformer.findOne('.bottom-right').getAbsolutePosition(parent);

  return { topLeft: topLeft, topRight: topRight, bottomLeft: bottomLeft, bottomRight: bottomRight };
}