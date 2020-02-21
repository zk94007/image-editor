import React from 'react';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
// import Slider from '@material-ui/core/Slider';
import './Spacing.scss';
import AnchorDown from '../../../../../assets/img/anchor-down.svg';
import AnchorUp from '../../../../../assets/img/anchor-top.svg';
import AnchorCenter from '../../../../../assets/img/anchor-center.svg';
import { changeTopOfEditableDiv, getQuillContainer, createAndDispatchEvent } from '../../../../../utilities/EditableDivUtil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import Quill from 'quill';

export const ANCHOR_POSITION = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  CENTRE: 'CENTRE'
}
export default function Spacing(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [letterSpacing, setLetterSpacing] = React.useState(0);
  const [changeDivTop, setChangeDivTop] = React.useState();
  const [lineHeight, setLineHeight] = React.useState(1.4);
  const [anchorPosition, setAnchorPosition] = React.useState(ANCHOR_POSITION.BOTTOM);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  React.useEffect(() => {

    registerLineHeight();
    registerLetterSpacing();
  }, []);

  const handleClick = (event) => {
    let quill = getQuillContainer();
    if (quill) {
      let format = quill.getFormat();
      let letterSpacing = parseFloat(format.letterspacing) || 0;
      let lineheight = parseFloat(format.lineheight) || 1.4;
      setLetterSpacing(letterSpacing * 1000);
      setLineHeight(lineheight);
    }

    let callback = changeTopOfEditableDiv(props.zoomLevel);
    setChangeDivTop({ callback: callback });
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  const registerLetterSpacing = () => {
    const Parchment = Quill.import('parchment');

    const config = {
      scope: Parchment.Scope.BLOCK,
      whitelist: null
    };

    var style = new Parchment.Attributor.Style('letterspacing', 'letter-spacing', config);
    Quill.register(style, true);
  }

  const registerLineHeight = () => {
    const Parchment = Quill.import('parchment');

    const config = {
      scope: Parchment.Scope.BLOCK,
      whitelist: null
    };
    var lineHeightStyle = new Parchment.Attributor.Style('lineheight', 'line-height', config);
    Quill.register(lineHeightStyle, true);
  }

  const addStyle = (styleName, value) => {
    let quill = getQuillContainer();
    if (quill) {
      quill.format(styleName, value + 'em');
    }
    changeDivTop.callback(anchorPosition);
  }

  const modifyLetterSpacing = (newValue) => {
    let value = letterSpacing + newValue;
    addStyle('letterspacing', value * 0.001);
    setLetterSpacing(value);
    setTimeout(() => {
      createAndDispatchEvent({ shouldCreate: true }, 'removeTempEditor');
    }, 0)
  }

  const modifyLineHeight = (newValue) => {
    let value = (lineHeight + newValue);
    addStyle('lineheight', value);
    setLineHeight(value);
    setTimeout(() => {
      createAndDispatchEvent({ shouldCreate: true }, 'removeTempEditor');
    }, 0)
  }

  return (
    <React.Fragment>
      <Button onClick={handleClick}>Spacing</Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {/* <div className='sliderContainer'>
          <label>Letter</label>
          <Slider min={-200} max={800} value={letterSpacing} onChange={handleLetterSpacingChange} aria-labelledby="continuous-slider" />
          <label>{letterSpacing}</label>
        </div>
        <div className='sliderContainer'>
          <label>Line height</label>
          <Slider min={0.5} max={2.5} step={0.1} value={lineHeight} onChange={handleLineHeightChange} aria-labelledby="continuous-slider" />
          <label>{lineHeight}</label>
          <button onClick={() => modifyLetterSpacing(20)}>add</button>
        </div> */}
        <div className="spacing-container">
          <div className="labels">
            <label>Letter</label>
            <label>Line height</label>
          </div>
          <div className="modifiers">
            <div>
              <FontAwesomeIcon icon={faPlusCircle} size={"2x"} onClick={() => {
                if (letterSpacing >= 800) return;
                modifyLetterSpacing(20);
              }}></FontAwesomeIcon>
              <FontAwesomeIcon icon={faMinusCircle} size={"2x"} onClick={() => {
                if (letterSpacing <= -200) return;
                modifyLetterSpacing(-20)
              }}></FontAwesomeIcon>
              <label>{letterSpacing}</label>
            </div>
            <div>
              <FontAwesomeIcon icon={faPlusCircle} size={"2x"} onClick={() => {
                if (lineHeight >= 2.5) return;
                modifyLineHeight(0.1);
              }}></FontAwesomeIcon>
              <FontAwesomeIcon icon={faMinusCircle} size={"2x"} onClick={() => {
                if (lineHeight <= 0.5) return;
                modifyLineHeight(-0.1)
              }}></FontAwesomeIcon>
              <label>{lineHeight.toFixed(1)}</label>
            </div>
          </div>
        </div>

        <hr />
        <div className="anchor-text">
          <label>Anchor Text Box</label>
          <div>
            <img src={AnchorDown} alt="bottom"
              className={anchorPosition === ANCHOR_POSITION.BOTTOM ? 'selected' : ''}
              onClick={() => setAnchorPosition(ANCHOR_POSITION.BOTTOM)}></img>
            <img src={AnchorCenter} alt="Center"
              className={anchorPosition === ANCHOR_POSITION.CENTRE ? 'selected' : ''}
              onClick={() => setAnchorPosition(ANCHOR_POSITION.CENTRE)}></img>
            <img src={AnchorUp} alt="Up"
              className={anchorPosition === ANCHOR_POSITION.TOP ? 'selected' : ''}
              onClick={() => setAnchorPosition(ANCHOR_POSITION.TOP)}></img>
          </div>
        </div>
      </Popover>
    </React.Fragment>
  )
}
