// import React, { useEffect } from 'react';
import React from 'react';
import ColorPickerTray from '../ColorPickerTray';
import { updateCanvasChart } from '../../../../../shared/chart/ChartUtils';

export default function ChartColorPickerTray(props) {
  const changeColor = (color) => {
    let { layer, selectedId, shapeRef, trayState } = props;
    if (shapeRef && shapeRef.current) {
      let data = shapeRef.current.getAttr('data');
      let colors = { ...data.colors, [trayState.column]: color };

      updateCanvasChart(layer, selectedId, 'colors', colors, null, (copyLayers, err) => {
        if (!err) {
          props.setLayer(copyLayers);
        }
      })
    }
  }

  const getInitialColor = () => {
    if (props.trayState) {
      return props.trayState.color;
    }

    return null;
  }
  return (
    <div>
      <ColorPickerTray changeColor={changeColor} initialColor={getInitialColor()}></ColorPickerTray>
    </div>
  )
}
