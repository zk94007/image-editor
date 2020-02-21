export const nullOrUndefind = (value) => {
    return value === undefined || value === null;
}

export const HOST =  'https://dev.roman3.io/';
const MIN_VERTICAL_PADDING = 25;
const MIN_HORIZONTAL_PADDING = 25;
export const VIDEO_EDITOR_URI = `https://dev-video.roman3.io/`;
export const DASHBOARD_URI = `${HOST}dashboard`;

let INNER_RECT_WIDTH;
let INNER_RECT_HEIGHT;
let k = 0;
export const getOffsetWidthAndHeight = (querySelector , stageWidth, stageHeight) => {
    INNER_RECT_WIDTH = stageWidth;
    INNER_RECT_HEIGHT = stageHeight;
    let divElement = document.querySelector(querySelector);
    let offsetHeight = divElement.offsetHeight;
    let clientWidth = (k < 3) ? divElement.clientWidth - 270 : divElement.clientWidth - 20;
    let verticalPadding = (offsetHeight - INNER_RECT_HEIGHT) / 2;
    let horizontalPadding = (clientWidth - INNER_RECT_WIDTH) / 2;

    k++;
    verticalPadding = Math.max(MIN_VERTICAL_PADDING, verticalPadding);
    horizontalPadding = Math.max(MIN_HORIZONTAL_PADDING, horizontalPadding);

    return {
        width: clientWidth,
        height: offsetHeight,
        verticalPadding,
        horizontalPadding,
        rectWidth: INNER_RECT_WIDTH,
        rectHeight: INNER_RECT_HEIGHT,
        minVerticalPadding: MIN_VERTICAL_PADDING,
        minHorizontalPadding: MIN_HORIZONTAL_PADDING
    };
}

/* export const getOffsetWidthAndHeight = (querySelector) => {
    //let divElement = document.querySelector(querySelector);
    //let { offsetHeight, clientWidth } = divElement;
    let height = 800, width = 1000;

    let verticalPadding = (height - 400) / 2;
    let horizontalPadding = (width - 250) / 2;

    return { width: width, height: height, verticalPadding, horizontalPadding };
} */