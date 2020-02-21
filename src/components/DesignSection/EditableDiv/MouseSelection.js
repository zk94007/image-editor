import { calculatePostionFromStage } from "./EditOptions/EditOptionsUtil";
import Konva from "konva";

let posStart;
let posNow;
let mode;
let shapeList;
let selectionRect;
let stage;
let layer;

function getRectForGroup(node) {
    var rect = node.getClientRect({
        skipTransform: true,
        skipShadow: false,
        skipStroke: false
    });
    var rotation = Konva.getAngle(node.rotation());
    var dx = rect.x * node.scaleX() - node.offsetX() * node.scaleX();
    var dy = rect.y * node.scaleY() - node.offsetY() * node.scaleY();
    return {
        x: node.x() + dx * Math.cos(rotation) + dy * Math.sin(-rotation),
        y: node.y() + dy * Math.cos(rotation) + dx * Math.sin(rotation),
        width: rect.width * node.scaleX(),
        height: rect.height * node.scaleY(),
        rotation: node.rotation()
    };
}
export function setTempRectPosition(shape, layercurrent = layer, stageCurrent = stage, checkForDrawing) {
    if (checkForDrawing && mode === 'drawing') return;

    let tempShape = layercurrent.findOne(s => s.getId() === `temp_${shape.getId()}`);
    tempShape.visible(true);
    let attrs;

    if (checkForDrawing && shape.getType() !== 'Group') {
        let isCircle = shape.attrs.type === 'Circle';
        attrs = {
            x: shape.x(),
            y: shape.y(),
            width: shape.width(),
            height: shape.height(),
            offsetX: isCircle ? shape.width() / 2 : shape.offsetX(),
            offsetY: isCircle ? shape.height() / 2 : shape.offsetY(),
            rotation: shape.rotation()
        }
    } else {
        let clientRect = getRectForGroup(shape);
        attrs = {
            x: clientRect.x,
            y: clientRect.y,
            width: clientRect.width,
            height: clientRect.height,
            rotation: clientRect.rotation
        }
    }
    tempShape.setAttrs(attrs);
}

export function createTempRect(id, layerCurrent = layer, stageCurrent = stage, checkForDrawing) {
    if (checkForDrawing && mode === 'drawing') return;

    id = `temp_${id}`
    let rect = new Konva.Rect({
        type: 'Rect',
        key: id,
        id: id,
        strokeWidth: 1,
        temp: true,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        listening: false,
        stroke: 'lime',
        draggable: false,
    });
    layerCurrent.add(rect);
    stageCurrent.draw();
}

export function removeTempRect(layerCurrent = layer, checkForDrawing) {
    if (checkForDrawing && mode === 'drawing') return;

    let tempShapes = layerCurrent.find(shape => shape.attrs.temp);
    if (tempShapes) {
        tempShapes.forEach(shape => {
            shape.destroy();
        })
    }
}

export function startDrag(posIn) {
    layer = stage.findOne(s => s.getType() === 'Layer');
    if (!layer) return;

    let x = calculatePostionFromStage(posIn.x, stage) - calculatePostionFromStage(stage.x(), stage);
    let y = calculatePostionFromStage(posIn.y, stage) - calculatePostionFromStage(stage.y(), stage);
    posStart = { x: x, y: y };
    posNow = { x: x, y: y };

    selectionRect = stage.findOne((node) => node.getId() === 'selectionRect');
    shapeList = stage.find(node => node.getType() !== 'Layer' && node.getId() !== 'selectionRect' && !node.attrs.isChildren);
    shapeList.forEach(shape => {
        if (shape.getType() === 'Group') {
            createTempRect(shape.getId())
        }
    });
    selectionRect.moveToTop();
    stage.draw();
}

