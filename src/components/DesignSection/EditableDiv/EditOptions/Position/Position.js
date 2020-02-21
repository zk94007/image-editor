import React from 'react';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import './Position.scss';
import { handlePostionChange } from '../EditOptionsUtil';

export const LAYER_POSTION = {
  TOP: 'TOP',
  LEFT: 'LEFT',
  MIDDLE: 'MIDDLE',
  CENTRE: 'CENTRE',
  BOTTOM: 'BOTTOM',
  RIGHT: 'RIGHT'
}

export const Z_INDEX = {
  FORWARDS: 'FORWARDS',
  BACKWARDS: 'BACKWARDS',
  TO_FRONT: 'TO_FRONT',
  TO_BACK: 'TO_BACK'
}

export default function Position(props) {
  //const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  const changeLayerPosition = (position) => {
    handlePostionChange(position, props.layer, props.shapeRef, props.stageRef, props.onChange, props.containerOffset, props.zoomLevel);
  }

  const changeZIndex = (dir) => {
    var layer = [...props.layer];
    let index = -1;

    if (props.selectedGroupId) {
      index = layer.findIndex(l => l.id === props.selectedGroupId);
    } else {
      index = layer.findIndex(obj => obj.id === props.shapeRef.current.attrs.id);
    }
    if (index >= 0) {
      let obj = layer[index];

      if (index !== layer.length - 1 && dir === Z_INDEX.FORWARDS) {
        layer.splice(index, 1);
        layer.splice(index + 1, 0, obj);
      } else if (index !== layer.length - 1 && dir === Z_INDEX.TO_FRONT) {
        layer.splice(index, 1);
        layer.push(obj);
      } else if (index > 0 && dir === Z_INDEX.BACKWARDS) {
        layer.splice(index, 1);
        layer.splice(index - 1, 0, obj);
      } else if (index > 0 && dir === Z_INDEX.TO_BACK) {
        layer.splice(index, 1);
        layer.unshift(obj);
      }
      //props.onDeselect();
    }
    props.onChange(layer)
  }

  return (
    <React.Fragment>
      <Button onClick={handleClick}>Position</Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div className="position-container">
          <div className="row">
            <div className="col"><Button fullWidth={true} onClick={() => changeZIndex(Z_INDEX.FORWARDS)}>Forwards</Button></div>
            <div className="col"><Button fullWidth={true} onClick={() => changeZIndex(Z_INDEX.BACKWARDS)}>Backwards</Button></div>
          </div>
          <div className="row">
            <div className="col"><Button fullWidth={true} onClick={() => changeZIndex(Z_INDEX.TO_FRONT)}>To Front</Button></div>
            <div className="col"><Button fullWidth={true} onClick={() => changeZIndex(Z_INDEX.TO_BACK)}>To Back</Button></div>
          </div>
          <div className='heading'>
            <span >Align To Page</span>
          </div>
          <div className="row">
            <div className="col"><Button fullWidth={true} onClick={() => changeLayerPosition(LAYER_POSTION.TOP)}>Top</Button></div>
            <div className="col"><Button fullWidth={true} onClick={() => changeLayerPosition(LAYER_POSTION.LEFT)}>Left</Button></div>
          </div>
          <div className="row">
            <div className="col"><Button fullWidth={true} onClick={() => changeLayerPosition(LAYER_POSTION.MIDDLE)}>Middle</Button></div>
            <div className="col"><Button fullWidth={true} onClick={() => changeLayerPosition(LAYER_POSTION.CENTRE)}>Center</Button></div>
          </div>
          <div className="row">
            <div className="col"><Button fullWidth={true} onClick={() => changeLayerPosition(LAYER_POSTION.BOTTOM)}>Bottom</Button></div>
            <div className="col"><Button fullWidth={true} onClick={() => changeLayerPosition(LAYER_POSTION.RIGHT)}>Right</Button></div>
          </div>
        </div>
      </Popover>
    </React.Fragment>
  )
}
