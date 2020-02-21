import React from 'react';
import { getLock, getTransparency, getDelete, getPosition, getCopyLayer, OPTION_POSITION, getFontSize, FONT_TYPE } from "./OptionsUtils";
import { EDIT_OPTIONS } from "./Options.enum";
import { Button } from '@material-ui/core';
import { ELEMENT_TRAY_TYPE } from '../../../ElementsPicker/ElementsPicker';
import { CHART_TYPE } from '../../../../shared/chart/ChartEnums';
import { CHART_COLUMNS } from '../../../../shared/chart/ChartDataUtils';
import {
  faFont,
  faBold,
  faItalic,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { updateCanvasChart } from '../../../../shared/chart/ChartUtils';
import ColorPickerMobile from '../ColorPickerMobile/ColorPickerMobile';

const COLOR_TYPE = {
  BAR_COLOR: 'BAR_COLOR',
  FONT_COLOR: 'FONT_COLOR'
}

export const getChartOptions = (props, transparencyValue) => {
  if (!(props.shapeRef && props.shapeRef.current)) {
    return [];
  }
  let options = [
    getEditChart(props),
    getChartColorTray(props, CHART_COLUMNS.DATASET1, COLOR_TYPE.BAR_COLOR),
    getChartColorTray(props, CHART_COLUMNS.DATASET2, COLOR_TYPE.BAR_COLOR),
    getChartColorTray(props, CHART_COLUMNS.DATASET3, COLOR_TYPE.BAR_COLOR),
    getChartColorTray(props, CHART_COLUMNS.DATASET4, COLOR_TYPE.BAR_COLOR),
    getChartColorTray(props, CHART_COLUMNS.DATASET5, COLOR_TYPE.BAR_COLOR),
    getFontSize(FONT_TYPE.CHART_FONT, props),
    getChartColorTray(props, CHART_COLUMNS.LABEL, COLOR_TYPE.FONT_COLOR),
    getBold(props),
    getItalic(props),
    getCopyLayer(props),
    getPosition(props),
    getTransparency(props, transparencyValue),
    getLock(props),
    getDelete(props)
  ]
  options = options.filter(op => op);
  /* options.sort((prev, next) => {
    return prev.order - next.order;
  }) */
  return options;
}

export const getEditChart = (props) => {
  return {
    subType: EDIT_OPTIONS.EDIT_CHART,
    position: OPTION_POSITION.LEFT,
    order: 1,
    config: {
      clickHandler: () => {
        let index = props.layer.findIndex(l => props.shapeRef.current.getId() === l.id);
        let obj = props.layer[index];
        if (obj) {
          props.setChartData({ ...obj.data });
        }
      },
      content: () => {
        return <Button>Edit</Button>
      }
    }
  }
}

const updateChartAttr = (attr, props) => {
  let { layer, selectedId, onChange, shapeRef } = props;
  if (!(shapeRef && shapeRef.current)) {
    return;
  }
  const data = shapeRef.current.getAttr('data');
  let value = data ? !data[attr] : false;

  updateCanvasChart(layer, selectedId, attr, value, null, (copyLayers, err) => {
    if (!err) {
      onChange(copyLayers);
    }
  })
}

export const getBold = (props) => {
  return {
    subType: EDIT_OPTIONS.BOLD,
    position: OPTION_POSITION.LEFT,
    order: 5,
    config: {
      clickHandler: () => {
        updateChartAttr('bold', props);

      },
      content: () => {
        return <FontAwesomeIcon icon={faBold} size={"1x"} />
      }
    }
  }
}

export const getItalic = (props) => {
  return {
    subType: EDIT_OPTIONS.ITALIC,
    position: OPTION_POSITION.LEFT,
    order: 6,
    config: {
      clickHandler: () => {
        updateChartAttr('italic', props);

      },
      content: () => {
        return <FontAwesomeIcon icon={faItalic} size={"1x"} />
      }
    }
  }
}

const canShowOnChartType = (chartType) => {
  switch (chartType) {
    case CHART_TYPE.HORIZONTAL_BAR_CHART:
    case CHART_TYPE.VERTICAL_BAR_CHART:
    case CHART_TYPE.LINE_CHART:
      return true;
    default:
      return false;
  }
}

const emptyBar = (data, column) => {
  let chartObjectList = data.chartObjectList;
  let filterData = chartObjectList.filter(ob => {
    return ob[column] && !isNaN(ob[column]);
  })
  return !!filterData.length;
}

const canShowTray = (shapeRef, column) => {
  if (column === CHART_COLUMNS.DATASET1 || column === CHART_COLUMNS.LABEL) {
    return true;
  }

  let data = shapeRef.current.getAttr('data');
  let chartType = shapeRef.current.getAttr('chartType');
  if (canShowOnChartType(chartType)) {
    return emptyBar(data, column);
  }
}

export const getContent = (colorType, color) => {
  if (colorType === COLOR_TYPE.BAR_COLOR) {
    return (
      <button className="colorButton" style={{
        backgroundColor: color,
        minWidth: '0',
        margin: 'auto',
        width: '30px',
        height: '30px'
      }}></button>
    )
  } else {
    return <FontAwesomeIcon icon={faFont} size={"1x"} />
  }
}
export const getChartColorTray = (props, column, colorType) => {
  let { layer, selectedId, shapeRef, onChange } = props;
  if (!canShowTray(props.shapeRef, column)) {
    return null;
  }
  let data = props.shapeRef.current.getAttr('data');
  let color = data ? data.colors[column] : 'black';

  return {
    position: OPTION_POSITION.LEFT,
    order: 2,

    config: {
      className: colorType,
      clickHandler: () => {
        props.handleElementClick(ELEMENT_TRAY_TYPE.CHART_COLOR_PICKER, { color: color, column: column });
      },
      content: () => {
        return (
          <React.Fragment>
            <span className="web">
              {getContent(colorType, color)}
            </span>
            <ColorPickerMobile layer={layer}
              selectedId={selectedId}
              setLayer={onChange}
              tray={ELEMENT_TRAY_TYPE.CHART_COLOR_PICKER}
              shapeRef={shapeRef}
              trayState={{ color: color, column: column }}>{getContent(colorType, color)}</ColorPickerMobile>
          </React.Fragment>
        )
      }
    }
  }
}