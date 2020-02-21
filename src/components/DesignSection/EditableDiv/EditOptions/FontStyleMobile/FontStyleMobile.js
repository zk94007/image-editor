import React from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import './FontStyleMobile.scss';
import FontTray from '../../../ElementsPicker/Elements/FontTray/FontTray';

// const useStyles = makeStyles(theme => ({
//   paper: {
//     position: 'absolute',
//     width: '100%',
//     boxSizing: 'border-box',
//     bottom: '0',
//     backgroundColor: theme.palette.background.paper,
//     border: '2px solid #000',
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(2, 4, 4),
//   },
// }));

export default function FontStyleMobile(props) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <span className="font-style-mobile">
      <Button onClick={handleOpen}>{props.label}</Button>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div className='paper'>
          <FontTray></FontTray>
        </div>
      </Modal>
    </span>
  )
}
