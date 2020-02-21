import React from 'react'
import { getQuillContainer, getClosestParent, createAndDispatchEvent } from '../../../../../utilities/EditableDivUtil';
import ColorPickerTray from '../ColorPickerTray/ColorPickerTray';

export default function TextColorPickerTray() {
  const addColorToParent = (color, range) => {
    let quill = getQuillContainer();

    if (quill && range) {
      let selectedText = quill.getText(range.index, range.length);

      if (selectedText && selectedText !== quill.getText()) {
        let parent = getClosestParent('li, p');
        if (parent) {
          if (parent.innerText === selectedText) {
            quill.format('listcolor', color);
          }
        }
      } else {
        quill.format('listcolor', color);
      }
    }
  }
  const changeColor = (color) => {
    let quill = getQuillContainer();
    if (quill) {
      var range = quill.getSelection();
      console.log(range);
      if (range && range.length) {
        quill.format('color', color);
        if (quill.getLine(range.index).length === range.length) {
          quill.register('listcolor', color);
        }
      } else {
        quill.formatText(0, quill.getText().length, 'color', color);
        quill.formatText(0, quill.getText().length, 'listcolor', color);
      }
      addColorToParent(color, range);
      setTimeout(() => {
        createAndDispatchEvent({ shouldCreate: true }, 'removeTempEditor');
      }, 0)
    }
  }
  return (
    <ColorPickerTray changeColor={changeColor}></ColorPickerTray>
  )
}
