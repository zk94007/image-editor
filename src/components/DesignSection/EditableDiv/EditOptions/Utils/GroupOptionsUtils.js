import { getPosition, getDelete, getLock, getTransparency, getCopyLayer } from "./OptionsUtils";

export const getGroupOptions = (props, transparencyValue) => {
  let options = [
    getTransparency(props, transparencyValue),
    getLock(props),
    getDelete(props),
    getPosition(props),
    getCopyLayer(props)
  ]

  options.sort((prev, next) => {
    return prev.order - next.order;
  })
  return options;
}