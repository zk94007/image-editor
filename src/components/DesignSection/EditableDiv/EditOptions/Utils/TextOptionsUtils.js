import React from 'react';
import { getCopyLayer, getPosition, getTransparency, getLock, getDelete, OPTION_POSITION, getFontSize, FONT_TYPE } from "./OptionsUtils";
import { EDIT_OPTIONS } from "./Options.enum";
import { getQuillContainer, getFormat, getFonts } from '../../../../../utilities/EditableDivUtil';
import { removeTempEditor } from './CommonUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold,
  faItalic,
  faUnderline,
  faFont
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@material-ui/core';
import FontStyleMobile from '../FontStyleMobile/FontStyleMobile';
import { ELEMENT_TRAY_TYPE } from '../../../ElementsPicker/ElementsPicker';
// import FontSize from '../FontSize/FontSize';

import unorderedListSvg from '../../../../../assets/img/unordered-list.svg';
import orderedListSvg from '../../../../../assets/img/ordered-list.svg';
import alignCenter from '../../../../../assets/img/align-center.svg';
import alignLeft from '../../../../../assets/img/align-left.svg';
import alignRight from '../../../../../assets/img/align-right.svg';
import alignJustify from '../../../../../assets/img/align-justify.svg';
import fontCase from '../../../../../assets/img/fontcase.svg';
import Spacing from '../Spacing/Spacing';
import { getZoomLevelFromStageRef } from '../EditOptionsUtil';
import ColorPickerMobile from '../ColorPickerMobile/ColorPickerMobile';


export const getTextOptions = (props, transparencyValue) => {
  let options = [
    getCopyLayer(props),
    getPosition(props),
    getTransparency(props, transparencyValue),
    getLock(props),
    getDelete(props),
    getFontBold(),
    getFontItalic(),
    getFontUnderline(),
    getFontFamily(props),
    getFontSize(FONT_TYPE.TEXT_FONT),
    getFontCase(),
    getTextList(),
    getTextAlignments(),
    getSpacingLayer(props),
    getTextColor(props)
  ]

  options.sort((prev, next) => {
    return prev.order - next.order;
  })
  return options;
}

export const getFontBold = () => {
  return {
    subType: EDIT_OPTIONS.BOLD,
    position: OPTION_POSITION.LEFT,
    order: 13,
    config: {
      clickHandler: () => {
        let quill = getQuillContainer();
        if (quill) {
          let format = quill.getFormat();
          quill.format('bold', !format.bold);
          removeTempEditor();
        }
      },
      content: () => {
        return <FontAwesomeIcon icon={faBold} size={"1x"} />
      }
    }
  }
}

export const getFontItalic = () => {
  return {
    subType: EDIT_OPTIONS.ITALIC,
    position: OPTION_POSITION.LEFT,
    order: 14,
    config: {
      clickHandler: () => {
        let quill = getQuillContainer();
        if (quill) {
          let format = quill.getFormat();
          quill.format('italic', !format.italic);
          removeTempEditor();
        }
      },
      content: () => {
        return <FontAwesomeIcon icon={faItalic} size={"1x"} />
      }
    }
  }
}

export const getFontUnderline = () => {
  return {
    subType: EDIT_OPTIONS.UNDERLINE,
    position: OPTION_POSITION.LEFT,
    order: 15,
    config: {
      clickHandler: () => {
        let quill = getQuillContainer();
        if (quill) {
          let format = quill.getFormat();
          quill.format('underline', !format.underline);
          removeTempEditor();
        }
      },
      content: () => {
        return <FontAwesomeIcon icon={faUnderline} size={"1x"} />
      }
    }
  }
}

export const getFontFamily = (props) => {
  return {
    subType: EDIT_OPTIONS.FONT_FAMILY,
    position: OPTION_POSITION.LEFT,
    order: 1,
    config: {
      clickHandler: () => { props.handleElementClick(ELEMENT_TRAY_TYPE.FONT_PICKER) },
      className: "font-change",
      content: () => {
        let label = "Arial";
        if (props.textEditMode) {
          let format = getFormat();
          if (format.font) {
            let font = getFonts(format.font);
            label = font ? font.label : label;
          }
        }
        return (
          <React.Fragment>
            <Button classes={{ root: 'web' }}>{label}</Button>
            <FontStyleMobile label={label}></FontStyleMobile>
          </React.Fragment>
        )
      }
    }
  }
}


