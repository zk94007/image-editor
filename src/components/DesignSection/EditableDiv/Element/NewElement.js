import React from 'react';
import { Transformer } from 'react-konva';
import { ELEMENT_TRAY_TYPE } from '../../ElementsPicker/ElementsPicker';
import { GROUP_STATE } from '../EditableDiv';
import './NewElement.scss';
import { editTextOnClick } from './ElementUtil';
import { createAndDispatchEvent } from '../../../../utilities/EditableDivUtil';
import { createTransperantRect } from '../GroupElements';
// import { STROKE_COLOR } from '../../shapesConfig';
import { onObjectSnapping, onObjectSnappingEnd } from '../../../../utilities/ObjectSnappingUtil';
import { createTempRect, removeTempRect, setTempRectPosition } from '../MouseSelection';
import { updateChartFontSize, updateChartScale, getChartImage } from '../../../shared/chart/ChartUtils';
import { CHART_TYPE } from '../../../shared/chart/ChartEnums';
// import { positions } from '@material-ui/system';

class Element extends React.Component {
  state = {
    dragging: false
  }
  constructor(props) {
    super(props);
    this.shapeRef = React.createRef();
    this.trRef = React.createRef();
  }

  createBackgroundForGroup() {
    if (this.shapeRef.current.getType() === 'Group') {
      let shapeCurrent = this.shapeRef.current;
      if (shapeCurrent.getChildren()[0].getId() !== `BACKGROUND_${shapeCurrent.getId()}`) {
        let shapeProps = { ...this.props.shapeProps };
        let copyChildren = [...shapeProps.childElements];

        let rect = createTransperantRect(this.shapeRef, shapeCurrent.getId());
        copyChildren.splice(0, 0, rect);
        shapeProps.childElements = copyChildren;
        this.props.onChange(shapeProps);
      }
    }
  }

  componentDidMount() {
    this.setTransformRef();
    this.createBackgroundForGroup();
  }

  componentDidUpdate() {
    if (this.props.isSelected) {
      this.props.setShapeRef(this.shapeRef);
    }

    this.setTransformRef();
    this.createBackgroundForGroup();
  }

  canTransform() {
    let { isSelected, shapeProps, selectedGroupId } = this.props;
    let shapsCurrent = this.shapeRef.current;
    let parent = shapsCurrent ? shapsCurrent.getParent() : null;
    shapeProps = shapeProps || {};

    return isSelected || this.state.dragging || (selectedGroupId === shapeProps.id
      || ((!parent || parent.attrs.groupState === GROUP_STATE.TEMPORARY)
        && shapeProps.parentId === selectedGroupId && !shapeProps.transperantRect))
  }

  setTransformRef = () => {
    if (this.canTransform()) {
      // we need to attach transformer manually
      if (this.trRef && this.trRef.current) {
        this.trRef.current.setNode(this.shapeRef.current);
        this.trRef.current.moveToTop();
        this.trRef.current.getLayer().batchDraw();
      }
    }
  }

  isElementSelected = () => {
    let { selectedElements } = this.props;
    let isSelected;
    if (this.shapeRef && this.shapeRef.current) {
      isSelected = !!selectedElements.find((el) => el === this.shapeRef.current.attrs.id);
    }
    return isSelected;
  }

  selectedForGroup = () => {
    let { selectedElements } = this.props;
    return this.isElementSelected() && selectedElements.length > 1;
  }

