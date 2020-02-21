import React from 'react';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import TransparencySvg from '../../../../../assets/img/transparency.svg';
import Slider from '@material-ui/core/Slider';
import './Transparency.scss';

export default function Transparency(props) {
  //const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [value, setValue] = React.useState(30);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event) => {
    // setValue(props.transparencyValue);
    if (props.shapeRef && props.shapeRef.current) {
      let current = props.shapeRef.current
      let value = current.attrs.opacity ? Math.round(current.attrs.opacity * 100) : 100;
      setValue(value);
      setAnchorEl(event.currentTarget);
    }
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleSliderChange = (event, newValue) => {
    let value = getValue(newValue);
    setValue(value);
    if (props.shapeRef && props.shapeRef.current) {
      props.shapeRef.current.opacity(newValue * 0.01);
      props.shapeRef.current.draw();
      props.stageRef.current.draw();
    }
  };

  const handleChangeCommitted = () => {
    props.setTransparencyValue(value);
  }

  const changeText = (e) => {
    let value = getValue(e.currentTarget.value);
    setValue(value);
    props.setTransparencyValue(value);
  }

  const getValue = (value) => {
    if (value === null || value === undefined) {
      return 0;
    }
    if (value > 100) {
      return 100;
    }
    if (value < 0) {
      return 0;
    }
    return value;
  }

  return (
    <React.Fragment>
      {/* <input type="button" aria-describedby={id} variant="contained" onClick={handleClick} value="Transparency" /> */}
      <Button onClick={handleClick}><img src={TransparencySvg} aria-describedby={id} variant="contained" alt="TransparencySvg" width={20} height={20}></img></Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {/* <Typography className={classes.typography}>The content of the Popover.</Typography> */}
        <div className='sliderContainer'>
          <label>Transparency</label>
          <Slider min={0} max={100} value={value} onChange={handleSliderChange} onChangeCommitted={handleChangeCommitted} aria-labelledby="continuous-slider" />
          <input className='textBox' onChange={changeText} type="number" value={value} min="0" max="100" />
        </div>
      </Popover>
    </React.Fragment>
  )
}
