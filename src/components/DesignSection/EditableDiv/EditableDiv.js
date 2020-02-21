import React, { useEffect } from 'react';
import './EditableDiv.scss';
import Konva from 'konva';
import { Stage, Layer, Image } from 'react-konva';
import EditOptions from './EditOptions/EditOptions';
import Element from './Element/NewElement';
import cloneDeep from 'lodash/cloneDeep';
import { createTempGroup, deletePermanentGroup, createPermanentGroup, deleteTempGroup } from './GroupElements';
import Footer from '../Footer/Footer';
import { calculatePostionFromStageRef } from './EditOptions/EditOptionsUtil';
import { onMouseDown, onMouseMove, onMouseUp } from './MouseSelection';
import { onObjectSnapping, onObjectSnappingEnd } from '../../../utilities/ObjectSnappingUtil';
import { ELEMENT_SUB_TYPE } from '../ElementsPicker/ElementsPicker';
import { getOffsetWidthAndHeight } from '../../../utilities/Utils';
import {faLock} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomShape from './Element/CustomShape/CustomShape';
import NewCropImage from './NewCropImage';
import ResizableRect from './ResizableRect';
import { shape } from 'prop-types';


export const GROUP_STATE = {
  TEMPORARY: 'TEMPORARY',
  PERMANENT: 'PERMANENT',
  MIXED: 'MIXED'
}

export const TEXT_EDIT_MODE = {
  IMAGE: 'IMAGE_TEXT',
  EDITOR: 'EDITOR',
}

