import { getTransparency, getLock, getDelete } from "./OptionsUtils";

export const getBackgroundOptions = (props, transparencyValue) => {
  let options = [
    getTransparency(props, transparencyValue),
    getLock(props),
    getDelete(props),
  ]

  options.sort((prev, next) => {
    return prev.order - next.order;
  })
  return options;
}