export function updateDrag(posIn, containerOffset) {
    if (!selectionRect) return;

    // update rubber rect position
    posNow = {
        x: calculatePostionFromStage(posIn.x, stage) - calculatePostionFromStage(stage.x(), stage),
        y: calculatePostionFromStage(posIn.y, stage) - calculatePostionFromStage(stage.y(), stage)
    };

    var posRect = reverse(posStart, posNow);

    selectionRect.x(posRect.x1);
    selectionRect.y(posRect.y1);
    selectionRect.width(posRect.x2 - posRect.x1);
    selectionRect.height(posRect.y2 - posRect.y1);
    selectionRect.visible(true);

    // run the collision check loop
    for (let i = 0; i < shapeList.length; i = i + 1) {
        let shape = shapeList[i];
        if (hitCheck(shape, selectionRect, containerOffset)) {
            if (shape.getType() !== 'Group') {
                shape.stroke('lime'); // if we get a hit draw a lime stroke
                shape.strokeEnabled(true);
            } else {
                setTempRectPosition(shape);
            }
            shape.attrs.selected = true;
        } else {
            if (shape.getType() !== 'Group') {
                shape.strokeEnabled(false);
            } else {
                let tempShape = layer.findOne(s => s.getId() === `temp_${shape.getId()}`);
                tempShape.visible(false);
            }
            shape.attrs.selected = false;
        }
    }

    stage.draw(); // redraw any changes.

}

export const onMouseDown = (e, stageRef) => {
    if (!(stageRef && stageRef.current)) return;
    stage = stageRef.current;
    mode = 'drawing';
    startDrag({ x: e.evt.layerX, y: e.evt.layerY });
    document.addEventListener('mouseup', onMouseUp)
}

export const onMouseMove = (e, containerOffset) => {
    // update the rubber rect on mouse move - note use of 'mode' var to avoid drawing after mouse released.
    if (!stage) return;

    if (mode === 'drawing') {
        updateDrag({ x: e.evt.layerX, y: e.evt.layerY }, containerOffset);
    }
}

export const onMouseUp = (e) => {
    if (!stage && mode !== 'drawing') return [];

    mode = '';
    selectionRect.visible(false);
    selectionRect.moveToBottom();
    removeTempRect();
    stage.draw();
    document.removeEventListener('mouseup', onMouseUp);
    let selectedNodes = shapeList.filter(s => s.attrs.selected).map(s => {
        s.attrs.selected = false;
        return s.getId();
    });
    return selectedNodes || [];
}


function hitCheck(shape1, shape2, containerOffset) {

    var s1 = shape1.getClientRect(); // use this to get bounding rect for shapes other than rectangles.
    var s2 = shape2.getClientRect();

    // corners of shape 1
    var X = s1.x;
    var Y = s1.y
    var A = s1.x + s1.width;
    var B = s1.y + s1.height;

    // corners of shape 2
    var X1 = s2.x;
    var A1 = s2.x + s2.width;
    var Y1 = s2.y
    var B1 = s2.y + s2.height;

    // corners of drawing layer
    var X2 = (containerOffset.width - containerOffset.rectWidth * stage.scaleX()) / 2;
    X2 = Math.max(containerOffset.minHorizontalPadding, X2);

    var Y2 = (containerOffset.height - containerOffset.rectHeight * stage.scaleY()) / 2;;
    Y2 = Math.max(containerOffset.minVerticalPadding, Y2);

    var A2 = X2 + containerOffset.rectWidth * stage.scaleX();
    var B2 = Y2 + containerOffset.rectHeight * stage.scaleY();

    X = Math.max(X, X2);
    Y = Math.max(Y, Y2);
    A = Math.min(A, A2);
    B = Math.min(B, B2);

    // Simple overlapping rect collision test
    if (A < X1 || A1 < X || B < Y1 || B1 < Y) {
        return false
    } else {
        return true;
    }
}

function reverse(r1, r2) {
    var r1x = r1.x, r1y = r1.y, r2x = r2.x, r2y = r2.y, d;
    if (r1x > r2x) {
        d = Math.abs(r1x - r2x);
        r1x = r2x; r2x = r1x + d;
    }
    if (r1y > r2y) {
        d = Math.abs(r1y - r2y);
        r1y = r2y; r2y = r1y + d;
    }
    return ({ x1: r1x, y1: r1y, x2: r2x, y2: r2y }); // return the corrected rect.     
}