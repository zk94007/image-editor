import React, { useEffect } from 'react';
import './EditOptions.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSort,
  faBold,
  faItalic,
  faUnderline,
  faTrash,
  faLock,
  faUnlockAlt,
  faObjectGroup,
  faObjectUngroup,
  faCrop,
  faFont
} from '@fortawesome/free-solid-svg-icons';
import { ELEMENT_TYPE } from '../../ElementsPicker/ElementsPicker';
import { GROUP_STATE, TEXT_EDIT_MODE } from '../EditableDiv';
import Portal from '../../../../utilities/Portal';
import Overlay from '../../../../utilities/Overlay/Overlay';
import Crop from '../Crop/Crop';
import Transparency from './Transparency/Transparency';
import unorderedListSvg from '../../../../assets/img/unordered-list.svg';
import orderedListSvg from '../../../../assets/img/ordered-list.svg';
import alignCenter from '../../../../assets/img/align-center.svg';
import alignLeft from '../../../../assets/img/align-left.svg';
import alignRight from '../../../../assets/img/align-right.svg';
import alignJustify from '../../../../assets/img/align-justify.svg';
import fontCase from '../../../../assets/img/fontcase.svg';
import { getQuillContainer, getFormat, getFonts, createAndDispatchEvent } from '../../../../utilities/EditableDivUtil';
import FontSize from './FontSize/FontSize';
import Position from './Position/Position';
import Button from '@material-ui/core/Button';
import Spacing from './Spacing/Spacing';
import FontStyleMobile from './FontStyleMobile/FontStyleMobile';
import ColorPickerMobile from './ColorPickerMobile/ColorPickerMobile';
import { getZoomLevelFromStageRef } from './EditOptionsUtil';

