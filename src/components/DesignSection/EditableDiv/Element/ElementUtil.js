import Quill from 'quill';
import cloneDeep from 'lodash/cloneDeep';
import { ELEMENT_TRAY_TYPE } from '../../ElementsPicker/ElementsPicker';
import { getQuillContainer } from '../../../../utilities/EditableDivUtil';
import { getZoomLevelFromStageRef } from '../EditOptions/EditOptionsUtil';
import { TEXT_EDIT_MODE } from '../EditableDiv';
import { getAbsoluteRotation } from '../GroupElements';
import { getTextSVG } from './TextNodeSvg';

export const getEditableDiv = (shapeRef, trRef, stageRef, scaleX, scaleY, movingResizer, tempEditor) => {
    // at first lets find position of text node relative to the stage:
    var svgPosition = shapeRef.current.absolutePosition();

    let editableDiv = document.getElementById('contenteditable');
    if (!editableDiv) {
        editableDiv = document.createElement('div');
        editableDiv.setAttribute('id', 'contenteditable');
        let stageContainer = document.getElementById('stage-container');
        stageContainer.appendChild(editableDiv);
    }

    editableDiv.innerHTML = shapeRef.current.attrs["data"];
    //editableDiv.setAttribute('contenteditable', true);

    editableDiv.style.top = svgPosition.y + 'px';
    editableDiv.style.left = svgPosition.x + 'px';
    editableDiv.firstChild.style.width = (shapeRef.current.width() * scaleX) + 'px';

    var rotation = getAbsoluteRotation(shapeRef.current);
    var transform = '';
    if (rotation) {
        transform += 'rotateZ(' + rotation + 'deg)';
    }

    var px = 0;
    // also we need to slightly move textarea on firefox
    // because it jumps a bit
    var isFirefox =
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
        px += 2;
    }
    transform += 'translateY(-' + px + 'px)';
    transform += ' scale(' + (getZoomLevelFromStageRef(stageRef)) + ')';

    editableDiv.style.transform = transform;
    if (tempEditor) {
        //document.body.appendChild(editableDiv);
        editableDiv.style.left = -10000 + 'px';
        editableDiv.style.top = -10000 + 'px';
        editableDiv.setAttribute('tempeditor', true);
    }

    editableDiv.focus();

    return editableDiv;
}

export const applyStyleWhenTransform = (element, trRef, scaleX, scaleY, movingResizer) => {
    if (movingResizer) {
        if (trRef.current && !(trRef.current.movingResizer === 'middle-right'
            || trRef.current.movingResizer === 'middle-left')) {

            let quill = getQuillContainer();
            if (quill) {
                let fontsize = parseFloat(quill.getFormat().size || element.firstChild.style.fontSize);
                quill.format('size', fontsize * scaleX + 'px');
            }
        }
    }
}

export const prepareHtmlForSvg = (html) => {
    if (!html) {
        return '';
    }
    return html.replace(/&nbsp;\\*/g, "<span style='visibility: hidden'>-</span>").replace(/<br>\\*/g, "<span style='visibility: hidden'>-</span>");
}


