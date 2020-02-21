import React from 'react';
import ResizableRect from './ResizableRect';
import './index.scss';

function getRotatedPosition(cx, cy, x, y, rotateAngle) {
  const radian = rotateAngle / 180 * Math.PI;
  return {
    x: ((cx - x) * Math.cos(radian) + (cy - y) * Math.sin(radian)) + x,
    y: y - ((cx - x) * Math.sin(radian) + (y - cy) * Math.cos(radian)),
  }
}

// function getRotatedCropPosition(cx, cy, x0, y0, rotateAngle) {
//   const rad = rotateAngle / 180 * Math.PI;
//   return {
//     x: cx * Math.cos(rad) + cy * Math.sin(rad) + x0,
//     y: -cx * Math.sin(rad) + cy * Math.cos(rad) + y0,
//   }
// }

// function getGroupRotatedPosition(x1, y1, angle) {
//   const radian = angle / 180 * Math.PI;
//   return {
//     x:  Math.sqrt(x1 * x1 + y1 * y1) * Math.cos(Math.atan(y1 / x1) + radian) - x1,
//     y: Math.sqrt(x1 * x1 + y1 * y1) * Math.sin(Math.atan(y1 / x1) + radian) - y1,
//   }
// }

function getRotationCenter(cx, cy, cw, ch, w, h, bl, bt, r) {
  const sR = Math.sin(r / 180 * Math.PI);
  const cR = Math.cos(r / 180 * Math.PI);
  return {
    x: (bl - cx * cR - cy * sR + cw / 2 - w / 2) * (-cR) - (bt + cx * sR - cy * cR + ch / 2 - h / 2) * (-sR),
    y: (-cR) * (bt + cx * sR - cy * cR + ch / 2 - h / 2) - (sR) * (bl - cx * cR - cy * sR + cw / 2 - w / 2)
  }
}

