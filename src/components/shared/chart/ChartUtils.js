import { StackBarChartVerticalUtils } from './StackBarChartVertical/StackBarChartVerticalUtils';
import { StackBarChartHorizontalUtils } from './StackBarChartHorizontal/StackBarChartHorizontalUtils';
import { CHART_TYPE } from './ChartEnums';
import { ChartCommonUtils } from './ChartCommonUtils';
import { ELEMENT_SUB_TYPE } from '../../DesignSection/ElementsPicker/ElementsPicker';
import { PieChartUtils } from './PieChart/PieChartUtils';
import { LineChartUtils } from './LineChart/LineChartUtils';

export const findChartClassByChartType = (chartType) => {
  let chartUtilsClass;

  switch (chartType) {
    case CHART_TYPE.VERTICAL_BAR_CHART:
      chartUtilsClass = StackBarChartVerticalUtils;
      break;
    case CHART_TYPE.HORIZONTAL_BAR_CHART:
      chartUtilsClass = StackBarChartHorizontalUtils;
      break;
    case CHART_TYPE.PIE_CHART:
    case CHART_TYPE.DONUT_CHART:
      chartUtilsClass = PieChartUtils;
      break;
    case CHART_TYPE.LINE_CHART:
      chartUtilsClass = LineChartUtils;
      break;
    default:
      chartUtilsClass = StackBarChartVerticalUtils;
  }
  return chartUtilsClass;
}

export const updateChartData = (key, value, chartData = {}) => {
  let copyChartData = { ...chartData, [key]: value };
  return copyChartData;
}

export const findLayer = (id, layer) => {
  let layerIndex = layer.findIndex(l => l.id === id);
  return {
    layerIndex, foundLayer: layerIndex > -1 ? layer[layerIndex] : {}
  };
};

const updateLayers = (image, layerIndex, layer, key, data, chartType) => {
  let copyLayers = [...layer];
  let copyLayer = { ...copyLayers[layerIndex] };
  copyLayer.image = image;
  copyLayer.data = updateChartData(key, data, copyLayer.data);
  copyLayer.chartType = chartType;
  copyLayers[layerIndex] = copyLayer;
  return copyLayers;
}

export const updateCanvasChart = (layer, layerId, key, value, modifiedChartType, callback) => {
  let { layerIndex, foundLayer } = findLayer(layerId, layer);
  if (foundLayer) {
    let chartType = modifiedChartType || foundLayer.chartType;
    let data = { ...foundLayer.data, [key]: value };
    getChartImage(data, chartType, (image) => {
      let copyLayers = updateLayers(image, layerIndex, layer, key, value, chartType);
      callback(copyLayers, false);
    });
  } else {
    callback(null, true);
  }
}

export const getChartImage = (data, chartType, callback) => {
  let chartClass = findChartClassByChartType(chartType);
  let svg = chartClass.createChart(data);
  ChartCommonUtils.convertD3SvgInImage(svg, (image) => {
    callback(image, true);
  });
}

export const getChartFontSize = (shapeRef) => {
  if (shapeRef && shapeRef.current) {
    let chartData = shapeRef.current.getAttr('data');
    return getFontSizeInNumber(chartData)
  }

  return null;
}

export const getFontSizeInNumber = (chartData) => {
  if (chartData && chartData.fontSize) {
    return parseFloat(chartData.fontSize);
  }
  return null;
}


export const updateChartFontSize = (shapeProps, scaleX) => {
  if (shapeProps && shapeProps.subType === ELEMENT_SUB_TYPE.CHART) {
    let chartData = shapeProps.data;
    let fontSize = getFontSizeInNumber(chartData);
    let updatedProps = { ...shapeProps };
    updatedProps.data = { ...updatedProps.data };
    updatedProps.data.fontSize = `${fontSize * scaleX}px`;
    updatedProps.data.scale = updatedProps.data.scale * (1 / scaleX);
    return updatedProps;
  }
  return shapeProps;

}

export const updateChartScale = (shapeProps, scaleX, scaleY) => {
  if (shapeProps && shapeProps.subType === ELEMENT_SUB_TYPE.CHART) {
    let updatedProps = { ...shapeProps };
    updatedProps.data = { ...updatedProps.data };
    updatedProps.data.scaleX = updatedProps.data.scaleX * (1 / scaleX);
    updatedProps.data.scaleY = updatedProps.data.scaleY * (1 / scaleY);
    return updatedProps;
  }
  return shapeProps;
}