  getTransformer = () => {
    let { shapeProps } = this.props;

    const getEnabledAnchors = () => {
      if (shapeProps.locked || shapeProps.isChildren || this.state.dragging) {
        return [];
      } else if (this.shapeRef.current && (
        this.shapeRef.current.attrs.type === 'Group' ||
        this.shapeRef.current.attrs.subType === 'IMAGE' || 
        this.shapeRef.current.attrs.subType === 'DRAG_IMAGE' || 
        this.shapeRef.current.getAttr('chartType') === CHART_TYPE.PIE_CHART || 
        this.shapeRef.current.getAttr('chartType') === CHART_TYPE.DONUT_CHART)) {
        return ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
      }
      else if (this.shapeRef.current && this.shapeRef.current.attrs.elementType === ELEMENT_TRAY_TYPE.TEXT) {
        return ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right'];
      } else {
        return null;
      }
    };

    const getProperties = () => {
      return {
        rotateEnabled: !shapeProps.locked && !shapeProps.isChildren && !this.state.dragging,
        borderStrokeWidth: shapeProps.locked ? 2 : null,
        enabledAnchors: getEnabledAnchors(),
        anchorSize: 10,
        anchorCornerRadius: 0,
        anchorStrokeWidth: 1,
        boundBoxFunc: (oldBoundBox, newBoundBox) => {
          // if (Math.abs(newBoundBox.width) <= 50) {
          //   return oldBoundBox;
          // }
          let snapping = this.shapeRef.current.getAttr('snapping');
          if (this.shapeRef && snapping) {
            if (snapping.orientation === 'V') {
              if (Math.abs(oldBoundBox.width - newBoundBox.width) >= 5) {
                return newBoundBox;
              }
            } else {
              if (Math.abs(oldBoundBox.height - newBoundBox.height) >= 5) {
                return newBoundBox;
              }
            }
            return oldBoundBox;
          }
          return newBoundBox;
        },
        borderDash: shapeProps.type === 'Group'
          && (shapeProps.groupState === GROUP_STATE.TEMPORARY
            || (this.props.selectedId && this.props.selectedId !== this.props.selectedGroupId)) ? [3, 3] : []
      }
    }
    return (
      this.canTransform() && <Transformer type="Transformer" ref={this.trRef} {...getProperties()} />
    );
  }

  editText() {
    let { isSelected, shapeProps } = this.props;
    if (!shapeProps.locked && this.shapeRef.current.attrs.elementType === ELEMENT_TRAY_TYPE.TEXT) {
      if (isSelected) {
        if (!this.disabled) {
          createAndDispatchEvent({}, 'removeTempEditor');
          setTimeout(() => {
            editTextOnClick(this.props, this.trRef, this.shapeRef);
          }, 0)
        }
      } else {
        this.createEditorOnSelect();
      }
    }
  }

  selectMultipleNodes = (shapeAttrs) => {
    let { selectedElements, setSelectedElements, createTemporaryGroup } = this.props;
    createAndDispatchEvent({}, 'removeTempEditor');
    if (selectedElements.length <= 0
      || shapeAttrs.locked
      || shapeAttrs.isChildren
      || shapeAttrs.groupState === GROUP_STATE.TEMPORARY) {
      return;
    }

    if (!this.isElementSelected()) {
      let elements = [...selectedElements];
      elements.push(shapeAttrs.id);
      setSelectedElements(elements);
      createTemporaryGroup(elements);
    }
  }

  selectSingleNode = (shapeAttrs) => {
    let { setSelectedElements, onSelect, setGroupId } = this.props;
    let elements = [];

    if (shapeAttrs.type !== 'Group') {
      if (!shapeAttrs.transperantRect) {
        onSelect(shapeAttrs.id);
        elements.push(shapeAttrs.id);
      } else {
        elements.push(shapeAttrs.parentId);
        onSelect(shapeAttrs.parentId);
      }
      setGroupId(null);
    } else {
      elements.push(shapeAttrs.id);
      setGroupId(shapeAttrs.id);
    }

    setSelectedElements(elements);
  }

  onClick = (event) => {
    if (!(this.shapeRef && this.shapeRef.current)) return;

    let shapeAttrs = this.shapeRef.current.attrs;
    this.editText();
    if (event && event.evt && event.evt.shiftKey) {
      this.selectMultipleNodes(shapeAttrs)
    } else {
      this.selectSingleNode(shapeAttrs);
    }
  }

