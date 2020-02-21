import React from 'react';
import './TextTray.css';
// import { getSVG } from '../../../EditableDiv/Element/ElementUtil';
import { ELEMENT_SUB_TYPE } from '../../ElementsPicker';
import { getTextSVG } from '../../../EditableDiv/Element/TextNodeSvg';
import SearchInput from "../../../../shared/SearchInput";
import { Typography } from '@material-ui/core';

function TextTray(props) {
    const getContent = (content) => {
        let text = '';
        let fontSize = 20;
        let line_height = 1;
        if (content === 'heading') {
            text = 'Add a heading';
            fontSize = 24;
            line_height = 1.4;
        }
        if (content === 'subHeading') {
            text = 'Add a subheading';
            fontSize = 18;
            line_height = 1;
        }
        if (content === 'bodyText') {
            text = 'Add a body text';
            fontSize = 12;
            line_height = 0.6;
        }
        return `<div id="container" xmlns="http://www.w3.org/1999/xhtml" style="
                    font-size: ${fontSize}px; display: inline-block; overflow-wrap: break-word; 
                    font-family: Arial, Helvetica, sans-serif; ">
                    <div style="line-height: ${line_height}em; font-family: arial;">
                        ${text}
                    </div>
                </div>`;
        // return `<div id="container" xmlns="http://www.w3.org/1999/xhtml" style="
        //             font-size: 24px; display: inline-block; overflow-wrap: break-word; 
        //             font-family: Arial, Helvetica, sans-serif; width: 160px;" 
        //             class="ql-container ql-bubble">
        //             <div class="ql-editor" data-gramm="false" contenteditable="true" style="
        //             padding: 0px; line-height: 1.42; font-size: 20px;">
        //                 <p class="ql-align-center" style="line-height: 1.4em; color: rgb(0, 0, 0);">
        //                     <span style="color: rgb(0, 0, 0);">Sample Text</span>
        //                 </p>
        //             </div>
        //             <div class="ql-clipboard" contenteditable="true" tabindex="-1"></div>
        //         </div>`;
    }

    const handleChange = () => {

    }
    return (
        <React.Fragment>
            <SearchInput
                handleChange={handleChange}
                placeholder="Search Text"
            />
            <Typography component="div" style={{ textAlign: 'left' }}>
                <Typography variant="caption" style={{ padding: 10 }}>
                    click text to add to page
                </Typography>
            </Typography>

            <div className="text-tray">
                <div onClick={() => props.handleAddElement({
                    type: "Image",
                    subType: ELEMENT_SUB_TYPE.TEXT,
                    value: getTextSVG(getContent('heading'), 160, 32),
                    data: getContent('heading'), height: 32, width: 160
                })}>
                    <Typography className="heading" variant="h4">
                        Add a heading
                    </Typography>
                </div>
                <div onClick={() => props.handleAddElement({
                    type: "Image",
                    subType: ELEMENT_SUB_TYPE.TEXT,
                    value: getTextSVG(getContent('subHeading'), 150, 24),
                    data: getContent('subHeading'), height: 24, width: 150
                })}>
                    <Typography className="subHeading" variant="h5">
                        Add a subheading
                    </Typography>
                </div>
                <div onClick={() => props.handleAddElement({
                    type: "Image",
                    subType: ELEMENT_SUB_TYPE.TEXT,
                    value: getTextSVG(getContent('bodyText'), 95, 18),
                    data: getContent('bodyText'), height: 18, width: 95
                })}>
                    <Typography className="bodyText" variant="caption">
                        Add a body text
                    </Typography>
                </div>
            </div>
        </React.Fragment>
    );
}

export default TextTray;