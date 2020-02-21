const RECT_WIDTH = 100;
const RECT_HEIGHT = 100;
export const STROKE_COLOR = 'lime';

export const shapesConfig = {
    Rect: {
        x: 75 + RECT_WIDTH / 2,
        y: 150 + RECT_HEIGHT / 2,
        width: RECT_WIDTH,
        height: RECT_HEIGHT,
        offsetX: RECT_WIDTH / 2,
        offsetY: RECT_HEIGHT / 2,
        scaleX: 1,
        scaleY: 1,
        fill: "red",
        draggable: true,
        strokeWidth: 2,
        strokeEnabled: false
    },
    Circle: {
        x: 125,
        y: 200,
        radius: 50,
        scaleX: 1,
        scaleY: 1,
        fill: "green",
        draggable: true,
        strokeWidth: 2,
        strokeEnabled: false
    },
    Image: {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        scaleX: 1,
        scaleY: 1,
        draggable: true,
        strokeWidth: 2,
        strokeEnabled: false,
    },
    Text: {
        x: 50,
        y: 185,
        scaleX: 1,
        scaleY: 1,
        text: 'Sample Text',
        fontSize: 30,
        fontFamily: 'Calibri',
        fill: '#000',
        draggable: true
    }
}