import React from 'react'
import Button from '@material-ui/core/Button';
import { findGroup } from '../Utils/CommonUtils';
import { GROUP_STATE, TEXT_EDIT_MODE } from '../../EditableDiv';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './DeleteLayer.scss';

export default function DeleteLayer(props) {
    const deleteLayers = (layers = props.layer) => {
        var copyLayerList = [...layers];

        for (let i = 0; i < copyLayerList.length; i++) {
            let copyLayer = { ...copyLayerList[i] };
            if (copyLayer.id === props.shapeRef.current.attrs.id) {
                if (copyLayer.id === props.shapeRef.current.attrs.id) {
                    copyLayerList.splice(i, 1);
                }
            } else if (copyLayer.type === 'Group') {
                if (copyLayer.groupState === GROUP_STATE.TEMPORARY) {
                    copyLayerList.splice(i, 1);
                } else {
                    let returnChildElements = deleteLayers(copyLayer.childElements);
                    if (returnChildElements) {
                        copyLayer.childElements = returnChildElements;
                        copyLayerList[i] = copyLayer;
                    }
                }
            }
        }
        return copyLayerList;
    }

    function handleDeleteLayer() {
        if (props.textEditMode === TEXT_EDIT_MODE.EDITOR) return;

        let changedLayers = deleteLayers();
        let groupObj = findGroup(changedLayers, props);
        props.onChange(changedLayers);
        if (groupObj) {
            props.unGroupPermanentGroup();
            props.unGroupTempGroup();
        }

        props.onDeselect();
    }

    React.useEffect(() => {
        let checkForDelete = (e) => {
            if (props.shapeRef && props.shapeRef.current) {
                if ((e.keyCode === 8 || e.keyCode === 46) && e.target.nodeName !== 'INPUT') {
                    handleDeleteLayer();
                }
            }
        }
        document.addEventListener('keydown', checkForDelete);
        return () => {
            document.removeEventListener("keydown", checkForDelete);
        }
    });
    
    return (
        <div className="delete-layer" onClick={handleDeleteLayer}>
            <Button><FontAwesomeIcon icon={faTrashAlt} size={"1x"} /></Button>
        </div>
    )
}
