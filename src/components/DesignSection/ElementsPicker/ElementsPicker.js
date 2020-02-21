import React, { useEffect } from 'react';
import './ElementsPicker.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudUploadAlt, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
// import { faImage, faKeyboard } from '@fortawesome/free-regular-svg-icons'
import PhotosTray from './Elements/PhotosTray/PhotosTray';
import ShapesTray from './Elements/ShapesTray/ShapesTray';
import TextTray from './Elements/TextTray/TextTray';
import BackgroundsTray from './Elements/BackgroundsTray/BackgroundsTray';
import UploadsTray from './Elements/UploadsTray/UploadsTray';
// import ColorPickerTray from './Elements/ColorPickerTray/ColorPickerTray';
import FontTray from './Elements/FontTray/FontTray';
import GraphTableTray from './Elements/GraphTableTray/GraphTableTray';
import TextColorPickerTray from './Elements/TextColorPickerTray/TextColorPickerTray';
import ChartColorPickerTray from './Elements/ColorPickerTray/ChartColorPickerTray/ChartColorPIckerTray';
import BackgroundColorPickerTray from './Elements/ColorPickerTray/BackgroundColorPickerTray/BackgroundColorPickerTray';
import TemplatesTray from './Elements/TemplatesTray/TemplatesTray';
import AdjustmentsTray from './Elements/AdjustmentsTray/AdjustmentsTray';
import FilterTray from './Elements/FilterTray/FilterTray';
import { TemplateIcon, PhotosIcon, ElementsIcon, TextIcon, VideoIcon, BackgroundIcon, UploadIcon, FolderIcon } from './Icons';

export const ELEMENT_TRAY_TYPE = {
    TEMPLATE: 'TEMPLATE',
    PHOTO: 'PHOTO',
    SHAPE: 'SHAPE',
    TEXT: 'TEXT',
    VIDEOS: 'VIDEOS',
    BACKGROUND: 'BACKGROUND',
    UPLOADS: 'UPLOADS',
    FOLDERS: 'FOLDERS',
    COLOR_PICKER: 'COLOR_PICKER',
    BACKGROUND_COLOR_PICKER: 'BACKGROUND_COLOR_PICKER',
    CHART_COLOR_PICKER: 'CHART_COLOR_PICKER',
    LEGEND_COLOR_PICKER: 'LEGEND_COLOR_PICKER',
    FONT_PICKER: 'FONT_PICKER',
    FILTER_PICKER: 'FILTER_PICKER',
    CHART_TABLE: 'CHART_TABLE',
    ADJUSTMENTS: 'ADJUSTMENTS'
}

export const ELEMENT_TYPE = {
    GROUP: 'Group',
    IMAGE: 'Image',
    TEXT: 'Text',
    RECT: 'Rect',
    CIRCLE: 'Circle',
}

export const ELEMENT_SUB_TYPE = {
    BACKGROUND_IMAGE: 'BACKGROUD_IMAGE',
    BACKGROUD_COLOR: 'BACKGROUD_COLOR',
    IMAGE: 'IMAGE',
    DRAG_IMAGE: 'DRAG_IMAGE',
    CHART: 'CHART',
    TEXT: 'TEXT',
    RECT: 'RECT',
    CIRCLE: 'CIRCLE',
    GROUP: 'GROUP',
    CUSTOM_SHAPE: 'CUSTOM_SHAPE'
}

function ItemsTray(props) {
    const [flag, setFlag] = React.useState(false);

    useEffect(() => {
        if (props.shapeRef && props.shapeRef.current && props.shapeRef.current.attrs.subType === 'IMAGE' && !props.shapeRef.current.attrs.locked) {
            setFlag(true);
        }   else {
            setFlag(false);
        }
    }, [props.shapeRef]);

    function handleAddElement(element) {
        props.handleAddElement(element);
    }

    var tray;
    switch (props.selectedElement) {
        case ELEMENT_TRAY_TYPE.TEMPLATE: tray = <TemplatesTray />; break;
        case ELEMENT_TRAY_TYPE.PHOTO: tray = <PhotosTray mouseDownOnElement={props.mouseDownOnElement} handleAddElement={(element) => handleAddElement(element)} />; break;
        case ELEMENT_TRAY_TYPE.SHAPE: tray = <ShapesTray handleAddElement={(element) => handleAddElement(element)} />; break;
        case ELEMENT_TRAY_TYPE.TEXT: tray = <TextTray handleAddElement={(element) => handleAddElement(element)} />; break;
        case ELEMENT_TRAY_TYPE.BACKGROUND: tray = <BackgroundsTray handleAddElement={(element) => handleAddElement(element)} {...props}/>; break;
        case ELEMENT_TRAY_TYPE.BACKGROUND_COLOR_PICKER: tray = <BackgroundColorPickerTray setBackgroundColor={props.setBackgroundColor} />; break;
        case ELEMENT_TRAY_TYPE.UPLOADS: tray = <UploadsTray mouseDownOnElement={props.mouseDownOnElement} handleAddElement={(element) => handleAddElement(element)} />; break;
        case ELEMENT_TRAY_TYPE.COLOR_PICKER: tray = <TextColorPickerTray />; break;
        case ELEMENT_TRAY_TYPE.CHART_COLOR_PICKER: tray = <ChartColorPickerTray {...props} />; break;
        case ELEMENT_TRAY_TYPE.FONT_PICKER: tray = <FontTray mouseDownOnElement={props.mouseDownOnElement} handleAddElement={(element) => handleAddElement(element)} />; break;
        case ELEMENT_TRAY_TYPE.CHART_TABLE: tray = <GraphTableTray {...props} />; break;
        case ELEMENT_TRAY_TYPE.ADJUSTMENTS: tray = flag && <AdjustmentsTray {...props} />; break;
        case ELEMENT_TRAY_TYPE.FILTER_PICKER: tray = flag && <FilterTray {...props} />; break;
        default: tray = <h1>{props.selectedElement} Works!!</h1>
    }
    let classes = ["items-tray", props.selectedElement];

    return (
        <div className={classes.join(" ")}>
            {tray}
        </div>
    )
}

