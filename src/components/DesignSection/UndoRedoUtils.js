import cloneDeep from 'lodash/cloneDeep';
import { ELEMENT_SUB_TYPE } from './ElementsPicker/ElementsPicker';

export const updateUndoList = (setUndoList, layer, setRedoList, flushRedo = false) => {
    setUndoList(prev => {
        let undoList = cloneDeep(prev);
        undoList.push(layer);
        return undoList;
    })
    if (flushRedo) {
        setRedoList([]);
    }
}

export const updateRedoList = (setRedoList, layer) => {
    setRedoList(prev => {
        let redoList = cloneDeep(prev);
        redoList.push(layer);
        return redoList;
    })
}

export const removeRedoList = (setRedoList) => {
    setRedoList(prev => {
        let copyRedoList = [...prev];
        copyRedoList.pop();
        return copyRedoList;
    });
}

export const removeUndoList = (setUndoList) => {
    setUndoList(prev => {
        let copyUndoList = [...prev];
        copyUndoList.pop();
        return copyUndoList;
    });
}

export const updateChartData = (layer, setChartData, selectedId) => {
    if (layer && layer.subType === ELEMENT_SUB_TYPE.CHART) {
        let foundLayer = layer.find(l => l.id === selectedId);
        if (foundLayer) {
            setChartData(foundLayer.data);
        } else {
            setChartData(null);
        }
    }
}

export const undoLayer = (setUndoList, setRedoList, setLayer, setChartData, selectedId, undoList, layer) => {
    removeUndoList(setUndoList);
    updateRedoList(setRedoList, [...layer]);
    setLayer(prev => undoList.length ? undoList[undoList.length - 1] : null);
    updateChartData(undoList.length ? undoList[undoList.length - 1] : null, setChartData, selectedId);
}

export const redoLayer = (setUndoList, setRedoList, setLayer, setChartData, selectedId, redoList, layer) => {
    removeRedoList(setRedoList);
    updateUndoList(setUndoList, [...layer], setRedoList, false);
    setLayer(prev => redoList.length ? redoList[redoList.length - 1] : null);
    updateChartData(redoList.length ? redoList[redoList.length - 1] : null, setChartData, selectedId);
}
