import { ChartCommonUtils } from '../components/shared/chart/ChartCommonUtils';
import { findChartClassByChartType, updateChartData } from '../components/shared/chart/ChartUtils';

/* export const updateChart = (data, previousGraphData, selectedLayerId, props, updateState, isDestroyed = false) => {
  if (selectedLayerId) {
    let { layerIndex, foundLayer } = findLayer(selectedLayerId, props);

    if (foundLayer && data !== previousGraphData) {
      let chartClass = findChartClassByChartType(foundLayer.chartType);
      let svg = chartClass.createChart(data);
      ChartCommonUtils.convertD3SvgInImage(svg, (image) => {
        updateLayers(image, layerIndex, data, props, updateState, isDestroyed);
      })
    }
  }
}

export const updateLayers = (image, layerIndex, data, props, updateState, isDestroyed) => {
  let { layer } = props;
  let copyLayers = [...layer];
  let copyLayer = { ...copyLayers[layerIndex] };
  copyLayer.image = image;
  copyLayer.data = updateChartData('chartObjectList', data, copyLayer.data);
  copyLayers[layerIndex] = copyLayer;
  !isDestroyed && updateState({ previousGraphData: this.state.localGraphData });
  props.setLayer(copyLayers);
}

export const findLayer = (id, props) => {
  let { layer } = props;
  let layerIndex = layer.findIndex(l => l.id === id);
  return {
    layerIndex, foundLayer: layerIndex > -1 ? layer[layerIndex] : {}
  };
}; */