function EditableDiv(props) {
  const [selectedGroupId, setGroupId] = React.useState(null);
  const [textEditMode, setTextEditMode] = React.useState(null);
  const [copyElement, setCopyElement] = React.useState([]);
  const [hoverElementRef, setHoverElementRef] = React.useState(null);
  const [selectedElements, setSelectedElements] = React.useState([]);
  const [context, setContext] = React.useState();
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [tempLayers, setTempLayers] = React.useState({});
  const layerRef = React.createRef();
  const [onLoadedCropperImage, setOnLoadedCropperImage] = React.useState(false);
  const [onLoadedCropImage, setOnLoadedCropImage] = React.useState(false);
  const [resizeWidth, setResizeWidth] = React.useState(props.stageWidth);
  const [resizeHeight, setResizeHeight] = React.useState(props.stageHeight);

  const { selectedId, selectShape, shapeRef, setShapeRef, stageRef, setContainerOffset, containerOffset, onResize } = props;

  const replaceLayer = (l) => {
    let copyLayer = { ...l };
    if (props.dropElement.src && !copyLayer.locked) {
      copyLayer.image.src = props.dropElement.src;
      var imageObj2 = new Image();
      imageObj2.src = props.dropElement.src;
      let hoverElementCurrent = hoverElementRef.current;
      imageObj2.onload = function () {
        hoverElementCurrent.image(imageObj2);
      };

      if (layerRef.current) {
        layerRef.current.draw();
      }
    }
    return copyLayer;
  }

  const findAndReplaceElement = (layers) => {
    var copyLayerList = [...layers];

    for (let i = 0; i < copyLayerList.length; i++) {
      let copyLayer = { ...copyLayerList[i] };
      if (copyLayer.type === 'Group') {
        let returnChildElements = findAndReplaceElement(copyLayer.childElements);
        if (returnChildElements) {
          copyLayer.childElements = returnChildElements;
          copyLayerList[i] = copyLayer;
        }
      } else if (hoverElementRef && hoverElementRef.current) {
        if (copyLayer.id === hoverElementRef.current.attrs.id) {
          copyLayerList[i] = replaceLayer(copyLayer);
        }
      }
    }
    return copyLayerList;
  }

  const replaceOrAddLayer = () => {
    // if (hoverElementRef && hoverElementRef.current && hoverElementRef.current.attrs.droppable) {
    //   let layers = findAndReplaceElement(props.layer);
    //   props.handleLayerChange(layers);
    //   props.setDropElement(null);
    // } else {
      addNewLayer();
      props.setDropElement(null);
    // }
  }

  const addNewLayer = () => {
    if (!props.dropElement) {
      return;
    }

    let cursorPosition = getCursorPosition(props.dropElement.event);
    if (cursorPosition.x >= 0 && cursorPosition.y >= 0) {
      props.handleAddElement({
        type: "Image",
        value: props.dropElement.src,
        subType: ELEMENT_SUB_TYPE.DRAG_IMAGE,
        x: calculatePostionFromStageRef(cursorPosition.x, stageRef),
        y: calculatePostionFromStageRef(cursorPosition.y, stageRef)
      })
    }
  }
  
  const getCursorPosition = (e) => {
    let stagePosition = stageRef.current.container().getBoundingClientRect();
    return {
      x: e.x - stagePosition.x - stageRef.current.x(),
      y: e.y - stagePosition.y - stageRef.current.y()
    }
  }

  useEffect(() => {
    if (props.dropElement) {
      replaceOrAddLayer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dropElement])

  useEffect(() => {
    unGroupTempGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.imgUrl])

  useEffect(() => {
    if (!selectedId) {
      setShapeRef(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  // useEffect(() => {
  //   if (props.layer.length > 1) {
  //     console.log(props.layer[1].image);
  //   }
  //   let anim = new Konva.Animation(frame => {
  //     if (shapeRef && shapeRef.current && shapeRef.current.opacity) {
  //       shapeRef.current.opacity((Math.sin(frame.time / 500) + 1) / 2);
  //     }
  //   }, layerRef.current);
      
  //   anim.start();
  // }, [shapeRef, props.setLayer]);
  
  useEffect(() => {
    if (!shapeRef) {
      props.setChartData(null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapeRef])

  useEffect(() => {
    setTempLayers(props.layer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.layer])

  function handleDeselect() {
    selectShape(null);
    setShapeRef(null);
    setGroupId(null);
    setSelectedElements([]);
    unGroupTempGroup();
  }

  const createChildElements = (index, childElements) => {
    return (
      <React.Fragment>
        { childElements.map((element, i) => {
          return (props.groupIndex !== index || props.cropIndex !== i) && getElement(`child_${index}_${i}`, element);
        })}
      </React.Fragment>
    )
  }

  function handleTextEditMode(value) {
    setTextEditMode(value);
    props.setTextEditMode(value);
  }

  function getElement(index, element) {
    return (!element.hide && <Element
      key={element.id}
      shapeProps={element}
      isSelected={element.id === selectedId}
      selectedId={selectedId}
      setHoverElementRef={hoverElementRef => {
        setHoverElementRef(hoverElementRef)
      }}
      onSelect={(id) => {
        if (selectedId !== id) {
          unGroupTempGroup();
          selectShape(id);
        }
      }}
      onChange={newAttrs => {
        const layer = props.layer.slice();
        layer[index] = newAttrs;
        props.handleLayerChange(layer);
      }}
      layerRef={layerRef}
      stageRef={stageRef}
      setShapeRef={value => {
        if (shapeRef && shapeRef.current && value && value.current && shapeRef.current.getId() !== value.current.getId()) {
          props.setChartData(null);
        }
        setShapeRef(value)
      }}
      selectedElements={selectedElements}
      setSelectedElements={setSelectedElements}
      selectedGroupId={selectedGroupId}
      setGroupId={setGroupId}
      setTextEditMode={handleTextEditMode}
      createTemporaryGroup={createTemporaryGroup}
      handleElementClick={props.handleElementClick}
      selectedElement={props.selectedElement}
      zoomLevel={zoomLevel}
      layer={tempLayers}
      containerOffset={containerOffset}
    >{element.type === "Group" && createChildElements(index, element.childElements)}</Element>)
  }

  const createTemporaryGroup = (elements = selectedElements) => {
    if (elements.length > 1) {
      unGroupTempGroup();
      let groupId = props.generateKey();
      props.handleLayerChangeCallback()((prev) => {
        let layers =createTempGroup(elements, prev, groupId);
        setGroupId(groupId);
        selectShape(groupId);
        return layers;
      });
    }
  }

  const unGroupTempGroup = (canDeletePermanentGroup) => {
    if (selectedGroupId) {
      props.handleLayerChangeCallback()((prev) => {
        let layers = [...prev];
        let { copyLayers, groupId } = deleteTempGroup(layers, selectedGroupId, stageRef, canDeletePermanentGroup, props.generateKey);
        setGroupId(groupId);
        return copyLayers;
      });
    }
  }

  const unGroupPermanentGroup = () => {
    if (selectedGroupId) {
      props.handleLayerChangeCallback()((prev) => {
        let changedLayers = deletePermanentGroup(prev, selectedGroupId, stageRef);
        selectShape(selectedGroupId);
        return changedLayers;
      });
    }
  }

  const makeGroupPermanent = () => {
    props.handleLayerChangeCallback()((prev) => {
      setGroupId(shapeRef.current.attrs.id);
      setSelectedElements([shapeRef.current.attrs.id]);
      return createPermanentGroup(prev, shapeRef);
    });
  }

  useEffect(() => {
    if (layerRef && layerRef.current) {
      let context = layerRef.current.getContext();
      setContext(context);
    }
  }, [selectedElements]);

  // useEffect(() => {
  //   if (shapeRef && shapeRef.current) {
  //     shapeRef.current.cache();
  //   }
  // }, []);

  const addImageWhenPaste = (el, parentId) => {
    let copyElement = { ...el };

    if (copyElement.type === "Group") {
      let key = props.generateKey();
      copyElement.key = key;
      copyElement.id = key;

      copyElement.childElements = copyElement.childElements.map(el => {
        let result = addImageWhenPaste(el, key);
        return result;
      });
    } else {
      let key = copyLayer.transperantRect ? `BACKGROUND_${parentId}` : props.generateKey();
      copyElement.key = key;
      copyElement.id = key;
      copyElement.parentId = parentId;
      if (copyElement.image) {
        const img = document.createElement('img');
        img.src = copyElement.image.src;
        copyElement.image = img;
      }
    }

    return copyElement;
  }

  const copyLayer = (paste = false) => {
    setCopyElement(selectedElements);
    if (paste) {
      pasteLayer(selectedElements);
    }
  }

  const pasteLayer = (copyElements = copyElement) => {
    let elements = [];
    if (selectedGroupId) {
      elements = props.layer.filter(l => selectedGroupId === l.id);
    }

    if (elements.length <= 0) {
      elements = props.layer.filter(l => copyElements.indexOf(l.id) > -1);
    }

    let clonedElements = cloneDeep(elements);
    let cloneLayer = [...props.layer];
    clonedElements.forEach(el => {
      if (el.type === 'Group' && el.groupState === GROUP_STATE.TEMPORARY) {
        el.childElements.forEach(childEl => {
          if (!childEl.transperantRect) {
            let returnElement = addImageWhenPaste(childEl);
            returnElement.x = el.x + returnElement.x;
            returnElement.y = el.y + returnElement.y;
            returnElement.isChildren = false;
            cloneLayer.push(returnElement);
          }
        })
      } else {
        let returnElement = addImageWhenPaste(el);
        cloneLayer.push(returnElement);
      }
    });
    props.handleLayerChange(cloneLayer);
  }

  const copyAndPasteLayer = () => {
    copyLayer(true);
  }

  const handleResize = (style, isShiftKey, type) => {
    // type is a string and it shows which resize-handler you clicked
    // e.g. if you clicked top-right handler, then type is 'tr'
    let {width, height} = style;
    width /= zoomLevel;
    height /= zoomLevel;
    width += (width - props.stageWidth);
    height += (height - props.stageHeight);

    if (width > containerOffset.width - 2 * containerOffset.minHorizontalPadding) {
      width = containerOffset.width - 2 * containerOffset.minHorizontalPadding;
    }

    if (height > containerOffset.height - 2 * containerOffset.minVerticalPadding) {
      height = containerOffset.height - 2 * containerOffset.minVerticalPadding;
    }

    if (width < 2 * containerOffset.minHorizontalPadding) {
      width = 2 * containerOffset.minHorizontalPadding;
    }

    if (height < 2 * containerOffset.minVerticalPadding) {
      height = 2 * containerOffset.minVerticalPadding;
    }

    (type === 'l' || type === 'r') ? setResizeWidth(width * zoomLevel) : setResizeHeight(height * zoomLevel);
  }

  const handleResizeEnd = () => {
    props.setStageWidth(resizeWidth);
    props.setStageHeight(resizeHeight);
  }

  const getLockPosition = (axis) => {
    if (!shapeRef || !shapeRef.current) return 0;
    let left = shapeRef.current.attrs.x - 11;
    let top = shapeRef.current.attrs.y - 11;
    const offsetX = shapeRef.current.attrs.width / 2;
    const offsetY = shapeRef.current.attrs.height / 2;
    const angle = (-shapeRef.current.attrs.rotation * Math.PI / 180) || 0;
    left = left + offsetX * Math.cos(angle) + offsetY * Math.sin(angle);
    top = top - offsetX * Math.sin(angle) + offsetY * Math.cos(angle);
    if (axis === 'x') return left;
    if (axis === 'y') return top;
    return 0;
  }

  useEffect(() => {
    const eventCallback = (e) => {
      if (e.keyCode === 86 && (e.ctrlKey || e.metaKey) && copyElement.length > 0) {
        pasteLayer();
      }
      if (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) {
        copyLayer();
      }
    }
    document.addEventListener('keydown', eventCallback);
    return () => {
      document.removeEventListener('keydown', eventCallback);
    }
  }, [selectedElements, copyElement]);

  const resizeHandler = () => {
    let details = getOffsetWidthAndHeight('#editable-div', props.stageWidth, props.stageHeight);
    setContainerOffset(details);
  }

  useEffect(() => {
    resizeHandler();    
    // window.addEventListener('resize', resizeHandler);
    // return () => {
    //   window.removeEventListener('resize', resizeHandler);
    // } 
  }, []);

  return (
    <div className={'editable-div-wrapper ' + (props.selectedElement ? 'editable-div-wrapper-shrink' : 'editable-div-wrapper-expand')}>
      <EditOptions
        layer={props.layer}
        onChange={(layer) => props.handleLayerChange(layer)}
        handleAddElement={(element) => props.handleAddElement(element)}
        shapeRef={shapeRef}
        selectedId={selectedId}
        stageRef={stageRef}
        containerOffset={containerOffset}
        unGroupPermanentGroup={unGroupPermanentGroup}
        makeGroupPermanent={makeGroupPermanent}
        unGroupTempGroup={unGroupTempGroup}
        selectedGroupId={selectedGroupId}
        context={context}
        textEditMode={textEditMode}
        copyAndPasteLayer={copyAndPasteLayer}
        handleElementClick={props.handleElementClick}
        zoomLevel={zoomLevel}
        selectedElements={selectedElements}
        setChartData={props.setChartData}
        onCropStart={props.handleCropStart}
        onCropSave={props.handleCropSave}
        onCropCancel={props.handleCropCancel}
        cropIndex = {props.cropIndex}
        groupIndex = {props.groupIndex}
        isCroped = {props.isCroped}
        setIsCroped = {props.setIsCroped}
        onDeselect={() => handleDeselect()}
      />
      <div className="editable-div" id="editable-div">
        <div id="stage-container" className="stage-container" width={props.stageWidth} height={props.stageHeight}>
        { 
          shapeRef && shapeRef.current && shapeRef.current.attrs.locked &&
          <FontAwesomeIcon icon={faLock} size={"1x"} style={{
            position: 'absolute',
            left: getLockPosition('x'),
            top: getLockPosition('y'),
            width: 12,
            transform: `rotate(${shapeRef.current.attrs.rotation || 0}deg)`,
            display: 'block',
            zIndex: 10000,
            background: '#fff',
            border: 'solid #d8d8d8 1px',
            borderRadius: 24,
            padding: '4px 6px'}}
          />
        }
        {
          // !props.cropIndex &&
          <Stage
            ref={stageRef}
            width={Math.max(260 * zoomLevel, 2000)}
            height={Math.max(420 * zoomLevel, 1200)}
            onMouseMove={e => {
              onMouseMove(e, containerOffset);
            }}
            style={{
              background: props.backgroundColor,
            }}
            onMouseUp={e => {
              let selectedNodes = onMouseUp(e);
              if (selectedNodes && selectedNodes.length) {
                setSelectedElements(selectedNodes);
                if (selectedNodes && selectedNodes.length === 1) {
                  selectShape(selectedNodes[0]);
                } else {
                  createTemporaryGroup(selectedNodes);
                }
              }
            }}
            onMouseDown={e => {
              // deselect when clicked on empty area
              const clickedOnEmpty = e.target === e.target.getStage()
                || e.target.getAttr('subType') === ELEMENT_SUB_TYPE.CUSTOM_SHAPE;
              if (clickedOnEmpty && !props.cropIndex) {
                handleDeselect();
                onMouseDown(e, stageRef);
              }
            }}
          > 
            <Layer ref={layerRef}
              //   clipFunc={function (ctx) {
              //    ctx.rect(0, 100, 1660, 542);
              //    ctx.stroke();
              //    ctx.clip();
              //  }} 
              onDragEnd={() => {
                let layer = layerRef && layerRef.current ? layerRef.current : null;
                onObjectSnappingEnd(layer);
              }}
              onDragMove={(e) => {
                let layer = layerRef && layerRef.current ? layerRef.current : null;
                onObjectSnapping(e.target, layer, false, false, containerOffset, zoomLevel)
              }}>
              {props.layer.map((element, i) => {
                return (
                  ((!props.groupIndex && props.cropIndex !== i) || props.groupIndex || !(onLoadedCropImage && onLoadedCropperImage)) &&
                  getElement(i, element)
                );
              })}
              <CustomShape containerOffset={containerOffset} />
            </Layer>
          </Stage>
        }
        {
          props.cropIndex !== null &&
          // (props.cropIndex !== null || shapeRef && shapeRef.current) &&
          <NewCropImage
            cropIndex = {props.cropIndex}
            groupIndex = {props.groupIndex}
            layer = {props.layer}
            zoomLevel={zoomLevel}
            containerOffset={containerOffset}
            onCropSave={props.handleCropSave}
            isCroped = {props.isCroped}
            setIsCroped = {props.setIsCroped}
            onLoadedCropperImage={onLoadedCropperImage}
            onLoadedCropImage={onLoadedCropImage}
            setOnLoadedCropperImage={setOnLoadedCropperImage}
            setOnLoadedCropImage={setOnLoadedCropImage}
            temporalCropIndex = {shapeRef && shapeRef.current ? shapeRef.current.attrs.id : 0}
          />
        }
        {
          onResize &&
          <ResizableRect
            left={Math.max((containerOffset.width - resizeWidth * zoomLevel) / 2, containerOffset.minHorizontalPadding)}
            top={Math.max((containerOffset.height - resizeHeight * zoomLevel) / 2, containerOffset.minVerticalPadding)}
            width={resizeWidth * zoomLevel}
            height={resizeHeight * zoomLevel}
            position='absolute'
            display='block'
            aspectRatio={false}
            zoomable='e, w, n, s'
            onResize={handleResize}
            onResizeEnd={handleResizeEnd}
            zoomLevel={zoomLevel}
          ></ResizableRect>
        }``
        </div>
      </div>
      <Footer containerOffset={containerOffset} stageRef={stageRef} shapeRef={shapeRef} setZoomLevel={setZoomLevel} zoomLevel={zoomLevel} {...props}></Footer>
    </div >
  )
}

export default EditableDiv;