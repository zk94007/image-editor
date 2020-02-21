import React from 'react'
import { getQuillContainer, getFonts, createAndDispatchEvent } from '../../../../../utilities/EditableDivUtil';
import Button from '@material-ui/core/Button';
import Quill from 'quill';
import './FontTray.scss';

export default function FontTray() {
  const [font, setFont] = React.useState({label: "Arial", font: "arial"});
  const fonts = getFonts();

  const registerFontSize = () => {
    const Parchment = Quill.import('parchment');

    var Font = Quill.import('attributors/style/font');
    let whiteListFontList = fonts.map(fontObj => fontObj.font);
    Font.scope = Parchment.Scope.BLOCK;
    Font.whitelist = whiteListFontList;
    Quill.register(Font, true);
  }

  React.useEffect(() => {
    registerFontSize();
  }, [])

  const changeFont = (fontObj) => {
    setFont(fontObj);

    let quill = getQuillContainer();
    if (quill) {
      quill.format('font', fontObj.font);
      createAndDispatchEvent({ font: fontObj.font }, 'formatChanged');
      setTimeout(() => {
        createAndDispatchEvent({ shouldCreate: true }, 'removeTempEditor');
      }, 0)
    }
  }
  return (
    <div className="font-container" id="font-container">
      <div className="font-tray">
        {
          fonts.map((fontObj, index) => {
            return <Button className="fontButton" fullWidth={true} key={index} onClick={() => { changeFont(fontObj) }}>{fontObj.label}</Button>
          })
        }

      </div>

    </div >
  )
}
