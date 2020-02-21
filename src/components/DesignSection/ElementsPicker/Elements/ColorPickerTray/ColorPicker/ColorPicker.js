import React from 'react';
import Popover from '@material-ui/core/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ChromePicker } from 'react-color';
import './ColorPicker.scss';
import { saveSelection, restoreSelection, getQuillContainer } from '../../../../../../utilities/EditableDivUtil';

export default function ColorPicker(props) {
  //const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selection, setSelection] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'color-popover' : undefined;

  const handleClick = (event) => {
    let quill = getQuillContainer();
    if (quill) {
      let format = quill.getFormat();
      props.setColor(format.color);
    }
    setSelection(saveSelection());
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setSelection(null);
    setAnchorEl(null);
  }

  const handleChangeComplete = (color) => {
    restoreSelection(selection);
    props.changeColor(color.hex);
    setSelection(saveSelection());
  };

  React.useState(() => {

  }, []);

  return (
    <React.Fragment>
      <button className="colorButton" onClick={(e) => { handleClick(e); }} >
        <div className="add-icon-container">
          <FontAwesomeIcon icon={faPlus} size={"2x"} />
        </div>
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {
          anchorEl &&
          <div className='color-picker-container'>
            <ChromePicker
              onLoad={() => { console.log('loaded....') }}
              color={props.color}
              disableAlpha={true}
              onChangeComplete={handleChangeComplete}>
            </ChromePicker>
          </div>
        }

      </Popover>
    </React.Fragment>
  )
}
