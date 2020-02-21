import { select } from 'd3';

import { ELEMENT_SUB_TYPE, ELEMENT_TYPE } from "../../DesignSection/ElementsPicker/ElementsPicker";
import { CHART_COLUMNS } from './ChartDataUtils';
import { getFontSizeInNumber } from './ChartUtils';

export class ChartCommonUtils {
    static colors = {
        [CHART_COLUMNS.DATASET1]: "#436ebe",
        [CHART_COLUMNS.DATASET2]: "#008ed4",
        [CHART_COLUMNS.DATASET3]: "#00addd",
        [CHART_COLUMNS.DATASET4]: "#00cadc",
        [CHART_COLUMNS.DATASET5]: "#37e5d4",
        [CHART_COLUMNS.LABEL]: 'black'
    }

    static addChartToCanvas(svg, chartConfig, handleAddElement) {
        this.convertD3SvgInImage(svg, (image) => {
            handleAddElement({
                type: ELEMENT_TYPE.IMAGE,
                subType: ELEMENT_SUB_TYPE.CHART,
                chartType: chartConfig.chartType,
                value: image,
                data: {
                    chartObjectList: chartConfig.chartObjectList,
                    colors: chartConfig.colors,
                    chartType: chartConfig.chartType,
                    fontSize: chartConfig.fontSize,
                    keys: chartConfig.keys,
                    scale: chartConfig.scale,
                    scaleX: chartConfig.scaleX,
                    scaleY: chartConfig.scaleY
                }
            });
        });
    }

    static getD3SVGBase64 = svg => {
        var html = svg
            .attr("version", 1.1)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .node().parentNode.innerHTML;

        return "data:image/svg+xml;base64," + btoa(html);
    };

    static convertD3SvgInImage = (svg, callback) => {
        let image = new Image();
        image.src = this.getD3SVGBase64(svg);
        this.removeD3Svg(svg);
        image.onload = () => {
            callback(image);
        };
    }

    static removeD3Svg = (svg) => {
        svg.node().parentNode.remove();
    }

    static createSvgPlaceHolder = (width, height) => {
        const svg = select('body')
            .append('div')
            .append('svg')
            .attr("width", width)
            .attr("height", height);

        return svg;
    }

    static calculateFontSize = (chartData) => {
        let fontSize = getFontSizeInNumber(chartData) || 10;
        return getFontSizeInNumber(chartData, fontSize) * chartData.scale + 'px';
    }

    static applyTickColor(axis) {
        axis
            .selectAll(".tick line")
            .style('stroke', '#C0C0BB');
    }
}