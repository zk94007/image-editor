import React, { Component } from 'react';
import './GraphTableTray.scss';
import { prepareGraphObject, CHART_COLUMNS } from '../../../../shared/chart/ChartDataUtils';
import { updateCanvasChart } from '../../../../shared/chart/ChartUtils';
import { MenuItem, Select } from '@material-ui/core';
import { CHART_TYPE } from '../../../../shared/chart/ChartEnums';
// import { style, borderColor } from '@material-ui/system';

export default class GraphTableTray extends Component {
    state = {
        localGraphData: [],
        previousGraphData: [],
        selectedLayerId: null,
        pasteData: '',
        chartType: CHART_TYPE.VERTICAL_BAR_CHART
    }

    setChartType = () => {
        this.setState({ chartType: this.props.chartData.chartType });
    }

    componentDidMount() {
        this.updateTable();
        this.updateState({ selectedLayerId: this.props.selectedId });
        this.setChartType();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.chartData !== this.props.chartData) {
            this.updateTable();
        }
        if (prevProps.selectedId !== this.props.selectedId && this.props.selectedId) {
            this.updateState({ selectedLayerId: this.props.selectedId });
        }
    }

    componentWillUnmount() {
        this.updateChart(this.state.localGraphData, true);
    }

    updateState = (updatedValue) => {
        let statevalue = { ...updatedValue };
        this.setState(statevalue);
    }

    setLocalGraphData = (graphData) => {
        this.updateState({ localGraphData: [...graphData] });
    }

    updateTable = () => {
        if (this.props.chartData) {
            let data = [...this.props.chartData.chartObjectList];
            this.setState({
                localGraphData: data,
                previousGraphData: data
            });
        }
    }

    prepareGraphData = (parseData) => {
        let prepareData = [];
        if (!parseData || !parseData.length || (parseData.length === 1 && parseData[0].length <= 1)) {
            return;
        }

        parseData.push([]);
        parseData.forEach((row, index) => {
            let obj = prepareGraphObject(row, index, this.state.chartType);
            prepareData.push(obj);
        });

        this.setLocalGraphData(prepareData);
        this.updateChart(prepareData);
    }

    onPaste = (e) => {
        let pasteData = e.clipboardData.getData('Text');
        let inputData = pasteData ? pasteData.replace(/^(\r\n|\n|\r)*|(\r\n|\n|\r)*$/g, '') : null;
        let parseData = this.parseInputData(inputData);
        this.prepareGraphData(parseData);
    }

    parseInputData = (inputData) => {
        let rawDataMap = [];
        let rows = inputData.split(/\r\n|\n|\r/);

        rows.forEach((row) => {
            let columns = row.split(/\t/) || [];
            rawDataMap.push(columns);
        });
        return rawDataMap;
    }

    validateNumericField = (target) => {
        if (target.getAttribute('numeric') !== 'true') return true;
        if (isNaN(target.value)) {
            target.classList.add('error');
            return false;
        } else {
            target.classList.remove('error');
            return true;
        }
    }

    updateChart = (data = this.state.localGraphData, isDestroyed = false) => {
        let { selectedLayerId } = this.state;
        if (selectedLayerId) {
            if (data !== this.state.previousGraphData) {
                let { layer } = this.props;
                updateCanvasChart(layer, selectedLayerId, 'chartObjectList', data, null, (copyLayers, err) => {
                    if (!err) {
                        !isDestroyed && this.updateState({ previousGraphData: this.state.localGraphData });
                        this.props.setLayer(copyLayers);
                    }
                })
            }
        }
    }

    onFocus = (event, index) => {
        let { localGraphData } = this.state;
        event.target.parentElement.classList.remove('blank');

        let graphDataLength = localGraphData.length;
        if (graphDataLength === (index + 1)) {
            let copyGraphData = [...localGraphData];
            copyGraphData[index] = { ...copyGraphData[index], [CHART_COLUMNS.LABEL]: `Item ${index + 1}` };
            copyGraphData.push(prepareGraphObject([], index + 1, this.state.chartType));
            this.setLocalGraphData(copyGraphData);
        }
    }

    onBlur = (event) => {
        if (!event.target.value) {
            event.target.parentElement.classList.add('blank');
        }
        this.validateNumericField(event.target);
        this.updateChart();
    }

    onValueChange = (event, index) => {
        let copyGraphData = [...this.state.localGraphData];
        if (copyGraphData[index]) {
            copyGraphData[index] = { ...copyGraphData[index], [event.target.name]: event.target.value };
            this.setLocalGraphData(copyGraphData);
        }
    }

    getRows = () => {
        let { localGraphData } = this.state;
        let allowedColumns = Object.values(CHART_COLUMNS);

        const getDataSetCol = (name, data, index) => {
            let numeric = name !== CHART_COLUMNS.LABEL;

            return (
                <td className={!data ? 'blank' : ''} key={name}>
                    <input type="text"
                        value={data}
                        name={name}
                        onBlur={this.onBlur}
                        numeric={numeric.toString()}
                        onFocus={(e) => this.onFocus(e, index)}
                        onChange={(e) => this.onValueChange(e, index)}></input>
                </td>
            )
        }
        return localGraphData && localGraphData.map((data, index) => {
            let columns = Object.keys(data);

            let row = (
                <tr key={data.id}>
                    {columns.map(c => {
                        if (allowedColumns.includes(c)) {
                            return getDataSetCol(c, data[c], index)
                        }
                        return null;
                    })}
                </tr>
            )
            return row;
        });
    }

    onChartTypeChange = (event) => {
        if (this.state.chartType === event.target.value) return;

        let { layer } = this.props;
        let { selectedLayerId } = this.state;

        this.setState({
            chartType: event.target.value
        });
        updateCanvasChart(layer,
            selectedLayerId,
            'chartType',
            event.target.value,
            event.target.value,
            (copyLayers, err) => {
                if (!err) {
                    this.props.setLayer(copyLayers);
                }
            })
    }
    render = () => {
        return (
            <React.Fragment>
                <div className="change-chart-type">
                    <Select
                        value={this.state.chartType}
                        onChange={this.onChartTypeChange}
                        name="age"
                    >
                        <MenuItem value={CHART_TYPE.VERTICAL_BAR_CHART}>Bar Chart</MenuItem>
                        <MenuItem value={CHART_TYPE.HORIZONTAL_BAR_CHART}>Row Chart</MenuItem>
                        <MenuItem value={CHART_TYPE.PIE_CHART}>Pie Chart</MenuItem>
                        <MenuItem value={CHART_TYPE.DONUT_CHART}>Donut Chart</MenuItem>
                        <MenuItem value={CHART_TYPE.LINE_CHART}>Line Chart</MenuItem>
                    </Select>
                </div>
                <div className="graph-table-container">
                    <table>
                        <tbody>
                            {this.getRows()}
                        </tbody>
                    </table>
                    <div className="excel-paste-container">
                        <textarea rows="5" 
                            placeholder="Paste data from spreadsheet" 
                            value={this.state.pasteData} 
                            onPaste={this.onPaste} 
                            onChange={() => {}}
                        >
                        </textarea>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
