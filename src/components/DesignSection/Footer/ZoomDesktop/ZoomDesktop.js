import React from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import './ZoomDesktop.scss';

const options = [300, 200, 125, 100, 75, 50, 25, 10, 'line', 'Fit', 'Fill'];
let ACTUAL_HEIGHT = 400;
let ACTUAL_WIDTH = 250;
const OPTION_WRAPPER_HEIGHT = 60;
const TOP_MENU_HEIGHT = 60;
const SHRINK_SIDE_MENU_WIDTH = 105;
const EXPAND_MENU_WIDTH = 420;
const TOP_PADDING = 15;
const BOTTOM_PADDING = 15;
const MARGIN_LEFT = 20;
const MARGIN_RIGHT = 20;
const ZOOM_LEVEL = 25;


export default function Zoom(props) {
    // let ACTUAL_HEIGHT = props.stageHeight;
    // let ACTUAL_WIDTH = props.stageWidth;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedOption, setSelectedOption] = React.useState('Fit');

    const { stageRef, zoomLevel, setZoomLevel, selectedElement } = props;

    function handleClick(event) {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    }

    function handleClose(event) {
        setAnchorEl(null);
    }

    function changeSizeOfParentContainer(calZoom, parentWidth, parentHeight) {
        let stageContainer = document.getElementById('stage-container');
        if (stageContainer) {
            stageContainer.style.width = parentWidth + 'px';
            stageContainer.style.height = parentHeight + 'px';
        }
    }

    function zoomStage(calZoom) {
        if (!stageRef || !stageRef.current) return;
        stageRef.current.scaleX(calZoom);
        stageRef.current.scaleY(calZoom);
        let { verticalPadding, horizontalPadding, rectWidth, rectHeight, width, height, minVerticalPadding, minHorizontalPadding } = props.containerOffset;

        let calHorizonalPadding = horizontalPadding * calZoom;
        let calVerticalPadding = verticalPadding * calZoom;
        let x = ((width - rectWidth * calZoom) / 2) - calHorizonalPadding;
        let y = ((height - rectHeight * calZoom) / 2) - calVerticalPadding;

        x = Math.max(x, minHorizontalPadding - calHorizonalPadding);
        y = Math.max(y, minVerticalPadding - calVerticalPadding);

        stageRef.current.x(x);
        stageRef.current.y(y);
        stageRef.current.draw();

        let parentWidth = ((calHorizonalPadding + x) * 2) + (rectWidth * calZoom);
        let parentHeight = ((calVerticalPadding + y) * 2) + (rectHeight * calZoom);
        changeSizeOfParentContainer(calZoom, parentWidth, parentHeight);
    }

    function fitScreen() {
        let innerHeight = window.innerHeight -
            (TOP_PADDING + BOTTOM_PADDING + OPTION_WRAPPER_HEIGHT + TOP_MENU_HEIGHT) - 20;
        let calZoomLevel = innerHeight / ACTUAL_HEIGHT;
        setZoomLevel(calZoomLevel);
        //changeSizeOfParentContainer(calZoomLevel);
        zoomStage(calZoomLevel);
    }

    function fillScreen() {
        let width = document.documentElement.clientWidth;
        let innerWidth = (width < 720 ? width : document.documentElement.clientWidth -
            (selectedElement ? EXPAND_MENU_WIDTH : SHRINK_SIDE_MENU_WIDTH)) - MARGIN_LEFT - MARGIN_RIGHT - 20;

        let calZoomLevel = innerWidth / ACTUAL_WIDTH;
        setZoomLevel(calZoomLevel);
        //changeSizeOfParentContainer(calZoomLevel);
        zoomStage(calZoomLevel);
    }

    function handleMenuItemClick(option = selectedOption) {
        if (option === 'Fit') {
            fitScreen();
        } else if (option === 'Fill') {
            fillScreen();
        } else {
            let calZoom = option / ZOOM_LEVEL;
            setZoomLevel(calZoom);
            //changeSizeOfParentContainer(calZoom);
            zoomStage(calZoom);
        }
        setSelectedOption(option);
        setAnchorEl(null);
    }

    function resizeHandler() {
        if (selectedOption === 'Fit') {
            fitScreen();
        } else if (selectedOption === 'Fill') {
            fillScreen();
        }
    }

    React.useEffect(() => {
        if (!props.containerOffset.width) return;
        ACTUAL_WIDTH = props.containerOffset.width;
        ACTUAL_HEIGHT = props.containerOffset.height;
        handleMenuItemClick();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stageRef, props.containerOffset])

    React.useEffect(() => {
        window.addEventListener('resize', resizeHandler);
        return () => {
            window.removeEventListener('resize', resizeHandler);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stageRef, selectedOption])

    const open = Boolean(anchorEl);
    const id = open ? 'zoom-popover' : undefined;

    return (
        <div>
            <Button aria-describedby={id} variant="contained" onClick={handleClick}>
                {Math.round(zoomLevel * ZOOM_LEVEL) + '%'}
            </Button>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                ModalClasses={{ root: 'test' }}
            >
                <ClickAwayListener onClickAway={handleClose}>
                    <MenuList className="zoom-menu">
                        {options.map((option, index) => (
                            option !== 'line' ?
                                <MenuItem
                                    key={option}
                                    selected={option === selectedOption}
                                    onClick={event => handleMenuItemClick(option)}
                                >
                                    {typeof option === 'number' ? option + '%' : option}
                                </MenuItem> :
                                <div key="line">
                                    <hr className="seperator" />
                                </div>
                        ))}

                    </MenuList>
                </ClickAwayListener>
            </Popover>
        </div>
    );
}
