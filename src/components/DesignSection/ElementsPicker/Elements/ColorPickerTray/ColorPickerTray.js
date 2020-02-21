import React from 'react';
import './ColorPickerTray.scss';
import ColorPicker from './ColorPicker/ColorPicker';
// import { getQuillContainer, getClosestParent, createAndDispatchEvent } from '../../../../../utilities/EditableDivUtil';

export default function ColorPickerTray(props) {
  const [color, setColor] = React.useState();
  const [selectedColors] = React.useState(['#000000', '#ffffff']);
  const defaultColors = [
    '#000000', '#D14628', '#DB2727', '#32DB27', '#117A0A', '#0C0A7A',
    '#7A720A', '#7A0A4A', '#7A0A29', '#6EA456', '#A45693'
  ];

  React.useEffect(() => {
    setColor(props.initialColor);
  }, [props.initialColor])

  const changeColor = (color) => {
    setColor(color);
    props.changeColor(color);
  }
  return (
    <div className="color-container" id="color-container">
      <div className="color-picker">
        <ColorPicker color={color} setColor={setColor} changeColor={changeColor}></ColorPicker>
        {
          selectedColors.map((color, index) => {
            return <button className="colorButton" key={index} onClick={() => { changeColor(color) }} style={{ backgroundColor: color }}></button>
          })
        }
      </div>
      <div className="default-color">
        <div className="default-color-label">Default Color</div>
        <div>
          {
            defaultColors.map((color, index) => {
              return <button className="colorButton" key={index} onClick={() => { changeColor(color) }} style={{ backgroundColor: color }}></button>
            })
          }
        </div>
      </div>
    </div >
  )
}
