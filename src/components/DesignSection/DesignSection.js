import React, { useState, useEffect } from 'react';
import './DesignSection.scss';
import ElementsPicker, { ELEMENT_TRAY_TYPE, ELEMENT_SUB_TYPE } from './ElementsPicker/ElementsPicker';
import EditableDiv from './EditableDiv/EditableDiv';
import useImage from 'use-image';
import { shapesConfig } from './shapesConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import deepFreeze from 'deep-freeze';
import { getOffsetWidthAndHeight } from '../../utilities/Utils';
import { getTextSVG } from './EditableDiv/Element/TextNodeSvg';
import { undoLayer, redoLayer, updateUndoList } from './UndoRedoUtils';
import Menu from './Menu/Menu';
import NavBar from '../Navbar';
import { APILINK, URI, METHOD, HEADERS, HOMEURL, TEMPLATEURL } from '../../config/api';

var key = 0;

const generateKey = (() => {
    return () => key += 1;
})();

function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return width;
}

function DesignSection() {
    const width = useWindowWidth();
    const [stageWidth, setStageWidth] = useState(300);
    const [stageHeight, setStageHeight] = useState(400);
    const [elementsPickerOpen, setElementsPickerState] = useState(false);
    const [selectedElement, setElement] = useState(null);
    const [trayState, setTrayState] = useState(null);
    const [imgUrl, setImage] = useState({ type: undefined, value: undefined });
    const [image] = useImage(imgUrl.value);
    const [backgroundColor, setBackgroundColor] = useState('#d8d8d8');

    const [dropElement, setDropElement] = React.useState(null);
    const [selectedId, selectShape] = React.useState(null);
    const [shapeRef, setShapeRef] = React.useState(null);
    const stageRef = React.createRef();
    const [undoList, setUndoList] = React.useState([]);
    const [redoList, setRedoList] = React.useState([]);
    const [chartData, setChartData] = React.useState(null);
    const [textEditMode, setTextEditMode] = React.useState(null);
    const [containerOffset, setContainerOffset] = React.useState({});

    const [layer, setLayer] = useState([]);

    const [cropIndex, setCropIndex] = useState(null);
    const [groupIndex, setGroupIndex] = useState(null);
    const [isCroped, setIsCroped] = React.useState(false);
    const [onloading, setOnloading] = React.useState(false);
    const [onResize, setOnResize] = React.useState(false);

    deepFreeze(layer);

    function modifyCoordinates(copyLayer, type) {
        let { verticalPadding, horizontalPadding } = containerOffset;
        if (type !== ELEMENT_SUB_TYPE.DRAG_IMAGE) {
            copyLayer.x = horizontalPadding + (copyLayer.originalX || copyLayer.x);
            copyLayer.y = verticalPadding + (copyLayer.originalY || copyLayer.y);
        }
        if (type === ELEMENT_SUB_TYPE.RECT || type === ELEMENT_SUB_TYPE.CIRCLE) {
            copyLayer.x = horizontalPadding + stageWidth / 2;
            copyLayer.y = verticalPadding + stageHeight / 2;
        }
    }

    const onImageLoaded = (loadedImage = image, loadedImageUrl = imgUrl) => {
        setOnloading(false);
        setLayer(prev => {
            var layerArr = [...prev];
            let copyLayer;
            if (loadedImageUrl.type === ELEMENT_SUB_TYPE.BACKGROUND_IMAGE) {
                if (loadedImage && loadedImage.naturalWidth && loadedImage.naturalHeight) {
                    copyLayer = { ...layerArr[0] };
                    copyLayer.image = loadedImage;
                    copyLayer.width = 0;
                    copyLayer.x = -((loadedImage.naturalWidth - stageWidth) / 2);
                    copyLayer.height = 0;
                    copyLayer.y = -((loadedImage.naturalHeight - stageHeight) / 2);
                    layerArr[0] = copyLayer;
                }
            }
            else if (loadedImageUrl.type === ELEMENT_SUB_TYPE.BACKGROUND_COLOR) {
                if (loadedImage && loadedImage.naturalWidth && loadedImage.naturalHeight) {
                    copyLayer = { ...layerArr[0] };
                    copyLayer.image = loadedImage;
                    copyLayer.width = 0;
                    copyLayer.x = -((loadedImage.naturalWidth - stageWidth) / 2);
                    copyLayer.height = 0;
                    copyLayer.y = -((loadedImage.naturalHeight - stageHeight) / 2);
                    layerArr[0] = copyLayer;
                }
            }
            else if (loadedImageUrl.type === ELEMENT_SUB_TYPE.IMAGE
                || loadedImageUrl.type === ELEMENT_SUB_TYPE.CHART
                || loadedImageUrl.type === ELEMENT_SUB_TYPE.DRAG_IMAGE) {
                copyLayer = { ...layerArr[layerArr.length - 1] };
                copyLayer.image = loadedImage;
                if (loadedImage && loadedImage.naturalWidth && loadedImage.naturalHeight) {
                    if (stageHeight / stageWidth < loadedImage.naturalHeight / loadedImage.naturalWidth) {
                        copyLayer.height = stageHeight * 0.8;
                        copyLayer.y = copyLayer.y || stageHeight * 0.1;
                        copyLayer.width = stageHeight * 0.8 / loadedImage.naturalHeight * loadedImage.naturalWidth;
                        copyLayer.x = loadedImageUrl.type === ELEMENT_SUB_TYPE.DRAG_IMAGE ? copyLayer.x
                            : (stageWidth - copyLayer.width) / 2;
                    } else {
                        copyLayer.width = stageWidth * 0.8;
                        copyLayer.x = copyLayer.x || stageWidth * 0.1;
                        copyLayer.height = stageWidth * 0.8 / loadedImage.naturalWidth * loadedImage.naturalHeight;
                        copyLayer.y = loadedImageUrl.type === ELEMENT_SUB_TYPE.DRAG_IMAGE ? copyLayer.y
                            : (stageHeight - copyLayer.height) / 2;
                    }
                    if (!copyLayer.chartType) {
                        copyLayer.offsetX = copyLayer.width / 2;
                        copyLayer.offsetY = copyLayer.height / 2;
                        copyLayer.x += copyLayer.offsetX;
                        copyLayer.y += copyLayer.offsetY;
                        copyLayer.droppable = true;
                    }
                }

                copyLayer = {
                    ...copyLayer,
                    crop: {
                        x: 0,
                        y: 0,
                        width: loadedImage.naturalWidth,
                        height: loadedImage.naturalHeight,
                    },
                    cropper: {
                        cx: copyLayer.x,
                        cy: copyLayer.y,
                        cw: copyLayer.width,
                        ch: copyLayer.height,
                        left: copyLayer.x - copyLayer.width / 2,
                        top: copyLayer.y - copyLayer.height / 2,
                        width: copyLayer.width,
                        height: copyLayer.height,
                        rotateAngle: copyLayer.rotation ? copyLayer.rotation : 0,
                    }
                }

                layerArr[layerArr.length - 1] = copyLayer;

            } else if (loadedImageUrl.type === ELEMENT_SUB_TYPE.TEXT) {
                copyLayer = { ...layerArr[layerArr.length - 1] };
                copyLayer.image = loadedImage;
                if (loadedImage && loadedImage.naturalWidth && loadedImage.naturalHeight) {
                    if (loadedImage.naturalWidth <= loadedImage.naturalHeight) {
                        copyLayer.x = 50;
                        copyLayer.y = (stageHeight - copyLayer.height) / 2;
                    } else {
                        copyLayer.y = (stageHeight - 100) / 2;
                        copyLayer.x = (stageWidth - copyLayer.width) / 2;
                    }
                }
                layerArr[layerArr.length - 1] = copyLayer;
            } else {
                copyLayer = { ...layerArr[layerArr.length - 1] };
            }

            copyLayer.originalX = copyLayer.originalX || copyLayer.x;
            copyLayer.originalY = copyLayer.originalY || copyLayer.y;
            modifyCoordinates(copyLayer, loadedImageUrl.type);
            if (copyLayer.subType === ELEMENT_SUB_TYPE.CHART) {
                selectShape(copyLayer.id);
                setChartDataOnSelect(copyLayer);
            }
            return layerArr;
        });
    }

    const setChartDataOnSelect = (layer) => {
        if (layer && layer.chartType && layer.data) {
            setChartData({ ...layer.data });
        }
    }

    const handleLoadCanvas = (json, details) => {
        const left = details.horizontalPadding;
        const top = details.verticalPadding;
        let imageCount = 0;
        let onloadCount = 0;
        for (let i = 0; i < json.layer.length; i++) {
            if (json.layer[i].childElements) {
                for (let j = 0; j < json.layer[i].childElements.length; j++) {
                    if (json.layer[i].childElements[j].image) {
                        if (json.layer[i].childElements[j].subType === 'IMAGE') {
                            imageCount++;
                            let image = new window.Image();
                            image.src = json.layer[i].childElements[j].image;
                            image.onload = () => {
                                onloadCount++;
                                if (imageCount === onloadCount) {
                                    setOnloading(false);
                                }
                            }
                            json.layer[i].childElements[j].image = image;
                        }
                        if (json.layer[i].childElements[j].subType === 'TEXT') {
                            let text = json.layer[i].childElements[j];
                            let image = new window.Image();
                            image.src = getTextSVG(text.data, text.width, text.height);
                            text.image = image;
                        }
                    }
                }
            }
            json.layer[i] = {
                ...json.layer[i],
                x: json.layer[i].x + left,
                y: json.layer[i].y + top,
            }
            if (json.layer[i].image) {
                if (json.layer[i].subType === 'IMAGE') {
                    imageCount++;
                    let image = new window.Image();
                    image.src = json.layer[i].image;
                    image.onload = () => {
                        onloadCount++;
                        if (imageCount === onloadCount) {
                            setOnloading(false);
                        }
                    }
                    json.layer[i].image = image;
                }
                if (json.layer[i].subType === 'TEXT') {
                    let text = json.layer[i];
                    let image = new window.Image();
                    image.src = getTextSVG(text.data, text.width, text.height);
                    text.image = image;
                }
            }
        }

        setLayer(json.layer);
    }

    const handleSaveCanvas = (copyLayer, details) => {
        const left = details.horizontalPadding;
        const top = details.verticalPadding;
        if (copyLayer.length > 0) {
            for (let i = 0; i < copyLayer.length; i++) {
                if (copyLayer[i] && copyLayer[i].childElements) {
                    let copyGroupLayer = [...copyLayer[i].childElements];
                    for (let j = 0; j < copyGroupLayer.length; j++) {
                        if (copyGroupLayer[j] && copyGroupLayer[j].image) {
                            copyGroupLayer[j] = {
                                ...copyGroupLayer[j],
                                image: copyGroupLayer[j].image.src,
                            };
                        }
                    }
                    copyLayer[i] = {
                        ...copyLayer[i],
                        childElements: copyGroupLayer,
                    }
                }
                copyLayer[i] = {
                    ...copyLayer[i],
                    x: copyLayer[i].x - left,
                    y: copyLayer[i].y - top,
                }
                if (copyLayer[i] && copyLayer[i].image) {
                    copyLayer[i] = {
                        ...copyLayer[i],
                        image: copyLayer[i].image.src,
                    }
                }
            }
        }

        return copyLayer;
    }

    const convertJSON = (json) => {
        let newJson = {
            title: "Sample Title",
            description: "Sample Description",
            type: "image",
            project_json: {
                stageSize: {
                    stageWidth: 300,
                    stageHeight: 400
                },
                elementsPickerOpen: true,
                selectedElement: ELEMENT_TRAY_TYPE.TEMPLATE,
                backgroundColor: "#d8d8d8",
                onResize: false,
                key: json.children ? json.children.length : 0,
                layer: [
                    {
                        x: 0,
                        y: 0,
                        id: "selectionRect",
                        key: "selectionRect",
                        fill: "#d8d8d8",
                        type: "Rect",
                        width: 0,
                        height: 0,
                        stroke: "green",
                        opacity: 0.2,
                        draggable: false,
                        listening: false,
                        strokeWidth: 2
                    }
                ]
            },
            width: 150,
            height: 150
        }

        newJson.project_json.stageSize = {
            stageWidth: json.width / 4,
            stageHeight: json.height / 4,
        }

        var layerKey = 1;
        if (!json.children) return;
        for (let i = json.children.length - 1; i > -1; i--) {
            if (json.children[i].subType === 'IMAGE') {
                let layer = {
                    x: json.children[i].x / 4,
                    y: json.children[i].y / 4,
                    id: layerKey,
                    key: layerKey++,
                    crop: {
                        x: 0,
                        y: 0,
                        width: json.children[i].width,
                        height: json.children[i].height
                    },
                    name: json.children[i].name,
                    type: json.children[i].type,
                    image: TEMPLATEURL + window.location.pathname + json.children[i].exportedAsset,
                    width: json.children[i].width / 4,
                    height: json.children[i].height / 4,
                    scaleX: 1,
                    scaleY: 1,
                    offsetX: json.children[i].width / 8,
                    offsetY: json.children[i].height / 8,
                    subType: 'IMAGE',
                    opacity: json.children[i].opacity,
                    draggable: true,
                    droppable: true,
                    originalX: json.children[i].x / 4,
                    originalY: json.children[i].y / 4,
                    strokeWidth: 2,
                    strokeEnabled: false
                }

                newJson.project_json.layer.push(layer);
            }
            if (json.children[i].subType === 'TEXT') {
                let layer = {
                    x: json.children[i].x / 4,
                    y: json.children[i].y / 4,
                    id: layerKey,
                    key: layerKey++,
                    data: `<div id="container" xmlns="http://www.w3.org/1999/xhtml" style="
                                font-size: ${json.children[i].fontSize / 4}px; 
                                display: inline-block; 
                                overflow-wrap: break-word; 
                                font-family: ${json.children[i].fontFamily}; 
                                width: ${json.children[i].width / 4}px;" 
                                class="ql-container ql-bubble"
                            >
                                <div class="ql-editor" data-gramm="false" contenteditable="true" style="
                                    padding: 0px; 
                                    line-height: 1.4; 
                                    font-size: ${json.children[i].fontSize / 4}px;"
                                >
                                    <p class="ql-align-center" style="
                                        font-size: ${json.children[i].fontSize / 4}px;
                                        color: ${json.children[i].color}; 
                                        letter-spacing: 0.02em; 
                                        line-height: 1.4em;"
                                    >
                                        <span style="color: ${json.children[i].color};">${json.children[i].text}</span>
                                    </p>
                                </div>
                                <div class="ql-clipboard" contenteditable="true" tabindex="-1"></div>
                            </div>`,
                    name: json.children[i].name,
                    type: json.children[i].type,
                    image: "blob",
                    width: json.children[i].width / 4,
                    height: json.children[i].height / 4,
                    scaleX: 1,
                    scaleY: 1,
                    subType: 'TEXT',
                    rotation: 0,
                    opacity: json.children[i].opacity,
                    draggable: true,
                    originalX: json.children[i].x / 4,
                    originalY: json.children[i].y / 4,
                    elementType: "TEXT",
                    strokeWidth: 2,
                    quillContents: {
                        ops: [
                            {
                                insert: json.children[i].text,
                                attributes: {
                                    color: json.children[i].color
                                }
                            },
                            {
                                insert: "\n",
                                attributes: {
                                    size: json.children[i].fontSize / 4 + 'px',
                                    align: "center",
                                    listcolor: json.children[i].color,
                                    lineHeight: 1.4 + 'em',
                                    letterspacing: 0
                                }
                            }
                        ]
                    },
                    strokeEnabled: false
                }
                newJson.project_json.layer.push(layer);
            }
        }
        console.log(JSON.stringify(newJson));
    }

    let photoshopJson = {
        "width": 1080,
        "height": 1080,
        "dpi": 96,
        "children": [
            {
                "key": 0,
                "name": "QUARKWOOD TRAVELS",
                "type": "Image",
                "subType": "TEXT",
                "opacity": 1,
                "fill": 1,
                "blendMode": "NORMAL",
                "visible": true,
                "x": 392,
                "y": 88,
                "width": 298,
                "height": 21,
                "font": "OpenSans",
                "text": "QUARKWOOD TRAVELS",
                "kind": "POINTTEXT",
                "fontSize": 20.4369149208069,
                "fontError": "404 FONT not found >OpenSans<",
                "fontFamily": "404 cant get the font FAMILY since font not found",
                "textAlign": "CENTER",
                "direction": "HORIZONTAL",
                "fontStyle": "404 cant get the font style since font not found",
                "color": "#FFFFFF",
                "lineHeight": 120,
                "padding": 100
            },
            {
                "key": 1,
                "name": "EXPLORING ALBERTA",
                "type": "Image",
                "subType": "TEXT",
                "opacity": 1,
                "fill": 1,
                "blendMode": "NORMAL",
                "visible": true,
                "x": 238,
                "y": 198,
                "width": 612,
                "height": 41,
                "font": "MyriadPro-Regular",
                "text": "EXPLORING ALBERTA",
                "kind": "POINTTEXT",
                "fontSize": 67.3605651855469,
                "fontFamily": "Myriad Pro",
                "textAlign": "CENTER",
                "direction": "HORIZONTAL",
                "fauxBold": false,
                "fontStyle": "Regular",
                "color": "#FFFFFF",
                "lineHeight": 102.1845703125,
                "padding": 100
            },
            {
                "key": 2,
                "name": "Escape into the great outdoors! Sept. 18 | Beechtown Park",
                "type": "Image",
                "subType": "TEXT",
                "opacity": 1,
                "fill": 1,
                "blendMode": "NORMAL",
                "visible": true,
                "x": 381,
                "y": 317,
                "width": 322,
                "height": 47,
                "font": "OpenSans",
                "text": "Escape into the great outdoors!\rSept. 18 | Beechtown Park",
                "kind": "POINTTEXT",
                "fontSize": 18.16614818573,
                "fontError": "404 FONT not found >OpenSans<",
                "fontFamily": "404 cant get the font FAMILY since font not found",
                "textAlign": "CENTER",
                "direction": "HORIZONTAL",
                "fontStyle": "404 cant get the font style since font not found",
                "color": "#FFFFFF",
                "padding": 20
            },
            {
                "key": 3,
                "name": "Background copy 2",
                "type": "Image",
                "subType": "IMAGE",
                "opacity": 1,
                "fill": 1,
                "blendMode": "NORMAL",
                "visible": true,
                "x": 0,
                "y": 0,
                "width": 1080,
                "height": 455,
                "exportedAsset": "/exportedAssets/Background_copy_2.png"
            },
            {
                "key": 4,
                "name": "Background copy",
                "type": "Image",
                "subType": "IMAGE",
                "opacity": 1,
                "fill": 1,
                "blendMode": "NORMAL",
                "visible": true,
                "x": 0,
                "y": 0,
                "width": 1080,
                "height": 1080,
                "exportedAsset": "/exportedAssets/Background_copy.png"
            },
            {
                "key": 5,
                "name": "Background",
                "type": "Image",
                "subType": "IMAGE",
                "opacity": 1,
                "fill": 1,
                "blendMode": "NORMAL",
                "visible": true,
                "x": 0,
                "y": 0,
                "width": 1080,
                "height": 1080,
                "exportedAsset": "/exportedAssets/Background.png"
            }
        ]
    };

    useEffect(() => {
        // convertJSON(photoshopJson);
        let projectId = null;
        var pageURL = window.location.href;
        projectId = pageURL.substr(pageURL.lastIndexOf('/') + 1);
        if (projectId) {
            setOnloading(true);
            fetch(APILINK + URI.LOADDESIGN + projectId, {
                method: METHOD.GET,
                headers: {
                    'Content-Type': HEADERS.CONTENTTYPE,
                    'token': HEADERS.TOKEN,
                    'Ocp-Apim-Subscription-Key': HEADERS['Ocp-Apim-Subscription-Key']
                },

            }).then(
                res => res.json()
            ).then(
                (result) => {
                    if (!(result.data && result.data.type === 'image' && result.data.project_json)) {
                        window.location.replace(HOMEURL);
                        return;
                    }

                    const json = result.data.project_json;
                    key = json.key;
                    setBackgroundColor(json.backgroundColor);
                    setOnResize(json.onResize);
                    setElement(json.selectedElement);
                    setStageWidth(json.stageSize.stageWidth);
                    setStageHeight(json.stageSize.stageHeight);

                    const details = getOffsetWidthAndHeight('#editable-div', json.stageSize.stageWidth, json.stageSize.stageHeight);
                    handleLoadCanvas(json, details);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log(error);
                }
            )
        }
    }, []);

    useEffect(() => {
        if (image) {
            onImageLoaded();
            setImage(prev => () => {
                return {
                    ...prev,
                    value: null
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image]);

    const createSelectionRect = () => {
        let selectionRect = {
            type: 'Rect',
            key: "selectionRect",
            id: "selectionRect",
            strokeWidth: 2,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            listening: false,
            stroke: 'green',
            fill: '#d8d8d8',
            opacity: 0.2,
            draggable: false,
        };
        setLayer([selectionRect]);
        // let details = getOffsetWidthAndHeight('#editable-div', stageWidth, stageHeight);
        // setContainerOffset(details);
    }

    useEffect(() => {
        createSelectionRect();
    }, []);


    useEffect(() => {
        if (width > 720) {
            setElementsPickerState(true);
        } else {
            setElementsPickerState(false);
        }
    }, [width]);

    useEffect(() => {
        if (chartData) {
            handleElementClick(ELEMENT_TRAY_TYPE.CHART_TABLE);
        } else {
            handleElementClick(ELEMENT_TRAY_TYPE.PHOTO);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartData]);

    useEffect(() => {
        let details = getOffsetWidthAndHeight('#editable-div', stageWidth, stageHeight);
        setContainerOffset(details);
    }, [stageWidth, stageHeight]);

    useEffect(() => {
        let projectId = null;
        // projectId = window.location.pathname.substr(1);
        if (!projectId) return;

        let copyLayer = [...layer];
        if (!onloading && copyLayer.length) {
            /**
             * Backend PUT API for Saving Data
             * Temporary
             */
            const details = getOffsetWidthAndHeight('#editable-div', stageWidth, stageHeight);
            const jsonData = {
                width: width,
                stageSize: { stageWidth, stageHeight },
                elementsPickerOpen: elementsPickerOpen,
                selectedElement: selectedElement,
                backgroundColor: backgroundColor,
                onResize: onResize,
                key: key,
                layer: handleSaveCanvas(copyLayer, details),
            };
            const bodyData = {
                title: "Sample Title",
                description: "Sample Description",
                type: "image",
                project_json: jsonData,
                width: 150,
                height: 150
            };

            fetch(APILINK + URI.SAVEDESIGN + projectId, {
                method: METHOD.PUT,
                headers: {
                    'Content-Type': HEADERS.CONTENTTYPE,
                    'token': HEADERS.TOKEN
                },
                body: JSON.stringify(bodyData) // body data type must match "Content-Type" header
            }).then(
                res => res.json()
            ).then(
                (result) => {
                    console.log(JSON.stringify(bodyData));
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log(error);
                }
            )
        }
    }, [layer, width, stageWidth, stageHeight, elementsPickerOpen, selectedElement, backgroundColor, onResize]);

    function handleElementClick(element, data) {
        setElement(element);
        setTrayState(data);
        if (width <= 720 && !element) {
            setElementsPickerState(false);
        }
    }

    function handleAddElement(element) {
        if (element.type === 'Image') setOnloading(true);
        setLayer(prev => {
            if (prev) {
                updateUndoList(setUndoList, [...prev], setRedoList, true);
            }
            var layerArr = [...prev];
            var obj = { ...shapesConfig[element.type] };
            obj["type"] = element.type;
            obj["key"] = String(generateKey());
            obj["id"] = obj["key"];
            obj["x"] = element.x || obj["x"];
            obj["y"] = element.y || obj["y"];
            obj["isDraggable"] = element.isDraggable;
            obj["name"] = 'object';
            obj["subType"] = element.subType;

            if (element.type === 'Image') {
                obj["image"] = image;
                if (selectedElement === ELEMENT_TRAY_TYPE.BACKGROUND) {
                    obj["background"] = true;
                    setImage({ type: element.subType, value: element.value });
                    if (layerArr[0] && layerArr[0].background) {
                        layerArr[0] = obj;
                    } else {
                        layerArr.unshift(obj);
                    }
                } else if (selectedElement === ELEMENT_TRAY_TYPE.TEXT) {
                    obj["data"] = element.data;
                    obj["elementType"] = ELEMENT_TRAY_TYPE.TEXT;
                    obj["height"] = element.height;
                    obj["width"] = element.width;
                    setImage({ type: element.subType, value: element.value });
                    layerArr.push(obj);
                } else if (element.subType === ELEMENT_SUB_TYPE.CHART) {
                    obj["data"] = element.data;
                    obj["chartType"] = element.chartType;
                    onImageLoaded(element.value, { type: element.subType });
                    layerArr.push(obj);
                } else {
                    setImage({ type: element.subType, value: `${element.value}` });
                    layerArr.push(obj);
                }
            } else {
                modifyCoordinates(obj, element.subType);
                layerArr.push(obj);
            }
            return layerArr;
        });
        if (width <= 720) {
            setElementsPickerState(false);
        }
    };

    function handlesElementsPickerState() {
        setElementsPickerState(prev => !prev);
    }


    function handleLayerChange(updatedLayer) {
        updateUndoList(setUndoList, [...layer], setRedoList, true);
        setLayer(updatedLayer);
    }

    function handleLayerChangeCallback() {
        updateUndoList(setUndoList, [...layer], setRedoList, true);
        return setLayer;
    }

    function handleUndoLayer() {
        undoLayer(setUndoList, setRedoList, setLayer, setChartData, selectedId, undoList, layer);
    }

    function handleRedoLayer() {
        redoLayer(setUndoList, setRedoList, setLayer, setChartData, selectedId, redoList, layer);
    }

    function handleCropStart(index, groupIndex) {
        setCropIndex(index);
        setGroupIndex(groupIndex);
        setIsCroped(false);
    }

    const handleCropSave = (crop, cropper) => {
        if (!cropIndex) return;
        updateUndoList(setUndoList, [...layer], setRedoList, true);
        setLayer(prev => {
            var layerArr = [...prev];
            if (!(groupIndex > 0)) {
                layerArr[cropIndex] = {
                    ...layerArr[cropIndex],
                    crop: crop,
                    cropper: cropper,
                    x: cropper.cx,
                    y: cropper.cy,
                    width: cropper.cw,
                    height: cropper.ch,
                    offsetX: cropper.cw / 2,
                    offsetY: cropper.ch / 2,
                };
            } else {
                const childElements = [
                    ...layerArr[groupIndex].childElements,
                ];
                childElements[cropIndex] = {
                    ...childElements[cropIndex],
                    crop: crop,
                    cropper: cropper,
                    // x: cropper.cx,
                    // y: cropper.cy,
                    // width: cropper.cw,
                    // height: cropper.ch,
                    // offsetX: cropper.cw / 2,
                    // offsetY: cropper.ch / 2,
                };

                layerArr[groupIndex] = {
                    ...layerArr[groupIndex],
                    childElements: childElements
                }
            }
            return layerArr;
        });
        setCropIndex(null);
        setGroupIndex(null);
    }

    function handleCropCancel() {
        setLayer(prev => {
            var layerArr = [...prev];
            return layerArr;
        });
        setCropIndex(null);
        setGroupIndex(null);
    }

    const mouseDownOnElement = (downEvent) => {
        let target = downEvent.target;

        var dragIcon = document.createElement('img');
        dragIcon.src = target.src;
        dragIcon.width = '100';
        dragIcon.height = '100';
        var div = document.createElement('div');
        div.appendChild(dragIcon);
        div.style.display = 'none';
        div.setAttribute("id", "cloneDiv")
        document.querySelector('body').appendChild(div);

        const moveAt = (moveEvent) => {
            div.style.display = 'block';
            div.style.position = 'absolute';
            div.style.left = moveEvent.pageX + 'px';
            div.style.top = moveEvent.pageY + 'px';
            div.style.pointerEvents = 'none';
        }

        const mouseUp = (e) => {
            div.style.display = 'none';
            document.removeEventListener('mousemove', moveAt);
            document.removeEventListener('mouseup', mouseUp);
            setDropElement({ event: e, src: target.src });
            document.getElementById("cloneDiv").remove();
        }
        document.addEventListener('mousemove', moveAt);
        document.addEventListener('mouseup', mouseUp);
    }

    return (
        <React.Fragment>
            <NavBar />
            <Menu textEditMode={textEditMode}
                undoList={undoList}
                redoList={redoList}
                undoLayer={handleUndoLayer}
                redoLayer={handleRedoLayer}
                onResize={onResize}
                setOnResize={setOnResize}
                cropIndex={cropIndex}></Menu>
            <div style={{ height: '300px', width: '300px' }}>
                <canvas style={{ display: 'none' }} id="chartCanvas" width="600" height="600"></canvas>
            </div>

            <div className="design-section">
                {elementsPickerOpen && <ElementsPicker
                    selectedElement={selectedElement}
                    mouseDownOnElement={mouseDownOnElement}
                    handleElementClick={(i) => handleElementClick(i)}
                    handleAddElement={(element) => handleAddElement(element)}
                    chartData={chartData}
                    selectedId={selectedId}
                    layer={layer}
                    setLayer={handleLayerChange}
                    backgroundColor={backgroundColor}
                    setBackgroundColor={setBackgroundColor}
                    trayState={trayState}
                    shapeRef={shapeRef}
                    stageRef={stageRef}
                />}
                <EditableDiv handleAddElement={(element) => handleAddElement(element)}
                    selectedElement={selectedElement}
                    layer={layer}
                    dropElement={dropElement}
                    setDropElement={setDropElement}
                    className="editable-div"
                    stageWidth={stageWidth}
                    stageHeight={stageHeight}
                    setStageWidth={setStageWidth}
                    setStageHeight={setStageHeight}
                    handleLayerChangeCallback={handleLayerChangeCallback}
                    handleElementClick={handleElementClick}
                    generateKey={generateKey}
                    imgUrl={imgUrl}
                    setChartData={setChartData}
                    selectShape={selectShape}
                    selectedId={selectedId}
                    shapeRef={shapeRef}
                    setShapeRef={setShapeRef}
                    stageRef={stageRef}
                    backgroundColor={backgroundColor}
                    setTextEditMode={setTextEditMode}
                    setContainerOffset={setContainerOffset}
                    containerOffset={containerOffset}
                    onResize={onResize}
                    setOnResize={setOnResize}
                    cropIndex={cropIndex}
                    setCropIndex={setCropIndex}
                    groupIndex={groupIndex}
                    setGroupIndex={setGroupIndex}
                    isCroped={isCroped}
                    setIsCroped={setIsCroped}
                    handleCropStart={(index, groupIndex) => handleCropStart(index, groupIndex)}
                    handleCropSave={handleCropSave}
                    handleCropCancel={() => handleCropCancel()}
                    handleLayerChange={(updatedLayer) => handleLayerChange(updatedLayer)} />
                {!elementsPickerOpen && <button className="open-menu" onClick={() => handlesElementsPickerState()}><FontAwesomeIcon icon={faPlus} size="1x"></FontAwesomeIcon></button>}
            </div>
            <div>
                <svg id="chartSVG" width="960" height="500" style={{ display: 'none' }}></svg>
            </div>
            {onloading && <div className="spinner-container">
                <h2>Please wait loading....</h2>
            </div>}
        </React.Fragment>
    );
}

export default DesignSection;