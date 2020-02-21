import React from 'react';
import './Menu.scss';
import faUndoRedo from '../../../assets/img/return-arrow.svg'
import { TEXT_EDIT_MODE } from '../EditableDiv/EditableDiv';

export default function Menu(props) {
    let { undoList, redoList, undoLayer, redoLayer, textEditMode, cropIndex } = props;
    
    React.useEffect(() => {
        if (!undoList || !undoList.length || textEditMode === TEXT_EDIT_MODE.EDITOR) return; 
        const checkForUndo = (e) => {
            if (e.ctrlKey && e.keyCode === 90) {
                undoLayer();
            }
        }
        document.addEventListener('keydown', checkForUndo);
        return () => {
            document.removeEventListener("keydown", checkForUndo);
        }
    });

    React.useEffect(() => {
        if (!redoList || !redoList.length || textEditMode === TEXT_EDIT_MODE.EDITOR) return; 
        const checkForRedo = (e) => {
            if (e.ctrlKey && e.keyCode === 89) {
                redoLayer();
            }
        }
        document.addEventListener('keydown', checkForRedo);
        return () => {
            document.removeEventListener("keydown", checkForRedo);
        }
    });

    const handleResize = () => {
        if (props.onResize) {
            props.setOnResize(false);
        }   else {
            props.setOnResize(true);
        }
    }

    const getResize = () => {
        return (
            <div onClick={handleResize} >
                <span>Resize</span>
            </div>
        )
    }

    const getDownload = () => {
        return (
            <div onClick={() => {}} style={{float: 'right'}} >
                <span>Download</span>
            </div>
        )
    }

    const getUndo = () => {
        if (undoList && undoList.length && textEditMode !== TEXT_EDIT_MODE.EDITOR) {
            return (
                <div onClick={undoLayer} >
                    <img width="20"  src={faUndoRedo} alt="undo-redo"></img>
                </div>
            )
        }
    }

    const getRedo = () => {
        if (redoList && redoList.length && textEditMode !== TEXT_EDIT_MODE.EDITOR) {
            return (
                <div onClick={redoLayer} >
                    <img width="20" style={{transform: 'scaleX(-1)'}} src={faUndoRedo} alt="undo-redo"></img>
                </div>
            )
        }
    }

    return (
        <div className="menu">
            <div className="left-menu">
                {getResize()}
                {cropIndex === null && getUndo()}
                {cropIndex === null && getRedo()}
            </div>
            <div className="right-menu">
                {getDownload()}
            </div>
        </div>
    )
}
