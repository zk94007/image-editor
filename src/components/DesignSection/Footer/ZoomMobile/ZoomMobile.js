import React from 'react';
import './ZoomMobile.scss';
import zoomInSvg from '../../../../assets/img/zoom-in.svg';
import zoomOutSvg from '../../../../assets/img/zoom-out.svg';

export default function ZoomMobile(props) {
    const [zoom, setZoom] = React.useState(false);
    const { shapeRef } = props;

    function getSvg() {
        return zoom ? zoomOutSvg : zoomInSvg;
    }

    function onZoomChange() {
        if (zoom) {
        } else {
            shapeRef.current.scaleX(1.5);
            shapeRef.current.scaleY(1.5);
            shapeRef.current.draw();
        }
        setZoom(prev => !prev);
    }

    return (
        <button class="zoom-mobile" onClick={onZoomChange}>
            <img src={getSvg()} alt="zoom"></img>
        </button>
    )
}