  createEditorOnSelect = () => {
    let { shapeProps } = this.props;
    createAndDispatchEvent({}, 'removeTempEditor');
    setTimeout(() => {
      if (!shapeProps.locked && this.shapeRef.current && this.shapeRef.current.attrs.elementType === ELEMENT_TRAY_TYPE.TEXT) {
        return editTextOnClick(this.props, this.trRef, this.shapeRef, 1, 1, null, true);
      }
    }, 0)

  }

  updateCoordinatesOnTransformEnd(shapeProps, scaleX, scaleY) {
    let updatedProps = { ...shapeProps };
    if (shapeProps.type === 'Group') {
      let copyChildElements = [...updatedProps.childElements];
      for (let i = 0; i < copyChildElements.length; i++) {
        let child = { ...copyChildElements[i] };
        if (child.type === 'Group') {
          child.x = child.x * scaleX;
          child.y = child.y * scaleY
          child = this.updateCoordinatesOnTransformEnd(child, scaleX, scaleY);
        } else {
          child = {
            ...child,
            x: child.x * scaleX,
            y: child.y * scaleY,
          }
          if (child.type !== 'Circle') {
            child.width = child.width * scaleX;
            child.height = child.height * scaleY;
            child.offsetX = child.offsetX ? child.offsetX * scaleX : child.offsetX;
            child.offsetY = child.offsetX ? child.offsetY * scaleY : child.offsetX;
          } else {
            child.radius = child.radius * scaleX;
          }
        }
        copyChildElements[i] = child;
      }

      updatedProps.childElements = copyChildElements;
      return updatedProps;
    }

    return updatedProps;
  }

  transformEnd = (e) => {
    let { shapeProps } = this.props;
    // transformer is changing scale
    const node = this.shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    // we will reset it back
    let elementTypeIsText = node.attrs.elementType === ELEMENT_TRAY_TYPE.TEXT;
    if (elementTypeIsText && this.trRef.current.movingResizer !== 'rotater') {
      editTextOnClick(this.props, this.trRef, this.shapeRef, scaleX, scaleY, this.trRef.current.movingResizer);
    }
    node.scaleX(1);
    node.scaleY(1);

    let updatedProps = this.updateCoordinatesOnTransformEnd(shapeProps, scaleX, scaleY);

    let resizer = this.trRef.current.movingResizer;
    if (updatedProps.chartType) {
      if (resizer === 'middle-right' || resizer === 'middle-left' || resizer === 'bottom-center' || resizer === 'top-center') {
        updatedProps = updateChartScale(updatedProps, scaleX, scaleY);
        getChartImage(updatedProps.data, updatedProps.chartType, (image) => {
          updatedProps.image = image;
          this.updateLayerOnTransormEnd(elementTypeIsText, node, updatedProps, scaleX, scaleY);
        });
      } else {
        updatedProps = updateChartFontSize(updatedProps, scaleX);
        this.updateLayerOnTransormEnd(elementTypeIsText, node, updatedProps, scaleX, scaleY);
      }
    } else {
      this.updateLayerOnTransormEnd(elementTypeIsText, node, updatedProps, scaleX, scaleY);
    }
  }

  updateLayerOnTransormEnd = (elementTypeIsText, node, updatedProps, scaleX, scaleY) => {
    let { onChange } = this.props;
    const resizer = this.trRef.current.movingResizer;
    const elementTypeIsImage = this.shapeRef.current.attrs.subType === 'IMAGE' ? true : false;

    if ((!elementTypeIsText || resizer === 'rotater') && !elementTypeIsImage) {
      let offsetX = node.offsetX();
      let offsetY = node.offsetY();
      let changeProps = {
        ...updatedProps,
        x: node.x(),
        y: node.y(),
        width: node.width() * scaleX,
        height: node.height() * scaleY,
        offsetX: offsetX ? offsetX * scaleX : offsetX,
        offsetY: offsetY ? offsetY * scaleY : offsetY,
        rotation: node.rotation()
      };
      onChange(changeProps);
    }

    if ((!elementTypeIsText || resizer === 'rotater') && elementTypeIsImage) {
      // const scale = this.getImageScale(resizer, scaleX, scaleY);
      let offsetX = node.offsetX();
      let offsetY = node.offsetY();
      let changeProps = {
        ...updatedProps,
        x: node.x(),
        y: node.y(),
        width: node.width() * scaleX,
        height: node.height() * scaleY,
        offsetX: offsetX * scaleX,
        offsetY: offsetY * scaleY,
        rotation: node.rotation(),
      };
      onChange(changeProps);
    }
    
    if (this.shapeRef && this.shapeRef.current) {
      onObjectSnappingEnd(this.shapeRef.current.getLayer(), this.shapeRef.current);
    }
    this.createEditorOnSelect();
  }

