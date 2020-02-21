import React, { Component } from 'react';
import { findChartClassByChartType } from './ChartUtils';

export default class Chart extends Component {
    chartUtilsClass = null;
    constructor(props) {
        super(props);
        this.chartUtilsClass = findChartClassByChartType(props.chartType);
    }

    render() {
        return (
            <div onClick={() => this.chartUtilsClass.addChart(this.props.handleAddElement)}>
                <img
                    src={this.chartUtilsClass.getShapeElement()}
                    alt="chart">
                </img>
            </div >
        )
    }
}
