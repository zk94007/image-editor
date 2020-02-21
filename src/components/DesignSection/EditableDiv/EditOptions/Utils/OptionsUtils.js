import React from 'react';
import Button from '@material-ui/core/Button';
import {
    faLock,
    faUnlockAlt,
} from '@fortawesome/free-solid-svg-icons';
import { EDIT_OPTIONS } from './Options.enum';
import Position from '../Position/Position';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { findIndex, findGroupIndex, findLayer, isLayerLocked } from './CommonUtils';
import Transparency from '../Transparency/Transparency';
import DeleteLayer from '../DeleteLayer/DeleteLayer';
import FontSize from '../FontSize/FontSize';
import { ELEMENT_TRAY_TYPE } from '../../../ElementsPicker/ElementsPicker';

export const OPTION_POSITION = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
}

export const FONT_TYPE = {
    TEXT_FONT: 'TEXT_FONT',
    CHART_FONT: 'CHART_FONT'
}

export const getCopyLayer = (props) => {
    return {
        subType: EDIT_OPTIONS.COPY_LAYER,
        position: OPTION_POSITION.RIGHT,
        hideOnEditMode: true,
        order: 21,
        config: {
            clickHandler: () => { props.copyAndPasteLayer() },
            content: () => {
                return <Button>Copy</Button>
            }
        }
    }
}

export const getPosition = (props) => {
    return {
        subType: EDIT_OPTIONS.POSITION,
        position: OPTION_POSITION.RIGHT,
        order: 22,
        hideOnEditMode: true,
        config: {
            clickHandler: () => { },
            className: "position-layer",
            content: () => {
                return <Position stageRef={props.stageRef}
                    onChange={props.onChange}
                    layer={props.layer}
                    containerOffset={props.containerOffset}
                    zoomLevel={props.zoomLevel}
                    selectedGroupId={props.selectedGroupId}
                    shapeRef={props.shapeRef}>
                </Position>
            }
        }
    }
}

export const getTransparency = (props, transparencyValue) => {
    return {
        subType: EDIT_OPTIONS.TRANSPARENCEY,
        position: OPTION_POSITION.RIGHT,
        hideOnEditMode: true,
        order: 23,
        config: {
            clickHandler: (e) => { },
            content: () => {
                return <Transparency
                    shapeRef={props.shapeRef}
                    stageRef={props.stageRef}
                    setTransparencyValue={(value) => updateTransparency(value, props)}
                    transparencyValue={transparencyValue}></Transparency>
            }
        }
    }
}

export const getLock = (props) => {
    return {
        subType: EDIT_OPTIONS.LOCK_LAYER,
        position: OPTION_POSITION.RIGHT,
        showWhenLock: true,
        hideOnEditMode: true,
        order: 24,
        config: {
            clickHandler: () => { handleLockLayer(props) },
            icon: isLayerLocked(props) ? faLock : faUnlockAlt,
            size: "2x",
            content: () => {
                let icon = isLayerLocked(props) ? faLock : faUnlockAlt;
                return (
                    <Button><FontAwesomeIcon icon={icon} size={"1x"} /></Button>
                )
            }
        }
    }
}

export const getDelete = (props) => {
    return {
        subType: EDIT_OPTIONS.DELETE_LAYER,
        position: OPTION_POSITION.RIGHT,
        hideOnEditMode: true,
        order: 25,
        config: {
            clickHandler: () => { },
            content: () => {
                return (
                    <DeleteLayer {...props}></DeleteLayer>
                )
            }
        }
    }
}

export const getEffect = (props) => {
    return {
        subType: EDIT_OPTIONS.EFFECT,
        position: OPTION_POSITION.LEFT,
        order: 8,
        config: {
            clickHandler: () => { handleEffect(props) },
            content: () => {
                return (
                    <Button>Effect</Button>
                )
            }
        }
    }
}

export const getFilter = (props) => {
    return {
        subType: EDIT_OPTIONS.FILTER,
        position: OPTION_POSITION.LEFT,
        order: 9,
        config: {
            clickHandler: () => { handleFilter(props) },
            content: () => {
                return (
                    <Button>Filter</Button>
                )
            }
        }
    }
}

export const getFlipHorizontal = (props) => {
    return {
        subType: EDIT_OPTIONS.FLIP_HORIZONTAL,
        position: OPTION_POSITION.LEFT,
        order: 10,
        config: {
            clickHandler: () => { handleFlip("horizontal", props) },
            content: () => {
                return (
                    // <FontAwesomeIcon icon={faSort} size={"2x"} rotation={90} />
                    <Button>FlipX</Button>
                )
            }
        }
    }
}

