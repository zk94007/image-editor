import { createAndDispatchEvent } from "../../../../../utilities/EditableDivUtil";

export function findIndex(layers, props) {
    var copyLayerList = [...layers];

    for (let i = 0; i < copyLayerList.length; i++) {
        let copyLayer = { ...copyLayerList[i] };
        if (copyLayer.type === 'Group') {
            if (copyLayer.id === props.shapeRef.current.attrs.id) {
                return i;
            }
            let index = findIndex(copyLayer.childElements, props);
            if (index >= 0) {
                return index;
            }
        } else {
            if (copyLayer.id === props.shapeRef.current.attrs.id) {
                return i;
            }
        }
    }
}

export const findGroup = (layers, props) => {
    return layers.find(layer => layer.id === props.selectedGroupId);
}

export const findGroupIndex = (layers, props) => {
    return layers.findIndex(layer => layer.id === props.selectedGroupId);
}


export const findLayer = (layers, props) => {
    var copyLayerList = [...layers];

    for (let i = 0; i < copyLayerList.length; i++) {
        let copyLayer = { ...copyLayerList[i] };
        if (copyLayer.type === 'Group') {
            if (copyLayer.id === props.shapeRef.current.attrs.id) {
                return copyLayer;
            }
            let layer = findLayer(copyLayer.childElements, props);
            if (layer) {
                return layer;
            }
        } else {
            if (copyLayer.id === props.shapeRef.current.attrs.id) {
                return copyLayer;
            }
        }
    }
    return null;
}

export const removeTempEditor = () => {
    setTimeout(() => {
        createAndDispatchEvent({ shouldCreate: true }, 'removeTempEditor');
    }, 0)
}

export function isLayerLocked(props) {
    let obj = findLayer(props.layer, props);
    if (obj) {
        return obj.locked;
    }

    return false;
}