/* export const getFontSize = () => {
  return {
    subType: EDIT_OPTIONS.FONT_SIZE,
    position: OPTION_POSITION.LEFT,
    order: 2,
    config: {
      clickHandler: () => { },
      disableHover: true,
      content: () => {
        return (
          <FontSize></FontSize>
        )
      }
    }
  }
} */

export const getSpacingLayer = (props) => {
  return {
    subType: EDIT_OPTIONS.TEXT_SPACING,
    position: OPTION_POSITION.LEFT,
    order: 19,
    config: {
      clickHandler: (e) => { },
      className: "spacing-layer",
      content: () => {
        return <Spacing zoomLevel={getZoomLevelFromStageRef(props.stageRef)} removeTempEditor={removeTempEditor}></Spacing>
      }
    }
  }
}

const handleFontCaseChange = (e) => {
  let quill = getQuillContainer();
  if (quill) {
    let format = quill.getFormat();
    if (format && format.texttransform === 'uppercase') {
      quill.format('texttransform', 'none');
    } else {
      quill.format('texttransform', 'uppercase');
    }
    removeTempEditor();
  }
}

export const getFontCase = () => {
  return {
    subType: EDIT_OPTIONS.FONT_CASE,
    position: OPTION_POSITION.LEFT,
    order: 17,
    config: {
      clickHandler: (e) => { handleFontCaseChange(e) },
      image: () => {
        return fontCase;
      },
      size: "2x",
      content: () => {
        return (
          <img src={fontCase} alt="fontChangeCase" height="20px" width="20px"></img>
        )
      }
    }
  }
}

export const getTextAlignments = () => {
  return {
    subType: EDIT_OPTIONS.TEXT_ALIGNMENTS,
    position: OPTION_POSITION.LEFT,
    order: 16,
    config: {
      clickHandler: e => {
        let quill = getQuillContainer();
        if (quill) {
          let format = quill.getFormat();
          if (format.align === 'center') {
            quill.format('align', '');
          } else if (format.align === 'justify') {
            quill.format('align', 'right');
          } else if (format.align === 'right') {
            quill.format('align', 'center');
          } else {
            quill.format('align', 'justify');
          }
          removeTempEditor();
        }
      },
      content: () => {
        let quill = getQuillContainer();
        let align = '';
        if (quill) {
          let format = quill.getFormat();
          align = format.align;
        }
        let svg;

        if (align === 'center') {
          svg = alignCenter;
        } else if (align === 'justify') {
          svg = alignJustify;
        } else if (align === 'right') {
          svg = alignRight;
        } else {
          svg = alignLeft;
        }

        return <img src={svg} alt="textAlignment" height="20px" width="20px"></img>

      }
    }
  }
}

export const getTextList = () => {
  return {
    subType: EDIT_OPTIONS.TEXT_LIST,
    position: OPTION_POSITION.LEFT,
    order: 18,
    config: {
      clickHandler: e => {

        let quill = getQuillContainer();
        if (quill) {
          let format = quill.getFormat();

          if (format.list === "ordered") {
            quill.format('list', null);
          } else if (format.list === "bullet") {
            quill.format('list', 'ordered');
          } else {
            quill.format('list', 'bullet');
          }
          removeTempEditor();
        }
      },
      content: () => {
        let svg = unorderedListSvg;
        let quill = getQuillContainer();
        if (quill) {
          let format = quill.getFormat();
          svg = format.list === "ordered" ? orderedListSvg : unorderedListSvg;
        }

        return <img src={svg} alt="textList" height="20px" width="20px"></img>
      }
    }
  }
}

export const getTextColor = (props) => {
  return {
    subType: EDIT_OPTIONS.COLOR,
    position: OPTION_POSITION.LEFT,
    order: 9,
    config: {
      clickHandler: () => { props.handleElementClick(ELEMENT_TRAY_TYPE.COLOR_PICKER) },
      content: () => {
        return (
          <React.Fragment>
            <span className="web">
              <FontAwesomeIcon icon={faFont} size={"1x"} />
            </span>
            <ColorPickerMobile></ColorPickerMobile>
          </React.Fragment>
        )
      }
    }
  }
}

