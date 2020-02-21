import {
    getCopyLayer,
    getPosition,
    getFlipVertical,
    getFlipHorizontal,
    getTransparency,
    getLock,
    getDelete,
    getCropStart,
    getEffect,
    getFilter, 
} from "./OptionsUtils";

export const getImageOptions = (props, transparencyValue) => {
    let options = [
        getCopyLayer(props),
        getPosition(props),
        getEffect(props),
        getFilter(props),
        getFlipVertical(props),
        getFlipHorizontal(props),
        getCropStart(props),
        // getCropSave(props),
        // getCropCancel(props),
        getTransparency(props, transparencyValue),
        getLock(props),
        getDelete(props)
    ]

    options.sort((prev, next) => {
        return prev.order - next.order;
    })
    return options;
}