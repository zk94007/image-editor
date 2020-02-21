// import { calculatePositionFromShape } from "../../DesignSection/EditableDiv/EditOptions/EditOptionsUtil";
import { CHART_TYPE } from "./ChartEnums";

export const CHART_COLUMNS = {
    DATASET1: 'DATASET1',
    DATASET2: 'DATASET2',
    DATASET3: 'DATASET3',
    DATASET4: 'DATASET4',
    DATASET5: 'DATASET5',
    LABEL: 'LABEL'
}
export const prepareInitialChartData = (chartType) => {
    let dummyData = [1, 2, 3, 4, 5, null];
    let prepareData = dummyData.map((data, index) => {
        return prepareGraphObject([data ? `Item ${data}` : ''], index, chartType);
    });
    return prepareData;
}

export const prepareGraphObject = (data, index, chartType) => {
    let graphObject = {
        id: index,
        [CHART_COLUMNS.LABEL]: data[0] || '',
        [CHART_COLUMNS.DATASET1]: data[1] || (data[0] ? (index + 1) * 10 : ''),
    }
    if (chartType !== CHART_TYPE.PIE_CHART) {
        graphObject[CHART_COLUMNS.DATASET2] = data[2] || '';
        graphObject[CHART_COLUMNS.DATASET3] = data[3] || '';
        graphObject[CHART_COLUMNS.DATASET4] = data[4] || '';
        graphObject[CHART_COLUMNS.DATASET5] = data[5] || '';
    }

    return graphObject;


}

export const removeEmptyObject = (chartData) => {
    const filteredData = chartData.filter(d => d[CHART_COLUMNS.LABEL]
        || d[CHART_COLUMNS.DATASET1]
        || d[CHART_COLUMNS.DATASET2]
        || d[CHART_COLUMNS.DATASET3]
        || d[CHART_COLUMNS.DATASET4]
        || d[CHART_COLUMNS.DATASET5]);
    return filteredData;
}