export const getSVG = (content, width = 100, height = 100) => {
    var data = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <style type="text/css" >
            <![CDATA[
                div.ql-editor p {
                    padding: 0px; 
                    margin: 0px;
                }
                div.ql-editor ul, div.ql-editor ol {
                    padding-top: 0px; 
                    margin-top: 0px;
                    margin-left: 0px;
                    margin-bottom: 0px;
                    padding-left: 1.5em;
                }
                div.ql-editor ul li, div.ql-editor ol li {
                    padding-left: 0px;
                }
                div.ql-editor ul li:before, div.ql-editor ol li:before {
                    padding-left: 0px;
                    margin-right: 0;
                }
                div.ql-editor .ql-align-right {
                    text-align: right;
                }
                div.ql-editor .ql-align-center {
                    text-align: center;
                }
                div.ql-editor .ql-align-justify {
                    text-align: justify;
                }
            ]]>
        </style>
      <foreignObject width="100%" height="100%">
      ${content}
      </foreignObject>
      </svg>`

    var DOMURL = window.URL || window.webkitURL || window;

    var svg = new Blob([data], {
        type: 'image/svg+xml;charset=utf-8'
    });

    var url = DOMURL.createObjectURL(svg);
    return url;
}

// function addPaddingTopAndBottom(container) {
//     let paddingTop = 0;
//     if (container.style.paddingTop) {
//         paddingTop = parseFloat(container.style.paddingTop);
//     }
//     let diffInHeight = container.scrollHeight - (container.offsetHeight - paddingTop);
//     if (diffInHeight > 0) {
//         container.style.paddingTop = ((diffInHeight / 2) + 0.5) + 'px';
//         container.style.paddingBottom = (diffInHeight / 2) + 'px';
//     }
//     else {
//         container.style.paddingTop = '0';
//         container.style.paddingBottom = '0';
//     }
// }

// function addPaddingLeftAndRight(container) {
//     let paddingRight = 0;
//     if (container.style.paddingRight) {
//         paddingRight = parseFloat(container.style.paddingRight);
//     }
//     let diffInWidth = container.scrollWidth - (container.offsetWidth - paddingRight);
//     if (diffInWidth > 0) {
//         // container.style.paddingLeft = ((diffInWidth / 2) + 0.5) + 'px';
//         container.style.paddingRight = (diffInWidth + 0.5) + 'px';
//     }
//     else {
//         container.style.paddingRight = '0';
//     }
// }

// const addPaddingWhenCreateSVG = () => {
//     let container = document.querySelector('#container');
//     if (container) {
//         addPaddingTopAndBottom(container);
//         addPaddingLeftAndRight(container);
//     }
// }

export const editTextOnClick = (props, trRef, shapeRef, scaleX = 1, scaleY = 1, movingResizer, tempEditor) => {
    let {
        layerRef,
        stageRef,
        shapeProps,
        onChange,
        setTextEditMode,
        selectedElement,
        handleElementClick
    } = props;

    if (shapeRef.current) {
        layerRef.current = shapeRef.current.getLayer() || layerRef.current;
    }
    if (trRef.current && layerRef.current && shapeRef.current && stageRef.current) {

        // hide text node and transformer:
        if (!tempEditor) {
            shapeRef.current.hide();
            trRef.current.hide();
            layerRef.current.draw();
        }

        let editableDiv = getEditableDiv(shapeRef, trRef, stageRef, scaleX, scaleY, movingResizer, tempEditor);
        var layerReferenceCurrent = layerRef.current;
        let quill = initQuillEditor(shapeRef, tempEditor, movingResizer);

        let oldQuillContents = quill.getContents();
        let oldTop = editableDiv.offsetTop;
        setTextEditMode(tempEditor ? TEXT_EDIT_MODE.IMAGE : TEXT_EDIT_MODE.EDITOR);

        if (movingResizer) {
            applyStyleWhenTransform(editableDiv, trRef, scaleX, scaleY, movingResizer);
        }

        const removeDiv = (event) => {
            if (!shapeRef || !shapeRef.current) {
                return;
            }
            var layer = cloneDeep(shapeProps);
            //addPaddingWhenCreateSVG();
            let divClientRect = editableDiv.firstChild.getBoundingClientRect();

            let width = editableDiv.firstChild.offsetWidth || divClientRect.width;
            let height = editableDiv.firstChild.offsetHeight || divClientRect.height;
            let top = editableDiv.offsetTop;

            //let svg1 = getSVG(prepareHtmlForSvg(editableDiv.innerHTML), width, height);
            let svg = getTextSVG(editableDiv.innerHTML, width, height);
            shapeRef.current.setAttr('height', height);
            shapeRef.current.setAttr('width', width);
            if (!event || !event.detail || !event.detail.shouldCreate) {
                setTextEditMode(null);
            }

            //editableDiv.parentNode.removeChild(editableDiv);
            editableDiv.style.left = -10000 + 'px';
            editableDiv.style.top = -10000 + 'px';
            window.removeEventListener('click', handleOutsideClick);
            document.removeEventListener('removeTempEditor', removeDiv);

            // Update existing layer.
            if (!oldQuillContents
                || JSON.stringify(quill.getContents()) !== JSON.stringify(oldQuillContents)
                || movingResizer) {

                layer.data = editableDiv.innerHTML;
                layer.quillContents = quill.getContents();
                // Update image once text change.
                var imageObj2 = new Image();
                imageObj2.src = svg;
                imageObj2.onload = () => {
                    let shapeRefCurrent = shapeRef.current;
                    if (shapeRefCurrent) {
                        shapeRefCurrent.image(imageObj2);
                        shapeRefCurrent.getLayer().draw();
                    }
                };
                layer.image = imageObj2;
                layer.height = height;
                layer.width = width;
                let zoomLevelFromStage = getZoomLevelFromStageRef(props.stageRef);
                layer.y = shapeRef.current.y() - ((oldTop - top) / zoomLevelFromStage);
                layer.x = shapeRef.current.x();
                layer.rotation = shapeRef.current.rotation();
                onChange(layer);
            }

            if (selectedElement === ELEMENT_TRAY_TYPE.COLOR_PICKER) {
                handleElementClick(ELEMENT_TRAY_TYPE.TEMPLATE);
            }
            shapeRef.current.show();
            if (trRef.current) {
                trRef.current.show();
                trRef.current.forceUpdate();
            }
            if (layerReferenceCurrent) {
                layerReferenceCurrent.draw();
            }

            if (event && event.detail && event.detail.shouldCreate) {
                setTimeout(() => {
                    if (!shapeProps.locked && shapeRef.current.attrs.elementType === ELEMENT_TRAY_TYPE.TEXT) {
                        editTextOnClick(props, trRef, shapeRef, scaleX, scaleY, movingResizer, tempEditor);
                    }
                }, 0);

            }
        }

        editableDiv.addEventListener('keydown', (e) => {
            // on esc do not set value back to node
            if (e.keyCode === 27) {
                removeDiv();
            }
        });

        const handleOutsideClick = (e) => {
            if ((!editableDiv.contains(e.target) && e.target.parentNode)
                && (!document.getElementsByClassName('MuiPaper-root') || !document.getElementsByClassName('MuiPaper-root')[0] || !document.getElementsByClassName('MuiPaper-root')[0].contains(e.target))
                && (!document.getElementById('color-popover') || !document.getElementById('color-popover').contains(e.target))
                && (!document.getElementById('color-container') || !document.getElementById('color-container').contains(e.target))
                && (!document.getElementById('font-container') || !document.getElementById('font-container').contains(e.target))
                && (!document.getElementById('edit-options') || !document.getElementById('edit-options').contains(e.target))) {
                removeDiv();
            }
        }

        if (movingResizer) {
            removeDiv();
        } else if (tempEditor) {
            setTimeout(() => {
                document.addEventListener('removeTempEditor', removeDiv);
            });
        } else {
            setTimeout(() => {
                window.addEventListener('click', handleOutsideClick);
            });
        }
        return removeDiv;
    }
}

const initQuillEditor = (shapeRef, tempEditor, movingResizer) => {
    var quill = new Quill('#container', {
        theme: 'bubble',
        "modules": {
            "toolbar": false
        }
    });
    quill.focus();
    if (shapeRef.current.attrs["quillContents"]) {
        quill.setContents(shapeRef.current.attrs["quillContents"]);
    }
    let editor = document.querySelector('.ql-editor');
    editor.style.padding = 0;
    editor.style.lineHeight = 1.42;
    editor.style.fontSize = '20px';
    if (tempEditor || movingResizer) {
        quill.setSelection(0, quill.getLength() - 1);
    }
    return quill;
}