  getImageScale = (resizer, scaleX, scaleY) => {
    let scale;
    if (resizer === 'middle-left' || resizer === 'middle-right') scale = Math.max(scaleX, 1);
    else if (resizer === 'top-center' || resizer === 'bottom-center') scale = Math.max(scaleY, 1);
    else scale = scaleX;
    return scale;
  }

  addTempRect = () => {
    if (this.shapeRef.current && !this.props.isSelected) {
      let shapeCurrent = this.shapeRef.current;
      if (shapeCurrent.attrs.parentId) {
        shapeCurrent = shapeCurrent.getParent();
      }
      if (shapeCurrent.getId() !== this.props.selectedGroupId) {
        createTempRect(shapeCurrent.getId(), shapeCurrent.getLayer(), shapeCurrent.getStage(), true);
        setTempRectPosition(shapeCurrent, shapeCurrent.getLayer(), shapeCurrent.getStage(), true);
        shapeCurrent.getStage().draw();
      }
    }
  }

  handleMouseEnter = (e) => {
    let { shapeProps, setHoverElementRef } = this.props;
    if (shapeProps.type === 'Image') {
      setHoverElementRef(this.shapeRef);
    }
    this.addTempRect();
  }

  deleteTempRect = () => {
    if (this.shapeRef.current) {
      let shapeCurrent = this.shapeRef.current;
      removeTempRect(shapeCurrent.getLayer(), true);
      shapeCurrent.getStage().draw();
    }
  }

  handleMouseOut = (e) => {
    this.props.setHoverElementRef(null);
    this.deleteTempRect();
  }

  createElement = () => {
    let { shapeProps, onChange, children, containerOffset } = this.props;

    return React.createElement(shapeProps.type, {
      onTap: (e) => {
        this.onClick(e);
      },
      key: shapeProps.id,
      ref: this.shapeRef,
      offsetX: shapeProps.offsetX,
      offsetY: shapeProps.offsetY,
      ...shapeProps,
      strokeEnabled: shapeProps.id === 'selectionRect' || this.isElementSelected(),
      draggable: !shapeProps.locked && !shapeProps.isChildren,
      onMouseOut: this.handleMouseOut,
      onMouseEnter: this.handleMouseEnter,
      onClick: (e) => {
        this.onClick(e);
      },
      onDragEnd: e => {
        let changedShapeProps = {
          ...shapeProps,
          x: e.target.x(),
          y: e.target.y()
        }
        this.addTempRect();
        onChange(changedShapeProps);
        this.setState({ dragging: false })
      },
      onTransform: (e) => {
        if (this.shapeRef && this.shapeRef.current) {
          let resizer = this.trRef.current.movingResizer;
          onObjectSnapping(e.currentTarget, this.shapeRef.current.getLayer(), true, resizer, containerOffset);
        }
      },
      onDragStart: e => {
        this.deleteTempRect();
        this.setState({ dragging: true })
      },
      onTransformEnd: this.transformEnd,
      onTransformStart: () => {
        createAndDispatchEvent({}, 'removeTempEditor')
      },
      opacity: shapeProps.opacity >= 0 ? shapeProps.opacity : 1
    }, children);
  }

  render() {
    return (
      <React.Fragment>
        {this.createElement()}
        {this.getTransformer()}
      </React.Fragment>
    );
  }
};

export default Element;