export const getFlipVertical = (props) => {
    return {
        subType: EDIT_OPTIONS.FLIP_VERTICAL,
        position: OPTION_POSITION.LEFT,
        order: 11,
        config: {

            clickHandler: () => { handleFlip("vertical", props) },
            content: () => {
                return (
                    // <FontAwesomeIcon icon={faSort} size={"2x"} />
                    <Button>FlipY</Button>
                )
            }
        }
    }
}

export const getCropStart = (props) => {

    let currentImage = props.shapeRef.current.attrs;
    if (currentImage.type !== 'Image' || currentImage.scaleX + currentImage.scaleY !== 2) return 0;
    return {
        subType: EDIT_OPTIONS.CROP_START,
        position: OPTION_POSITION.LEFT,
        order: 12,
        config: {
            clickHandler: () => { handleCropStart(props) },
            content: () => {
                return (
                    // <FontAwesomeIcon icon={faCrop} size={"2x"} />
                    <Button>Crop</Button>
                )
            }
        }
    }
}

const handleEffect = (props) => {
    
}

const handleFilter = (props) => {
    props.handleElementClick(ELEMENT_TRAY_TYPE.FILTER_PICKER);
}

const filp = (layerList, direction, props) => {
    var layer = [...layerList];
    var index = findIndex(layer, props);

    if (index >= 0) {
        let copyChild = { ...layer[index] };
        if (direction === "vertical") {
            copyChild.scaleY = -(copyChild.scaleY);
        } else if (direction === "horizontal") {
            copyChild.scaleX = -(copyChild.scaleX);
        }
        layer[index] = copyChild;
    }

    return layer;
}



const handleFlip = (direction, props) => {
    let groupIndex = findGroupIndex(props.layer, props);
    if (groupIndex >= 0) {
        let layerList = [...props.layer];
        let groupLayer = { ...layerList[groupIndex] };
        groupLayer.childElements = filp(groupLayer.childElements, direction, props);
        layerList[groupIndex] = groupLayer;
        props.onChange(layerList);
    } else {
        props.onChange(filp(props.layer, direction, props));
    }
}

const handleCropStart = (props) => {
    var groupIndex = null;
    var layer = [...props.layer];
    var index = layer.findIndex(obj => obj.id === props.shapeRef.current.attrs.id);
    if ( index === -1) {
        groupIndex = layer.findIndex(layer => layer.id === props.selectedGroupId);
    
        var groupLayer = [...layer[groupIndex].childElements];
        index = groupLayer.findIndex(obj => obj.id === props.shapeRef.current.attrs.id);
    }
    props.onCropStart(index, groupIndex);
}

const updateTransparency = (calOpacity, props) => {
    if (props.shapeRef && props.shapeRef.current) {
        let obj = findLayer(props.layer, props);
        if (obj) {
            let index = findIndex(props.layer, props);
            let copyObj = { ...obj };
            copyObj.opacity = calOpacity * 0.01;
            let copyLayer = [...props.layer];

            if (copyObj.isChildren) {
                let parentIndex = props.layer.findIndex(l => copyObj.parentId === l.id);
                let parent = { ...props.layer[parentIndex] };
                parent.childElements = [...parent.childElements];
                parent.childElements[index] = copyObj;
                copyLayer[parentIndex] = parent;
            } else {
                copyLayer[index] = copyObj;
            }
            props.onChange(copyLayer);
        }

    }
}


const handleLockLayer = (props) => {
    let groupIndex = findGroupIndex(props.layer, props);
    if (groupIndex >= 0) {
        let layerList = [...props.layer];
        let groupLayer = { ...layerList[groupIndex] };
        groupLayer.locked = !groupLayer.locked;
        groupLayer.childElements = lockLayers(groupLayer.childElements, props);
        layerList[groupIndex] = groupLayer;
        props.onChange(layerList);
    } else {
        props.onChange(lockLayers(props.layer, props));
    }
}

const lockLayers = (layers, props) => {
    var copyLayerList = [...layers];

    for (let i = 0; i < copyLayerList.length; i++) {
        let copyLayer = { ...copyLayerList[i] };

        if (copyLayer.type === 'Group') {
            let returnChildElements = lockLayers(copyLayer.childElements);
            if (returnChildElements) {
                copyLayer.childElements = returnChildElements;
            }
            copyLayerList[i] = copyLayer;
            copyLayer.locked = !copyLayer.locked;
        } else {
            if (copyLayer.id === props.shapeRef.current.attrs.id || copyLayer.isChildren) {
                copyLayer.locked = !copyLayer.locked;
                copyLayerList[i] = copyLayer;
            }
        }
    }

    return copyLayerList;
}

export const getFontSize = (fontType, props = {}) => {
    return {
        subType: EDIT_OPTIONS.FONT_SIZE,
        position: OPTION_POSITION.LEFT,
        order: 2,
        config: {
            clickHandler: () => { },
            disableHover: true,
            content: () => {
                return (
                    <FontSize fontType={fontType} {...props}></FontSize>
                )
            }
        }
    }
}