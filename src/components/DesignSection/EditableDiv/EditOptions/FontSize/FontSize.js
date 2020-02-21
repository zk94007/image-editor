import React from 'react';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';

import './FontSize.scss';
import { getParent, findElementWithStyle, getQuillContainer, createAndDispatchEvent } from '../../../../../utilities/EditableDivUtil';
import { FONT_TYPE } from '../Utils/OptionsUtils';
// import { initFontSizeForChart } from './FontSizeUtils';
import { getChartFontSize, updateCanvasChart } from '../../../../shared/chart/ChartUtils';

export default function FontSize(props) {
  const [fontSize, setFontSize] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const fontSizeList = [6, 8, 10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 48, 56, 64, 72, 80, 88, 96, 104, 120, 144];

  function handleChange(event) {
    let { shapeRef, fontType, onChange, layer, selectedId } = props;
    if (fontType === FONT_TYPE.TEXT_FONT) {
      let quill = getQuillContainer();
      if (quill) {
        quill.format('size', event.target.value + 'px');
      }
      setFontSize(event.target.value);
      setTimeout(() => {
        createAndDispatchEvent({ shouldCreate: true }, 'removeTempEditor');
      }, 0)
    } else if (fontType === FONT_TYPE.CHART_FONT) {
      if (shapeRef && shapeRef.current) {
        let data = shapeRef.current.getAttr('data');
        if (data.fontSize === event.target.value + 'px') {
          return;
        }

        updateCanvasChart(layer, selectedId, 'fontSize', event.target.value + 'px', null, (copyLayers, err) => {
          if (!err) {
            onChange(copyLayers);
          }
        })
      }
    }
  }

  function handleClose() {
    setOpen(false);
  }

  function handleOpen() {
    setOpen(true);
  }

  const addListeners = (editableDiv) => {
    editableDiv.addEventListener('click', initFontSizeForText);
    editableDiv.addEventListener('keyup', initFontSizeForText);
    editableDiv.addEventListener('touchstart', initFontSizeForText);
  }

  const removeListeners = (editableDiv) => {
    editableDiv.removeEventListener('click', initFontSizeForText);
    editableDiv.removeEventListener('keyup', initFontSizeForText);
    editableDiv.removeEventListener('touchstart', initFontSizeForText);
  }

  React.useEffect(() => {
    if (props.fontType === FONT_TYPE.TEXT_FONT) {
      let editableDiv = document.getElementById('contenteditable');
      initFontSizeForText();
      if (editableDiv) {
        addListeners(editableDiv);
      }

      return () => {
        if (editableDiv) {
          removeListeners(editableDiv);
        }
      }
    }
  }, [props.fontType]);

  React.useEffect(() => {
    if (props.fontType === FONT_TYPE.CHART_FONT) {
      initFontSizeForChart();
    }
  }, [props.shapeRef, props.fontType, props.layer])

  const initFontSizeForText = () => {
    let element = findElementWithStyle(getParent(), 'fontSize');
    if (element) {
      setFontSize(parseFloat(element.style.fontSize));
    }
  }

  const initFontSizeForChart = () => {
    let { shapeRef } = props;
    setFontSize(getChartFontSize(shapeRef));
  }

  return (
    <FormControl id="font-size" className='form-control font-size'>
      <Select
        id={'font-size'}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        value={fontSize}
        renderValue={
          (value) => {
            return parseInt(value);
          }
        }
        onChange={handleChange}
        inputProps={{
          name: 'font-size',
          id: 'open-select',
        }}
      >
        {
          fontSizeList.map((fontSize, i) => {
            return <MenuItem key={i} value={fontSize}>{fontSize}</MenuItem>
          })
        }
      </Select>
    </FormControl>
  );
}