function ElementsPicker(props) {
    function selectClassNames(i, element) {
        var classNames = "";
        props.selectedElement === element ? classNames += "element-selected" : classNames += "element-unselected";
        props.selectedElement === i - 1 ? classNames += " border-tr-radius-15" : classNames += "";
        props.selectedElement === i + 1 ? classNames += " border-br-radius-15" : classNames += "";
        return classNames;
    }

    function handleAddElement(element) {
        props.handleAddElement(element);
    }

    return (
        <aside className={props.selectedElement ? "aside-expanded" : ""}>
            <div className={'element-picker-tray ' + (props.selectedElement ? 'element-picker-tray-expanded' : '')}>
                <div className="elements-ul-container">
                    <ul>
                        <li onClick={() => props.handleElementClick(ELEMENT_TRAY_TYPE.TEMPLATE)} className={selectClassNames(1, ELEMENT_TRAY_TYPE.TEMPLATE)}>
                            <TemplateIcon/><br></br>Templates
                    </li>
                        <li onClick={() => props.handleElementClick(ELEMENT_TRAY_TYPE.PHOTO)} className={selectClassNames(2, ELEMENT_TRAY_TYPE.PHOTO)}>
                            <PhotosIcon /><br></br>Photos
                    </li>
                        <li onClick={() => props.handleElementClick(ELEMENT_TRAY_TYPE.SHAPE)} className={selectClassNames(3, ELEMENT_TRAY_TYPE.SHAPE)}>
                            <ElementsIcon /><br></br>Elements
                    </li>
                    <li onClick={() => props.handleElementClick(ELEMENT_TRAY_TYPE.TEXT)} className={selectClassNames(4, ELEMENT_TRAY_TYPE.TEXT)}>
                            <TextIcon /><br></br>Text
                    </li>
                    <li onClick={() => props.handleElementClick(ELEMENT_TRAY_TYPE.VIDEOS)} className={selectClassNames(9, ELEMENT_TRAY_TYPE.VIDEOS)}>
                            <VideoIcon /><br></br>Videos
                    </li>
                        <li onClick={() => props.handleElementClick(ELEMENT_TRAY_TYPE.BACKGROUND)} className={selectClassNames(5, ELEMENT_TRAY_TYPE.BACKGROUND)}>
                            <BackgroundIcon /><br></br>Background
                    </li>
                        <li onClick={() => props.handleElementClick(ELEMENT_TRAY_TYPE.UPLOADS)} className={selectClassNames(6, ELEMENT_TRAY_TYPE.UPLOADS)}>
                            <UploadIcon /><br></br>Uploads
                    </li>
                    <li onClick={() => props.handleElementClick(ELEMENT_TRAY_TYPE.FOLDERS)} className={selectClassNames(8, ELEMENT_TRAY_TYPE.FOLDERS)}>
                            <FolderIcon icon={faCloudUploadAlt} size="2x" /><br></br>Folders
                    </li>
                    <li onClick={() => props.handleElementClick(ELEMENT_TRAY_TYPE.ADJUSTMENTS)} className={selectClassNames(7, ELEMENT_TRAY_TYPE.ADJUSTMENTS)}>
                            <FontAwesomeIcon icon={faCloudUploadAlt} size="2x" /><br></br>Adjustment
                    </li>
                        <li className={selectClassNames(7)}></li>
                    </ul>
                </div>

                {props.selectedElement && <ItemsTray {...props} handleAddElement={(element) => handleAddElement(element)} />}
            </div>
            {props.selectedElement && <div className="collapse-btn" onClick={() => props.handleElementClick(null)}><FontAwesomeIcon icon={faAngleLeft} /></div>}
        </aside>
    )
}

export default ElementsPicker;