class NewCropImage extends React.Component {
  constructor(props) {
    super(props);
    const currentLayer = this.getCurrentLayer();
    const cropper = currentLayer.cropper;
    if (cropper) {
      const newWidth = cropper.width / cropper.cw * currentLayer.width;
      const newHeight = cropper.height / cropper.ch * currentLayer.height;
  
      // Calc new rotation
      const newRotation = cropper.rotateAngle - (currentLayer.rotation || 0);
      const newCenter = getRotatedPosition(cropper.left + cropper.width / 2, cropper.top + cropper.height / 2,
        cropper.cx, cropper.cy, newRotation);
      let newLeft = newCenter.x - cropper.width / 2;
      let newTop = newCenter.y - cropper.height / 2;
      
      // Calc new resize
      newLeft = currentLayer.x - (cropper.cx - newLeft) / cropper.cw * currentLayer.width;
      newTop = currentLayer.y - (cropper.cy - newTop) / cropper.ch * currentLayer.height;
  
      this.state = {
        width: newWidth,
        height: newHeight,
        left: newLeft,
        top: newTop,
        cropX: currentLayer.x,
        cropY: currentLayer.y,
        cropWidth: currentLayer.width,
        cropHeight: currentLayer.height,
        rotateAngle: currentLayer.rotation > 0 ? currentLayer.rotation : currentLayer.rotation + 360 || 0,
        cropperFlag: false,
      }
    } else {
      this.state = {
        width: currentLayer.crop.width / currentLayer.image.naturalWidth * currentLayer.width,
        height: currentLayer.crop.height / currentLayer.image.naturalHeight * currentLayer.height,
        left: currentLayer.x - currentLayer.width / 2,
        top: currentLayer.y - currentLayer.height / 2,
        cropX: currentLayer.x,
        cropY: currentLayer.y,
        cropWidth: currentLayer.width,
        cropHeight: currentLayer.height,
        rotateAngle: currentLayer.rotation > 0 ? currentLayer.rotation : currentLayer.rotation + 360 || 0,
        cropperFlag: false,
      }
    }
    
    window.addEventListener('mousedown', this.handleOutsideClick);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleOutsideClick);
  }

  componentDidUpdate() {
    if (this.props.isCroped) {
      this.handleCropSave();
    }
  }

  getCurrentLayer = () => {
    const {layer, groupIndex, cropIndex, temporalCropIndex} = this.props;

    return groupIndex ? {
      ...layer[groupIndex].childElements[cropIndex],
      x: layer[groupIndex].x + layer[groupIndex].childElements[cropIndex].x,
      y: layer[groupIndex].y + layer[groupIndex].childElements[cropIndex].y,
      rotation: (layer[groupIndex].rotation || 0) + (layer[groupIndex].childElements[cropIndex].rotation || 0),
    } : layer[cropIndex ? cropIndex : temporalCropIndex];
  }

  handleCropSave = () => {
    const currentLayer = this.getCurrentLayer();
    const {left, top, width, height, rotateAngle, cropX, cropY, cropWidth, cropHeight} = this.state;
    const {x, y} = getRotatedPosition(cropX, cropY, left + width / 2, top + height / 2, rotateAngle);
    const borderTop = Math.max(y - top - cropHeight / 2, 0);
    const borderLeft = Math.max(x - left - cropWidth / 2, 0);
    const crop = {
      x: Math.max(borderLeft, 0) / width * currentLayer.image.naturalWidth,
      y: Math.max(borderTop, 0) / height * currentLayer.image.naturalHeight,
      width: cropWidth / width * currentLayer.image.naturalWidth,
      height: cropHeight / height * currentLayer.image.naturalHeight,
    };
    const cropper = {
      left: left,
      top: top,
      width: width,
      height: height,
      cx: cropX,
      cy: cropY,
      cw: cropWidth,
      ch: cropHeight,
      rotateAngle: rotateAngle,
    };
    this.props.onCropSave(crop, cropper);
  }

  handleOutsideClick = (e) => {
    let div = this.refs.divRef;
    if ((!div || !div.contains(e.target)) &&
      (!document.getElementById('edit-options') || !document.getElementById('edit-options').contains(e.target)) &&
      (!document.getElementById('board-resize') || !document.getElementById('board-resize').contains(e.target)) &&
      (!document.getElementById('zoom-popover') || !document.getElementById('zoom-popover').contains(e.target))) {
      window.removeEventListener('mousedown', this.handleOutsideClick);
      this.props.setIsCroped(true);
    }
  }

  changeResizeHandler = (handler, type, clientX, clientY) => {
    let parentResize = document.getElementsByClassName('single-resizer')[0];
    let childResize = document.getElementsByClassName('single-resizer')[1];
    let parentResizeHandler = parentResize.getElementsByClassName(`${type}`)[0];
    let childResizeHandler = childResize.getElementsByClassName(`${type}`)[0];
    let mouseEventFire = function (el, etype){
      if (el.fireEvent) {
        el.fireEvent('on' + etype);
      } else {
        var evObj = new MouseEvent(etype, {
          button: 0,
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: clientX,
          clientY: clientY,
        });
        el.dispatchEvent(evObj);
      }
    }
    mouseEventFire(handler === 'toParent' ? childResizeHandler : parentResizeHandler, 'mouseup');
    mouseEventFire(handler === 'toChild' ? childResizeHandler : parentResizeHandler, 'mousedown');
  };

  handleResizeCropper = (style, isShiftKey, type, clientX, clientY) => {
    // type is a string and it shows which resize-handler you clicked
    // e.g. if you clicked top-right handler, then type is 'tr'

    const { rotateAngle, cropX, cropY, cropWidth, cropHeight} = this.state;
    let { top, left, width, height } = style;
    const {x, y} = getRotatedPosition(cropX, cropY, left + width / 2, top + height / 2, rotateAngle);
    const newCenter = getRotationCenter(cropX, cropY, cropWidth, cropHeight,
      width, height, x - cropWidth / 2 - left, y - cropHeight / 2 - top, rotateAngle);

    left = newCenter.x - width / 2;
    top = newCenter.y - height / 2;
    let flagCheck = false;
    if (left > x - cropWidth / 2) {
      left = x - cropWidth / 2;
      width = this.state.left + this.state.width - left;
      if(type === 'tl' || type === 'bl') {
        flagCheck = true;
      }
    }
    if (top > y - cropHeight / 2) {
      top = y - cropHeight / 2;
      height = this.state.top + this.state.height - top;
      if(type === 'tl' || type === 'tr') {
        flagCheck = true;
      }    
    }
    if (left + width < x + cropWidth / 2) {
      width = x + cropWidth / 2 - left;
      if(type === 'tr' || type === 'br') {
        flagCheck = true;
      }
    }
    if (top + height < y + cropHeight / 2) {
      height = y + cropHeight / 2 - top;
      if(type === 'br' || type === 'bl') {
        flagCheck = true;
      }
    }
    if (!flagCheck) {
      this.setState({cropperFlag: false});
    }

    if (flagCheck) {
      if (this.state.cropperFlag === false) {
        this.setState({cropperFlag: true});
      } else {
        // let deltaX;
        // let deltaY;
        // if (type === 'tl') {
        //   deltaX = cropX - cropWidth / 2 - left - 2;
        //   deltaY = cropY - cropHeight / 2 - top - 2;
        //   this.setState({
        //     cropX: cropX - deltaX / 2,
        //     cropWidth: cropWidth + deltaX,
        //     cropY: cropY - deltaY / 2,
        //     cropHeight: cropHeight + deltaY,
        //   });
        // }
        // if (type === 'bl') {
        //   deltaX = cropX - cropWidth / 2 - left - 2;
        //   deltaY = top + height - cropY - cropHeight / 2 - 2;
        //   this.setState({
        //     cropX: cropX - deltaX / 2,
        //     cropWidth: cropWidth + deltaX,
        //     cropY: cropY + deltaY / 2,
        //     cropHeight: cropHeight + deltaY,
        //   });
        // }
        // if (type === 'tr') {
        //   deltaX = left + width - cropX - cropWidth / 2 - 2;
        //   deltaY = cropY - cropHeight / 2 - top - 2;
        //   this.setState({
        //     cropX: cropX + deltaX / 2,
        //     cropWidth: cropWidth + deltaX,
        //     cropY: cropY - deltaY / 2,
        //     cropHeight: cropHeight + deltaY,
        //   });
        // }
        // if (type === 'br') {
        //   deltaX = left + width - cropX - cropWidth / 2 - 2;
        //   deltaY = top + height - cropY - cropHeight / 2 - 2;
        //   this.setState({
        //     cropX: cropX + deltaX / 2,
        //     cropWidth: cropWidth + deltaX,
        //     cropY: cropY + deltaY / 2,
        //     cropHeight: cropHeight + deltaY,
        //   });
        // }
        this.changeResizeHandler('toChild', type, clientX, clientY);
      }
    }

    this.setState({
      top,
      left,
      width,
      height,
    });
  }

  handleResizeCrop = (style, isShiftKey, type, clientX, clientY) => {
    // type is a string and it shows which resize-handler you clicked
    // e.g. if you clicked top-right handler, then type is 'tr'
    
    const { left, top, width, height, rotateAngle } = this.state;
    let k = 0;

    if (style.left < 0) {
      style.width += style.left;
      style.left = 0;
      k++;
    }
    if (style.top < 0) {
      style.height += style.top;
      style.top = 0;
      k++;
    }
    if (width < style.left + style.width) {
      style.width = width - style.left;
      k++;
    }
    if (height <style.top + style.height) {
      style.height = height - style.top;
      k++;
    }

    let {x, y} = getRotatedPosition(left + style.left + style.width / 2, top + style.top + style.height / 2, 
      left + width / 2, top + height / 2, -rotateAngle);
   
    this.setState({
      cropX: x,
      cropY: y,
      cropWidth: style.width,
      cropHeight: style.height,
    });

    if (k === 2) {
      this.changeResizeHandler('toParent', type, clientX, clientY);
    }
  }

  handleResizeEnd = () => {
    this.setState({cropperFlag: false});
  }

  handleDrag = (deltaX, deltaY) => {
    const { zoomLevel } = this.props;
    let {left, top, width, height, rotateAngle, cropX, cropY, cropWidth, cropHeight} = this.state;

    left += deltaX / zoomLevel;
    top += deltaY / zoomLevel;
    
    const {x, y} = getRotatedPosition(cropX, cropY, left + width / 2, top + height / 2, rotateAngle);
    const maxLeft = x - cropWidth / 2;
    const minLeft = x + cropWidth / 2 - width;
    const maxTop = y - cropHeight / 2;
    const minTop = y + cropHeight / 2 - height;
    left = Math.max(Math.min(left, maxLeft), minLeft);
    top = Math.max(Math.min(top, maxTop), minTop);
    
    const newCenter = getRotationCenter(cropX, cropY, cropWidth, cropHeight,
      width, height, x - cropWidth / 2 - left, y - cropHeight / 2 - top, rotateAngle);
    
    left = newCenter.x - width / 2;
    top = newCenter.y - height / 2;

    this.setState({
      left: left,
      top: top
    });
  }

  render() {
    if (this.props.rotate) {
      this.props.setIsCroped(true);
    }
    const {left, top, width, height, rotateAngle, cropX, cropY, cropWidth, cropHeight} = this.state;
    const { zoomLevel } = this.props;
    // const groupRotation = (groupIndex > 0) ? ((layer[groupIndex].rotation) ? layer[groupIndex].rotation : 0) : 0;
    const currentLayer = this.getCurrentLayer();
    const {x, y} = getRotatedPosition(cropX, cropY, left + width / 2, top + height / 2, rotateAngle);
    // const group = (groupIndex > 0) ? getGroupRotatedPosition(x - layer[groupIndex].x, y - layer[groupIndex].y, groupRotation) : {x: 0, y: 0};
    const divTop = Math.max(y - top - cropHeight / 2, 0);
    const divLeft = Math.max(x - left - cropWidth / 2, 0);

    const cropperRadius = 3000;

    let { verticalPadding, horizontalPadding, rectWidth, rectHeight, minVerticalPadding, minHorizontalPadding } = this.props.containerOffset;

    let calHorizonalPadding = horizontalPadding * zoomLevel;
    let calVerticalPadding = verticalPadding * zoomLevel;
    let cx = ((this.props.containerOffset.width - rectWidth * zoomLevel) / 2) - calHorizonalPadding;
    let cy = ((this.props.containerOffset.height - rectHeight * zoomLevel) / 2) - calVerticalPadding;

    cx = Math.max(cx, minHorizontalPadding - calHorizonalPadding);
    cy = Math.max(cy, minVerticalPadding - calVerticalPadding);

    return <div className="cropper" ref="divRef" style={{
      left: `${cx / zoomLevel}px `,
      top: `${cy / zoomLevel}px`,
      zoom: `${zoomLevel}`,
      position: "absolute",
      display: `${this.props.setOnLoadedCropImage && this.props.setOnLoadedCropperImage ? 'block' : 'none'}`,
    }}>
      <ResizableRect
        left={left}
        top={top}
        width={width}
        height={height}
        rotateAngle={rotateAngle}
        aspectRatio={true}
        zoomable='nw, ne, se, sw'
        onResize={this.handleResizeCropper}
        onResizeEnd={this.handleResizeEnd}
        onDrag={this.handleDrag}
        zoomLevel={zoomLevel}
      >
        <img className="back-image" src={currentLayer.image.src} onLoad={this.props.setOnLoadedCropperImage(true)} alt="back" />
        <ResizableRect
          left={divLeft}
          top={divTop}
          width={cropWidth}
          height={cropHeight}
          parentRotateAngle={rotateAngle}
          position='relative'
          display='block'
          aspectRatio={false}
          zoomable='nw, ne, se, sw'
          onResize={this.handleResizeCrop}
          onResizeEnd={this.handleResizeEnd}
          onDrag={this.handleDrag}
          zoomLevel={zoomLevel}
        >
          <div className="front-image-wrapper" style={{
            position: 'relative',
            overflow: 'hidden',
            left: `${0}px`,
            top: `${0}px`,
            width: `${cropWidth}px`,
            height: `${cropHeight}px`,
            display: 'block',
          }}>
            <img className="front-image" src={currentLayer.image.src} onLoad={this.props.setOnLoadedCropImage(true)} alt="front" 
              style={{
                left: `${-divLeft}px`,
                top: `${-divTop}px`,
                width: `${width}px`,
                height: `${height}px`,
                display: 'block',
              }}
            />
            {/* <div className="borderRect" 
              style={{
                left: `${-divLeft}px`,
                top: `${-divTop}px`,
                width: `${cropWidth - 2 / zoomLevel}px`,
                height: `${cropHeight - 2 / zoomLevel}px`,
                display: 'block',
                border: `${1 / zoomLevel}px solid #14a7fd`,
                outline: `${1 / zoomLevel}px solid #14a7fd`,
                zIndex: 5
              }}>
            </div> */}
          </div>
        </ResizableRect>
      </ResizableRect>
      <div className="cropper-layer" style={{
        transform: `rotate(${rotateAngle}deg)`,
        left: cropX - cropperRadius,
        top: cropY - cropperRadius,
        width: cropperRadius * 2,
        height: cropperRadius * 2,
        borderTop: `${cropperRadius - cropHeight / 2}px solid rgba(255, 255, 255, 0.2)`,
        borderBottom: `${cropperRadius - cropHeight / 2}px solid rgba(255, 255, 255, 0.2)`,
        borderRight: `${cropperRadius - cropWidth / 2}px solid rgba(255, 255, 255, 0.2)`,
        borderLeft: `${cropperRadius - cropWidth / 2}px solid rgba(255, 255, 255, 0.2)`,
      }
      }></div>
    </div>
  }
}

export default NewCropImage;
