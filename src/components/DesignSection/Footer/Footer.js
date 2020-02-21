import React from 'react';
import './Footer.scss';
import ZoomDesktop from './ZoomDesktop/ZoomDesktop';

export default function Footer(props) {
    return (
        <div id="board-resize" className="footer-container desktop">
            <ZoomDesktop {...props}></ZoomDesktop>
        </div>
    )
}
