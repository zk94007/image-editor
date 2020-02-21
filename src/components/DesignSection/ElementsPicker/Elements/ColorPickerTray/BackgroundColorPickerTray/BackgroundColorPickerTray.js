// import React, { useEffect } from 'react';
import React from 'react';
import ColorPickerTray from '../ColorPickerTray';

export default function BackgroundColorPickerTray(props) {
  const changeColor = (color) => {
    // props.setBackgroundColor(color);
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
