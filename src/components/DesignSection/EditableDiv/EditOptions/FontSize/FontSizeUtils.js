import { findElementWithStyle, getParent } from "../../../../../utilities/EditableDivUtil";

export const initFontSizeForText = (setFontSize) => {
  let element = findElementWithStyle(getParent(), 'fontSize');
  if (element) {
    setFontSize(parseFloat(element.style.fontSize));
  }
}

export const initFontSizeForChart = () => {

}