function EditOptions(props) {

  const [optionsLeft, setOptionsLeft] = React.useState([]);
  const [optionsRight, setOptionsRight] = React.useState([]);
  const [updateOptions, setUpdateOptions] = React.useState();
  const [cropEnabled, setCropEnabled] = React.useState(false);
  // const [transparencyEl, setTransparencyEl] = React.useState(null);
  const [transparencyValue, setTransparencyValue] = React.useState(100);
  const [formatChangedValue, setFormatChangedValue] = React.useState({});

  const getTransfomerCornerPosition = () => {
    let parent = props.shapeRef.current.getParent();
    let children = parent.children;
    let transformer = children.filter(child => child.attrs.type === 'Transformer')[0];
    var topLeft = transformer.findOne('.top-left').getAbsolutePosition(parent);
    var bottomLeft = transformer.findOne('.bottom-left').getAbsolutePosition(parent);
    var bottomRight = transformer.findOne('.bottom-right').getAbsolutePosition(parent);

    return { topLeft: topLeft, bottomLeft: bottomLeft, bottomRight: bottomRight };
  }
  const filp = (layerList = props.layer, direction) => {
    var layer = [...layerList];
    var index = findIndex(layer);
    let { topLeft, bottomLeft, bottomRight } = getTransfomerCornerPosition();

    if (index >= 0) {
      let copyChild = { ...layer[index] };
      if (direction === "vertical") {
        let changedX = topLeft.x - bottomLeft.x;
        let changedY = topLeft.y - bottomLeft.y;
        copyChild.scaleY = -(copyChild.scaleY);
        //copyChild.x -= changedX;
        //copyChild.y -= changedY;
      } else if (direction === "horizontal") {
        let changedX = bottomLeft.x - bottomRight.x;
        let changedY = bottomLeft.y - bottomRight.y;
        copyChild.scaleX = -(copyChild.scaleX);
        //copyChild.x -= changedX;
        //copyChild.y -= changedY;
      }
      layer[index] = copyChild;
    }

    return layer;
  }
  function handleFlip(direction) {
    let groupIndex = findGroupIndex();
    if (groupIndex >= 0) {
      let layerList = [...props.layer];
      let groupLayer = { ...layerList[groupIndex] };
      groupLayer.childElements = filp(groupLayer.childElements, direction);
      layerList[groupIndex] = groupLayer;
      props.onChange(layerList);
    } else {
      props.onChange(filp(props.layer, direction));
    }
  }

  const removeTempEditor = () => {
    setTimeout(() => {
      createAndDispatchEvent({ shouldCreate: true }, 'removeTempEditor');
    }, 0)
  }

  function handleDeleteLayer() {
    if (props.textEditMode === TEXT_EDIT_MODE.EDITOR) return;

    let changedLayers = deleteLayers();
    let groupObj = findGroup(changedLayers);

    if (groupObj && groupObj.childElements.length <= 1) {
      props.onChange(changedLayers);
      props.unGroupPermanentGroup();
    } else {
      props.onChange(changedLayers);
    }
  }


  const lockLayers = (layers = props.layer) => {
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

  const deleteLayers = (layers = props.layer) => {
    var copyLayerList = [...layers];

    for (let i = 0; i < copyLayerList.length; i++) {
      let copyLayer = { ...copyLayerList[i] };
      if (copyLayer.type === 'Group') {
        if (copyLayer.groupState === GROUP_STATE.TEMPORARY) {
          copyLayerList.splice(i, 1);
        } else {
          let returnChildElements = deleteLayers(copyLayer.childElements);
          if (returnChildElements) {
            copyLayer.childElements = returnChildElements;
            copyLayerList[i] = copyLayer;
          }
        }
      } else {
        if (copyLayer.id === props.shapeRef.current.attrs.id) {
          copyLayerList.splice(i, 1);
        }
      }
    }
    return copyLayerList;
  }

  const findLayer = (layers = props.layer) => {
    var copyLayerList = [...layers];

    for (let i = 0; i < copyLayerList.length; i++) {
      let copyLayer = { ...copyLayerList[i] };
      if (copyLayer.type === 'Group') {
        if (copyLayer.id === props.shapeRef.current.attrs.id) {
          return copyLayer;
        }
        let layer = findLayer(copyLayer.childElements);
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

  function handleLockLayer() {
    let groupIndex = findGroupIndex();
    if (groupIndex >= 0) {
      let layerList = [...props.layer];
      let groupLayer = { ...layerList[groupIndex] };
      groupLayer.locked = !groupLayer.locked;
      groupLayer.childElements = lockLayers(groupLayer.childElements);
      layerList[groupIndex] = groupLayer;
      props.onChange(layerList);
    } else {
      props.onChange(lockLayers());
    }
  }

  function findIndex(layers = props.layer) {
    var copyLayerList = [...layers];

    for (let i = 0; i < copyLayerList.length; i++) {
      let copyLayer = { ...copyLayerList[i] };
      if (copyLayer.type === 'Group') {
        if (copyLayer.id === props.shapeRef.current.attrs.id) {
          return i;
        }
        let index = findIndex(copyLayer.childElements);
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

  function isLayerLocked() {
    let obj = findLayer();
    if (obj) {
      return obj.locked;
    }

    return false;
  }

  function createTransperantRect() {

    let groupClientRect = props.shapeRef.current.getClientRect();
    let zoomLevel = (1 / getZoomLevelFromStageRef(props.stageRef));
    let rect = {
      type: 'Rect',
      x: 0,
      y: 0,
      width: groupClientRect.width * zoomLevel,
      height: groupClientRect.height * zoomLevel,
      scaleX: 1,
      scaleY: 1,
      fill: "red",
      opacity: 0.2,
      draggable: false,
      isChildren: true
    }

    return rect;
  }

  function handleGroupLayer() {
    var layers = [...props.layer];
    var index = findIndex();

    let copyLayer = { ...layers[index] };
    let groupObj = findGroup();

    if (copyLayer.groupState === GROUP_STATE.PERMANENT) {
      props.unGroupPermanentGroup(props.selectedGroupId);
    } else if (groupObj && groupObj.groupState === GROUP_STATE.PERMANENT) {
      props.unGroupPermanentGroup(props.selectedGroupId);
    } else {
      // let rect = createTransperantRect(copyLayer);
      copyLayer.groupState = GROUP_STATE.PERMANENT;
      copyLayer.childElements = copyLayer.childElements.map(l => {
        let copy = { ...l };
        copy.oldPosition = null;
        return copy;
      });
      // copyLayer.childElements.unshift(rect);
      layers[index] = copyLayer;
      props.setSelectedElements([]);
      props.onChange(layers);
    }
  }

  const findGroup = (layers = props.layer) => {
    return layers.find(layer => layer.id === props.selectedGroupId);
  }

  const findGroupIndex = (layers = props.layer) => {
    return layers.findIndex(layer => layer.id === props.selectedGroupId);
  }

  function showGroup() {
    let obj = findLayer();
    let groupObj = findGroup();
    if (obj && obj.canPermanentGroup) {
      return obj.canPermanentGroup;
    } else if (groupObj) {
      return groupObj.canPermanentGroup;
    }
  }
  function isLayerGrouped() {
    if (!props.shapeRef) {
      return false;
    }

    let obj = findGroup();
    if (obj) {
      return obj.groupState === GROUP_STATE.PERMANENT;
    }
    return false;
  }

  const handleCropLayer = () => {
    setCropEnabled(true);
  }

  const handleFontCaseChange = (e) => {
    // let parentParagraph = getClosestParent("p, li");

    // if (parentParagraph) {
    //   if (parentParagraph.style.textTransform === 'uppercase') {
    //     parentParagraph.style.textTransform = 'none';
    //   } else {
    //     parentParagraph.style.textTransform = 'uppercase';
    //   }
    // }
    let quill = getQuillContainer();
    if (quill) {
      let format = quill.getFormat();
      if (format && format.texttransform === 'uppercase') {
        quill.format('texttransform', 'none');
      } else {
        quill.format('texttransform', 'uppercase');
      }
      removeTempEditor();
    }
  }

  const updateLayerProperty = (layer = props.layer, propertyName, propertyValue) => {
    let copyLayer = [...layer];

    let obj = findLayer(copyLayer);
    if (obj) {
      let index = findIndex(layer);
      let copyObj = { ...obj };
      if (copyObj.type === 'Group') {
        copyObj.childElements = updateLayerProperty(copyObj.childElements, propertyName, propertyValue);
      } else {
        copyObj[propertyName] = propertyValue;
      }
      copyLayer[index] = copyObj;
      //props.onChange(copyLayer);
    }
    return copyLayer;

  }

  const updateTransparency = (calOpacity) => {
    if (props.shapeRef && props.shapeRef.current) {
      let obj = findLayer(props.layer);
      if (obj) {
        let index = findIndex(props.layer);
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

  useEffect(() => {
    let editOptionsLeft = [];
    let editOptionsRight = [];
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

    const flipVertical = {
      clickHandler: () => { handleFlip("vertical") },
      icon: faSort,
      size: "2x",
      content: () => {
        return (
          <FontAwesomeIcon icon={faSort} size={"2x"} />
        )
      }
    }

    const flipHorizontal = {
      clickHandler: () => { handleFlip("horizontal") },
      icon: faSort,
      size: "2x",
      attrs: {
        rotation: 90
      },
      content: () => {
        return (
          <FontAwesomeIcon icon={faSort} size={"2x"} rotation={90} />
        )
      }
    }

    const fontBold = {
      clickHandler: () => {
        let quill = getQuillContainer();
        if (quill) {
          let format = quill.getFormat();
          quill.format('bold', !format.bold);
          removeTempEditor();
        }
      },
      icon: faBold,
      size: "2x",
      content: () => {
        return (
          <FontAwesomeIcon icon={faBold} size={"2x"} />
        )
      }
    }

    const fontItalic = {
      clickHandler: () => {
        let quill = getQuillContainer();
        if (quill) {
          let format = quill.getFormat();
          quill.format('italic', !format.italic);
          removeTempEditor();
        }
      },
      icon: faItalic,
      size: "2x",
      content: () => {
        return (
          <FontAwesomeIcon icon={faItalic} size={"2x"} />
        )
      }
    }

    const fontUnderline = {
      clickHandler: () => {
        let quill = getQuillContainer();
        if (quill) {
          let format = quill.getFormat();
          quill.format('underline', !format.underline);
          removeTempEditor();
        }
      },
      icon: faUnderline,
      size: "2x",
      content: () => {
        return (
          <FontAwesomeIcon icon={faUnderline} size={"2x"} />
        )
      }
    }

    const fontChangeCase = {
      clickHandler: (e) => { handleFontCaseChange(e) },
      image: () => {
        return fontCase;
      },
      size: "2x",
      content: () => {
        return (
          <img src={fontCase} alt="fontChangeCase" height="48px" width="48px"></img>
        )
      }
    }

    const changeColor = {
      clickHandler: () => { props.handleElementClick(ELEMENT_TYPE.COLOR_PICKER) },
      content: () => {
        return (
          <React.Fragment>
            <span className="web">
              <FontAwesomeIcon icon={faFont} size={"2x"} />
            </span>
            <ColorPickerMobile></ColorPickerMobile>
          </React.Fragment>
        )
      }
    }
    const changeFont = {
      clickHandler: () => { props.handleElementClick(ELEMENT_TYPE.FONT_PICKER) },
      className: "font-change",
      content: () => {
        let label = "Arial";
        if (props.textEditMode) {
          let format = getFormat();
          if (format.font) {
            let font = getFonts(format.font);
            label = font ? font.label : label;
          }
        }
        return (
          // <FontAwesomeIcon icon={faFont} size={"2x"} />
          <React.Fragment>
            <Button classes={{ root: 'web' }}>{label}</Button>
            <FontStyleMobile label={label}></FontStyleMobile>
          </React.Fragment>
        )
      }
    }
    const fontSize = {
      clickHandler: () => { },
      disableHover: true,
      content: () => {
        return (
          <FontSize></FontSize>
        )
      }
    }

    const textList = {
      clickHandler: e => {

        let quill = getQuillContainer();
        if (quill) {
          let format = quill.getFormat();

          if (format.list === "ordered") {
            quill.format('list', null);
          } else if (format.list === "bullet") {
            quill.format('list', 'ordered');
          } else {
            quill.format('list', 'bullet');
          }
          removeTempEditor();
        }
      },
      content: () => {
        let svg = unorderedListSvg;
        let quill = getQuillContainer();
        if (quill) {
          if (quill) {
            let format = quill.getFormat();
            svg = format.list === "ordered" ? orderedListSvg : unorderedListSvg;
          }
        }

        return <img src={svg} alt="textAlignment" height="48px" width="48px"></img>
      }
    }

    const textAlignment = {
      clickHandler: e => {
        let quill = getQuillContainer();
        if (quill) {
          let format = quill.getFormat();
          if (format.align === 'center') {
            quill.format('align', '');
          } else if (format.align === 'justify') {
            quill.format('align', 'right');
          } else if (format.align === 'right') {
            quill.format('align', 'center');
          } else {
            quill.format('align', 'justify');
          }
          removeTempEditor();
        }
      },
      content: () => {
        let quill = getQuillContainer();
        let align = '';
        if (quill) {
          let format = quill.getFormat();
          align = format.align;
        }
        let svg;

        if (align === 'center') {
          svg = alignCenter;
        } else if (align === 'justify') {
          svg = alignJustify;
        } else if (align === 'right') {
          svg = alignRight;
        } else {
          svg = alignLeft;
        }

        return <img src={svg} alt="textAlignment" height="48px" width="48px"></img>

      }
    }

    const SpacingLayer = {
      clickHandler: (e) => { },
      className: "spacing-layer",
      content: () => {
        return <Spacing zoomLevel={getZoomLevelFromStageRef(props.stageRef)} removeTempEditor={removeTempEditor}></Spacing>
      }
    }

    const deleteLayer = {
      clickHandler: () => { handleDeleteLayer() },
      icon: faTrash,
      size: "2x",
      content: () => {
        return (
          <FontAwesomeIcon icon={faTrash} size={"2x"} />
        )
      }
    }

    const groupLayer = {
      clickHandler: () => { handleGroupLayer() },
      icon: isLayerGrouped() ? faObjectUngroup : faObjectGroup,
      size: "2x",
      content: () => {
        let icon = isLayerGrouped() ? faObjectUngroup : faObjectGroup;
        return (
          <FontAwesomeIcon icon={icon} size={"2x"} />
        )
      }
    }

    const copyLayer = {
      clickHandler: () => { props.copyAndPasteLayer() },
      content: () => {
        return <Button>Copy</Button>
      }
    }

    const position = {
      clickHandler: () => { },
      className: "position-layer",
      content: () => {
        return <Position stageRef={props.stageRef}
          onChange={props.onChange}
          layer={props.layer}
          selectedGroupId={props.selectedGroupId}
          shapeRef={props.shapeRef}>
        </Position>
      }
    }

    const lockLayer = {
      clickHandler: () => { handleLockLayer() },
      icon: isLayerLocked() ? faLock : faUnlockAlt,
      size: "2x",
      content: () => {
        let icon = isLayerLocked() ? faLock : faUnlockAlt;
        return (
          <FontAwesomeIcon icon={icon} size={"2x"} />
        )
      }
    }

    const cropLayer = {
      clickHandler: () => { handleCropLayer() },
      icon: faCrop,
      size: "2x",
      content: () => {
        return (
          <FontAwesomeIcon icon={faCrop} size={"2x"} />
        )
      }
    }

    const transparencyLayer = {
      clickHandler: (e) => { },
      content: () => {
        return <Transparency 
                  shapeRef={props.shapeRef} 
                  stageRef={props.stageRef} 
                  setTransparencyValue={(value) => updateTransparency(value)} 
                  transparencyValue={transparencyValue}
                >
                </Transparency>
      }
    }

    let obj = findLayer();
    if (!isLayerLocked() && !obj.background) {
      if (obj && obj.type !== 'Group') {
        if (props.shapeRef.current.attrs.elementType !== ELEMENT_TYPE.TEXT) {
          editOptionsLeft.push(flipVertical, flipHorizontal);
        } else if (props.shapeRef.current.attrs.elementType === ELEMENT_TYPE.TEXT && props.textEditMode) {
          editOptionsLeft.push(changeFont, fontSize, changeColor, fontBold, fontItalic, fontUnderline, fontChangeCase, textList, textAlignment, SpacingLayer);
        } else if (props.shapeRef.current.attrs.scaleX > 0 && props.shapeRef.current.attrs.scaleY > 0) {
          //editOptionsLeft.push(cropLayer);
        }
        // editOptionsLeft.push(cropLayer);
      }
      if (props.textEditMode !== TEXT_EDIT_MODE.EDITOR) {
        editOptionsLeft.push(deleteLayer);
      }

      if (!props.textEditMode) {
        if (showGroup()) {
          editOptionsRight.push(groupLayer);
        }
        editOptionsRight.push(copyLayer, position);
        if (obj && obj.type !== 'Group') {
          editOptionsRight.push(transparencyLayer);
        }
      }
    }

    if (!isLayerLocked() && obj.background) {
      editOptionsLeft.push(deleteLayer);
      editOptionsRight.push(transparencyLayer);
    }

    if (!props.textEditMode) {
      editOptionsRight.push(lockLayer);
    }
    setOptionsLeft(editOptionsLeft);
    setOptionsRight(editOptionsRight);
    
    // eslint-disable-next-line
  }, [props.layer, props.shapeRef, props.selectedGroupId, updateOptions, props.textEditMode, formatChangedValue]);


  React.useEffect(() => {
    let checkForDelete = (e) => {
      if (props.shapeRef && props.shapeRef.current) {
        if (e.keyCode === 8) {
          handleDeleteLayer();
        }
      }
    }
    document.addEventListener('keyup', checkForDelete);
    return () => {
      document.removeEventListener("keyup", checkForDelete);
    }
  });

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
            <div>
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
      {
        cropEnabled && <Portal>
          <div>
            <Overlay></Overlay>
            <Crop shapeRef={props.shapeRef}
              stageRef={props.stageRef}
              layer={props.layer}
              imgSrc={props.shapeRef.current.attrs.originalImg}
              onChange={props.onChange}
              setCropEnabled={setCropEnabled}></Crop>
          </div>
        </Portal>
      }

    </div >
  )
}

export default EditOptions;