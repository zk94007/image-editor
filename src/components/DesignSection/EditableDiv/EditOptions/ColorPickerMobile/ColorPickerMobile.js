import React from 'react'
import Modal from '@material-ui/core/Modal';
import './ColorPickerMobile.scss';
// import ColorPickerTray from '../../../ElementsPicker/Elements/ColorPickerTray/ColorPickerTray';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFont } from '@fortawesome/free-solid-svg-icons';
import TextColorPickerTray from '../../../ElementsPicker/Elements/TextColorPickerTray/TextColorPickerTray';
import { ELEMENT_TRAY_TYPE } from '../../../ElementsPicker/ElementsPicker';
import ChartColorPickerTray from '../../../ElementsPicker/Elements/ColorPickerTray/ChartColorPickerTray/ChartColorPIckerTray';
// import { getContent } from '../Utils/ChartOptionsUtils';

export default function ColorPickerMobile(props) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getColorPickerTray = () => {
    let tray;
    switch (props.tray) {
      case ELEMENT_TRAY_TYPE.COLOR_PICKER:
        tray = <TextColorPickerTray></TextColorPickerTray>
        break;
      case ELEMENT_TRAY_TYPE.CHART_COLOR_PICKER:
        tray = <ChartColorPickerTray {...props}></ChartColorPickerTray>
        break;
      default:
        tray = <TextColorPickerTray></TextColorPickerTray>

    }
    return tray;
  }

  const getIcon = () => {
    return props.children || <FontAwesomeIcon icon={faFont} size={"2x"} />
  }

  return (
    <div className="color-picker-mobile">
      <div onClick={handleOpen}>
        {getIcon()}
      </div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div className='paper'>
          {getColorPickerTray()}
        </div>
      </Modal>
    </div>
  )
}
