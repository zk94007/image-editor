import Konva from "konva";
import { calculatePostionFromStage } from "../components/DesignSection/EditableDiv/EditOptions/EditOptionsUtil";

const getOriginalRectWithoutZoom = (rect, stage) => {
    return {
        ...rect,
        x: rect.x ? calculatePostionFromStage(rect.x, stage) - calculatePostionFromStage(stage.x(), stage) : rect.x,
        y: rect.y ? calculatePostionFromStage(rect.y, stage) - calculatePostionFromStage(stage.y(), stage) : rect.y,
        width: rect.width ? calculatePostionFromStage(rect.width, stage) : rect.width,
        height: rect.height ? calculatePostionFromStage(rect.height, stage) : rect.height
    }
}

// were can we snap our objects?
function getLineGuideStops(skipShape, stage, containerOffset) {
    // we can snap to stage borders and the center of the stage
    let { rectWidth, rectHeight, horizontalPadding, verticalPadding } = containerOffset;

    var vertical = [horizontalPadding, horizontalPadding + rectWidth / 2, horizontalPadding + rectWidth];
    var horizontal = [verticalPadding, verticalPadding + rectHeight / 2, verticalPadding + rectHeight];

    // and we snap over edges and center of each object on the canvas
    stage.find('.object').forEach(guideItem => {
        if (guideItem === skipShape || guideItem.attrs.isChildren) {
            return;
        }
        var box = getOriginalRectWithoutZoom(guideItem.getClientRect(), stage);
        // and we can snap to all edges of shapes
        vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
        horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);
    });
    return {
        vertical: vertical.flat(),
        horizontal: horizontal.flat()
    };
}

// what points of the object will trigger to snapping?
// it can be just center of the object
// but we will enable all edges and center
function getObjectSnappingEdges(node, stage) {
    var box = getOriginalRectWithoutZoom(node.getClientRect(), stage);
    return {
        vertical: [
            {
                guide: box.x,
                offset: node.x() - box.x,
                snap: 'start'
            },
            {
                guide: box.x + box.width / 2,
                offset: node.x() - box.x - box.width / 2,
                snap: 'center'
            },
            {
                guide: box.x + box.width,
                offset: node.x() - box.x - box.width,
                snap: 'end'
            }
        ],
        horizontal: [
            {
                guide: box.y,
                offset: node.y() - box.y,
                snap: 'start'
            },
            {
                guide: box.y + box.height / 2,
                offset: node.y() - box.y - box.height / 2,
                snap: 'center'
            },
            {
                guide: box.y + box.height,
                offset: node.y() - box.y - box.height,
                snap: 'end'
            }
        ]
    };
}

// find all snapping possibilities
function getGuides(lineGuideStops, itemBounds, scaleLayer, target, zoomLevel) {
    var resultV = [];
    var resultH = [];

    let GUIDELINE_OFFSET = 7;
    if (scaleLayer) {
        GUIDELINE_OFFSET = target.attrs.snapping ? 7 : 1;
    }

    lineGuideStops.vertical.forEach(lineGuide => {
        itemBounds.vertical.forEach(itemBound => {
            var diff = Math.abs((lineGuide - itemBound.guide) * zoomLevel);
            // if the distance between guild line and object snap point is close we can consider this for snapping
            if (diff < GUIDELINE_OFFSET) {
                resultV.push({
                    lineGuide: lineGuide,
                    diff: diff,
                    snap: itemBound.snap,
                    offset: itemBound.offset
                });
            }
        });
    });

    lineGuideStops.horizontal.forEach(lineGuide => {
        itemBounds.horizontal.forEach(itemBound => {
            var diff = Math.abs((lineGuide - itemBound.guide) * zoomLevel);
            if (diff < GUIDELINE_OFFSET) {
                resultH.push({
                    lineGuide: lineGuide,
                    diff: diff,
                    snap: itemBound.snap,
                    offset: itemBound.offset
                });
            }
        });
    });

    var guides = [];

    // find closest snap
    var minV = resultV.sort((a, b) => a.diff - b.diff)[0];
    var minH = resultH.sort((a, b) => a.diff - b.diff)[0];
    if (minV) {
        guides.push({
            lineGuide: minV.lineGuide,
            offset: minV.offset,
            orientation: 'V',
            snap: minV.snap
        });
    }
    if (minH) {
        guides.push({
            lineGuide: minH.lineGuide,
            offset: minH.offset,
            orientation: 'H',
            snap: minH.snap
        });
    }
    return guides;
}

