import React, { useEffect } from 'react';
import './EditOptions.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '@material-ui/core/Button';
import {
  faObjectGroup,
  faObjectUngroup,
} from '@fortawesome/free-solid-svg-icons';
import { ELEMENT_SUB_TYPE } from '../../ElementsPicker/ElementsPicker';
import { GROUP_STATE, TEXT_EDIT_MODE } from '../EditableDiv';
import { LAYER_POSTION } from './Position/Position';
import { getImageOptions } from './Utils/ImageOptionsUtils';
import { getTextOptions } from './Utils/TextOptionsUtils';
import { getBackgroundOptions } from './Utils/BackgroundOptionsUtils';
import { findGroup, isLayerLocked } from './Utils/CommonUtils';
import { getGroupOptions } from './Utils/GroupOptionsUtils';
import { getChartOptions } from './Utils/ChartOptionsUtils';

function EditOptions(props) {
  const [optionsLeft, setOptionsLeft] = React.useState([]);
  const [optionsRight, setOptionsRight] = React.useState([]);
  const [updateOptions, setUpdateOptions] = React.useState();
  const [transparencyValue, setTransparencyValue] = React.useState(100);
  const [formatChangedValue, setFormatChangedValue] = React.useState({});

  const getOptions = () => {
    let shapeCurrent = props.shapeRef.current;
    let options = [];
    
    switch (shapeCurrent.getAttr('subType')) {
      case ELEMENT_SUB_TYPE.IMAGE:
      case ELEMENT_SUB_TYPE.DRAG_IMAGE:
      case ELEMENT_SUB_TYPE.RECT:
      case ELEMENT_SUB_TYPE.CIRCLE:
        options = getImageOptions(props, transparencyValue)
        break;
      case ELEMENT_SUB_TYPE.TEXT:
        options = getTextOptions(props, transparencyValue);
        break;
      case ELEMENT_SUB_TYPE.BACKGROUND_IMAGE:
        options = getBackgroundOptions(props);
        break;
      case ELEMENT_SUB_TYPE.GROUP:
        options = getGroupOptions(props, transparencyValue);
        break;
      case ELEMENT_SUB_TYPE.CHART:
        options = getChartOptions(props, transparencyValue);
        break;
      default:
        options = '';
    }

    return options;
  }

  function handleGroupLayer() {
    let groupObj = findGroup(props.layer, props);

    if (groupObj && groupObj.groupState === GROUP_STATE.PERMANENT) {
      props.unGroupPermanentGroup(props.selectedGroupId);
    } else if (groupObj && groupObj.hasChildGroup && !groupObj.hasChildElement) {
      props.unGroupTempGroup(true);
    } else {
      props.makeGroupPermanent();
    }
  }

  function handleCropSave() {
    props.setIsCroped(true);
  }
  
  function handleCropCancel() {
    props.onCropCancel();
  }

  function canGroup() {
    let obj = findGroup(props.layer, props);;
    return obj.groupState === GROUP_STATE.TEMPORARY && !obj.hasChildGroup;
  }

  function showGroup() {
    let groupObj = findGroup(props.layer, props);
    if (groupObj && !(groupObj.hasChildGroup && groupObj.hasChildElement)) {
      return true;
    }
  }

  useEffect(() => {
    let editOptionsLeft = [];
    let editOptionsRight = [];

    const groupLayer = {
      clickHandler: () => { handleGroupLayer() },
      content: () => {
        let icon = canGroup() ? faObjectGroup : faObjectUngroup;
        return (
          <FontAwesomeIcon icon={icon} size={"1x"} />
        )
      }
    }

    const cropSave = {
      clickHandler: () => { handleCropSave() },
      content: () => {
          return (
            // <FontAwesomeIcon icon={faCheck} size={"2x"} />
            <Button>Done</Button>
          )
      }
    }
  
    const cropCancel = {
      clickHandler: () => { handleCropCancel() },
      content: () => {
          return (
              // <FontAwesomeIcon icon={faTimes} size={"2x"} />
              <Button>Cancel</Button>
          )
      }
    }

    if (props.cropIndex) {
      editOptionsLeft.push(cropSave);
      editOptionsLeft.push(cropCancel);
      setOptionsLeft(editOptionsLeft);
      setOptionsRight(editOptionsRight);
      return;
    }

    if (!(props.shapeRef && props.shapeRef.current)) {
      setOptionsLeft(editOptionsLeft);
      setOptionsRight(editOptionsRight);
      return;
    }

    if (props.shapeRef && props.shapeRef.current) {
      let opacity = props.shapeRef.current.attrs.opacity;
      let calOpacity = opacity >= 0 ? opacity * 100 : 100;
      setTransparencyValue(calOpacity);
    }

    /* if (!isLayerLocked() && !obj.background) {
      if (obj && obj.type !== 'Group') {
        if (obj.chartType) {
          editOptionsLeft.push(editChart);
        }Crop
        if (!isTextSelected) {
          editOptionsLeft.push(flipVertical, flipHorizontal);
        } else if (isTextSelected && props.textEditMode) {
          editOptionsLeft.push(changeFont, fontSize, changeColor, fontBold, fontItalic, fontUnderline, fontChangeCase, textList, textAlignment, SpacingLayer);
        } else if (props.shapeRef.current.attrs.scaleX > 0 && props.shapeRef.current.attrs.scaleY > 0) {
          //editOptionsLeft.push(cropLayer);
        }
        // editOptionsLeft.push(cropLayer);
      }
      if (props.textEditMode !== TEXT_EDIT_MODE.EDITOR) {
        editOptionsLeft.push(deleteLayer);
      }

      if (props.textEditMode !== TEXT_EDIT_MODE.EDITOR) {
        if (showGroup()) {
          editOptionsRight.push(groupLayer);
        }
        editOptionsRight.push(copyLayer, position, transparencyLayer);
      }
    }

    if (!isLayerLocked() && obj.background) {
      editOptionsLeft.push(deleteLayer);
      editOptionsRight.push(transparencyLayer);
    }

    if (props.textEditMode !== TEXT_EDIT_MODE.EDITOR) {
      editOptionsRight.push(lockLayer);
    }
    setOptionsLeft(editOptionsLeft);
    setOptionsRight(editOptionsRight); */

    //let isTextSelected = props.shapeRef.current.attrs.elementType === ELEMENT_TRAY_TYPE.TEXT;
    if (props.shapeRef.current.getAttr('subType') === ELEMENT_SUB_TYPE.TEXT && !props.textEditMode) {
      return;
    }

    let options = getOptions();

    if (isLayerLocked(props)) {
      options = options.filter(op => op.showWhenLock);
    }

    if (props.textEditMode === TEXT_EDIT_MODE.EDITOR) {
      options = options.filter(op => !op.hideOnEditMode);
    }

    if (showGroup()) {
      editOptionsRight.push(groupLayer);
    }

    if (options && options.length) {
      options.forEach((op) => {
        if (op.position === LAYER_POSTION.LEFT) {
          editOptionsLeft.push(op.config);
        } else if (op.position === LAYER_POSTION.RIGHT) {
          editOptionsRight.push(op.config);
        }
      });

      setOptionsLeft(editOptionsLeft);
      setOptionsRight(editOptionsRight);
    }

  }, [props.layer, props.shapeRef, props.selectedId, props.selectedGroupId, updateOptions, props.textEditMode, formatChangedValue, props.selectedElements, props.cropIndex]);


  React.useEffect(() => {
    let formatChangeEventListener = (data) => {
      setFormatChangedValue(data.details || {});
    }
    document.addEventListener("formatChanged", formatChangeEventListener);
    return () => {
      document.removeEventListener("formatChanged", formatChangeEventListener);
    }

  }, []);

  function getOption(option, i) {
    let element = (
      <a key={i} href="javascript:void(0);" className={[!option.disableHover ? 'has-hover' : '', option.className].join(" ")} onClick={(e) => {
        setUpdateOptions(prev => !prev);
        option.clickHandler(e);
      }}>
        {/* <img src={option.image()} alt="option" height="48px" width="48px"></img> */}
        {option.content()}
      </a>
    );
    return element;
  }
  return (
    <div className="edit-options" id="edit-options">
      {
        <div className="options-wrapper">
          {
            <div className="move-left">
              {
                optionsLeft.map((option, i) => {
                  return (
                    getOption(option, i)
                  )
                })
              }
            </div>
          }
          {
            <div className="move-right">
              {
                optionsRight.map((option, i) => {
                  return (
                    getOption(option, i)
                  )
                })
              }
            </div>
          }
        </div>
      }
    </div >
  )
}

export default EditOptions;