function drawGuides(guides, layer, zoomLevel) {
    guides.forEach(lg => {
        if (lg.orientation === 'H') {
            let line = new Konva.Line({
                points: [-6000, lg.lineGuide, 6000, lg.lineGuide],
                stroke: 'rgb(255, 0, 255)',
                strokeWidth: 1 / zoomLevel,
                name: 'guid-line',
                // dash: [4, 6]
            });
            layer.add(line);
            layer.batchDraw();
        } else if (lg.orientation === 'V') {
            let line = new Konva.Line({
                points: [lg.lineGuide, -6000, lg.lineGuide, 6000],
                stroke: 'rgb(255, 0, 255)',
                strokeWidth: 1 / zoomLevel,
                name: 'guid-line',
                // dash: [4, 6]
            });
            layer.add(line);
            layer.batchDraw();
        }
    });
}

export const onObjectSnappingEnd = (layer, shape) => {
    if (!layer) return;

    if (shape) {
        shape.setAttr('snapping', null);
    }
    layer.find('.guid-line').destroy();
    layer.batchDraw();
}

export const onObjectSnapping = (target, layer, scaleLayer, resizer, containerOffset = {}, zoomLevel) => {
    if (!layer || !target) return;
    // clear all previous lines on the screen
    layer.find('.guid-line').destroy();

    let stage = layer.getStage();

    // find possible snapping lines
    var lineGuideStops = getLineGuideStops(target, stage, containerOffset);

    // find snapping points of current object
    var itemBounds = getObjectSnappingEdges(target, stage);

    // now find where can we snap current object
    var guides = getGuides(lineGuideStops, itemBounds, scaleLayer, target, zoomLevel);

    // do nothing of no snapping
    target.setAttr('snapping', null);
    // now force object position
    //if (scaleLayer) return;
    layer.batchDraw();

    if (!guides.length) {
        return;
    }

    drawGuides(guides, layer, zoomLevel);
    
    guides.forEach(lg => {
        switch (lg.snap) {
            case 'start': {
                switch (lg.orientation) {
                    case 'V': {
                        !scaleLayer && target.x(lg.lineGuide + lg.offset);
                        if (scaleLayer && (resizer === 'top-left'
                            || resizer === 'middle-left'
                            || resizer === 'bottom-left')) {
                            target.setAttr('snapping', { type: 'V', diff: target.x() - (lg.lineGuide + lg.offset) });
                            setSnapping(target, lg, layer);
                        }
                        break;
                    }
                    case 'H': {
                        !scaleLayer && target.y(lg.lineGuide + lg.offset);
                        if (scaleLayer && (resizer === 'top-left'
                            || resizer === 'bottom-left'
                            || resizer === 'top-center')) {
                            setSnapping(target, lg, layer)
                        }
                        break;
                    }
                    default: { }
                }
                break;
            }
            case 'center': {
                if (scaleLayer) return;
                switch (lg.orientation) {
                    case 'V': {
                        target.x(lg.lineGuide + lg.offset);
                        break;
                    }
                    case 'H': {
                        target.y(lg.lineGuide + lg.offset);
                        break;
                    }
                    default: { }
                }
                break;
            }
            case 'end': {
                switch (lg.orientation) {
                    case 'V': {
                        !scaleLayer && target.x(lg.lineGuide + lg.offset);
                        if (scaleLayer && (resizer === 'top-right'
                            || resizer === 'middle-right'
                            || resizer === 'bottom-right')) {
                            setSnapping(target, lg, layer)
                        }
                        break;
                    }
                    case 'H': {
                        !scaleLayer && target.y(lg.lineGuide + lg.offset);
                        if (scaleLayer && (resizer === 'top-right'
                            || resizer === 'bottom-right'
                            || resizer === 'bottom-center')) {
                            setSnapping(target, lg, layer)
                        }
                        break;
                    }
                    default: { }
                }
                break;
            }
            default: {

            }
        }
    });
    layer.batchDraw();

}

function setSnapping(target, lg, layer) {
    let snapping = { ...lg };
    target.setAttr('snapping', snapping);
}