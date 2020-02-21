webpackHotUpdate("main",{

/***/ "./src/components/DesignSection/EditableDiv/EditOptions/Utils/OptionsUtils.js":
/*!************************************************************************************!*\
  !*** ./src/components/DesignSection/EditableDiv/EditOptions/Utils/OptionsUtils.js ***!
  \************************************************************************************/
/*! exports provided: OPTION_POSITION, FONT_TYPE, getCopyLayer, getPosition, getTransparency, getLock, getFlipHorizontal, getFlipVertical, getCropStart, getCropSave, getCropCancel, getDelete, getFontSize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OPTION_POSITION", function() { return OPTION_POSITION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FONT_TYPE", function() { return FONT_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCopyLayer", function() { return getCopyLayer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPosition", function() { return getPosition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTransparency", function() { return getTransparency; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLock", function() { return getLock; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFlipHorizontal", function() { return getFlipHorizontal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFlipVertical", function() { return getFlipVertical; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCropStart", function() { return getCropStart; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCropSave", function() { return getCropSave; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCropCancel", function() { return getCropCancel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDelete", function() { return getDelete; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFontSize", function() { return getFontSize; });
/* harmony import */ var _home_osboxes_development_react_smb2_image_editor_repo_node_modules_babel_runtime_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/objectSpread */ "./node_modules/@babel/runtime/helpers/esm/objectSpread.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _material_ui_core_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/core/Button */ "./node_modules/@material-ui/core/esm/Button/index.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.es.js");
/* harmony import */ var _Options_enum__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Options.enum */ "./src/components/DesignSection/EditableDiv/EditOptions/Utils/Options.enum.js");
/* harmony import */ var _Position_Position__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Position/Position */ "./src/components/DesignSection/EditableDiv/EditOptions/Position/Position.js");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "./node_modules/@fortawesome/react-fontawesome/index.es.js");
/* harmony import */ var _CommonUtils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./CommonUtils */ "./src/components/DesignSection/EditableDiv/EditOptions/Utils/CommonUtils.js");
/* harmony import */ var _Transparency_Transparency__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Transparency/Transparency */ "./src/components/DesignSection/EditableDiv/EditOptions/Transparency/Transparency.js");
/* harmony import */ var _DeleteLayer_DeleteLayer__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../DeleteLayer/DeleteLayer */ "./src/components/DesignSection/EditableDiv/EditOptions/DeleteLayer/DeleteLayer.js");
/* harmony import */ var _FontSize_FontSize__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../FontSize/FontSize */ "./src/components/DesignSection/EditableDiv/EditOptions/FontSize/FontSize.js");

var _jsxFileName = "/home/osboxes/development/react/smb2-image-editor-repo/src/components/DesignSection/EditableDiv/EditOptions/Utils/OptionsUtils.js";










const OPTION_POSITION = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
};
const FONT_TYPE = {
  TEXT_FONT: 'TEXT_FONT',
  CHART_FONT: 'CHART_FONT'
};
const getCopyLayer = props => {
  return {
    subType: _Options_enum__WEBPACK_IMPORTED_MODULE_4__["EDIT_OPTIONS"].COPY_LAYER,
    position: OPTION_POSITION.RIGHT,
    hideOnEditMode: true,
    order: 21,
    config: {
      clickHandler: () => {
        props.copyAndPasteLayer();
      },
      content: () => {
        return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core_Button__WEBPACK_IMPORTED_MODULE_2__["default"], {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 38
          },
          __self: undefined
        }, "Copy");
      }
    }
  };
};
const getPosition = props => {
  return {
    subType: _Options_enum__WEBPACK_IMPORTED_MODULE_4__["EDIT_OPTIONS"].POSITION,
    position: OPTION_POSITION.RIGHT,
    order: 22,
    hideOnEditMode: true,
    config: {
      clickHandler: () => {},
      className: "position-layer",
      content: () => {
        return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_Position_Position__WEBPACK_IMPORTED_MODULE_5__["default"], {
          stageRef: props.stageRef,
          onChange: props.onChange,
          layer: props.layer,
          selectedGroupId: props.selectedGroupId,
          shapeRef: props.shapeRef,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 54
          },
          __self: undefined
        });
      }
    }
  };
};
const getTransparency = (props, transparencyValue) => {
  return {
    subType: _Options_enum__WEBPACK_IMPORTED_MODULE_4__["EDIT_OPTIONS"].TRANSPARENCEY,
    position: OPTION_POSITION.RIGHT,
    hideOnEditMode: true,
    order: 23,
    config: {
      clickHandler: e => {},
      content: () => {
        return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_Transparency_Transparency__WEBPACK_IMPORTED_MODULE_8__["default"], {
          shapeRef: props.shapeRef,
          stageRef: props.stageRef,
          setTransparencyValue: value => updateTransparency(value, props),
          transparencyValue: transparencyValue,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 74
          },
          __self: undefined
        });
      }
    }
  };
};
const getLock = props => {
  return {
    subType: _Options_enum__WEBPACK_IMPORTED_MODULE_4__["EDIT_OPTIONS"].LOCK_LAYER,
    position: OPTION_POSITION.RIGHT,
    showWhenLock: true,
    hideOnEditMode: true,
    order: 24,
    config: {
      clickHandler: () => {
        handleLockLayer(props);
      },
      icon: Object(_CommonUtils__WEBPACK_IMPORTED_MODULE_7__["isLayerLocked"])(props) ? _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__["faLock"] : _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__["faUnlockAlt"],
      size: "2x",
      content: () => {
        let icon = Object(_CommonUtils__WEBPACK_IMPORTED_MODULE_7__["isLayerLocked"])(props) ? _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__["faLock"] : _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__["faUnlockAlt"];
        return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_6__["FontAwesomeIcon"], {
          icon: icon,
          size: "2x",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 98
          },
          __self: undefined
        });
      }
    }
  };
};
const getFlipHorizontal = props => {
  return {
    subType: _Options_enum__WEBPACK_IMPORTED_MODULE_4__["EDIT_OPTIONS"].FLIP_HORIZONTAL,
    position: OPTION_POSITION.LEFT,
    order: 10,
    config: {
      clickHandler: () => {
        handleFlip("horizontal", props);
      },
      attrs: {
        rotation: 90
      },
      content: () => {
        return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_6__["FontAwesomeIcon"], {
          icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__["faSort"],
          size: "2x",
          rotation: 90,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 117
          },
          __self: undefined
        });
      }
    }
  };
};
const getFlipVertical = props => {
  return {
    subType: _Options_enum__WEBPACK_IMPORTED_MODULE_4__["EDIT_OPTIONS"].FLIP_VERTICAL,
    position: OPTION_POSITION.LEFT,
    order: 11,
    config: {
      clickHandler: () => {
        handleFlip("vertical", props);
      },
      content: () => {
        return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_6__["FontAwesomeIcon"], {
          icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__["faSort"],
          size: "2x",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 134
          },
          __self: undefined
        });
      }
    }
  };
};
const getCropStart = props => {
  return {
    subType: _Options_enum__WEBPACK_IMPORTED_MODULE_4__["EDIT_OPTIONS"].CROP_START,
    position: OPTION_POSITION.LEFT,
    order: 12,
    config: {
      clickHandler: () => {
        handleCropStart(props);
      },
      content: () => {
        return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_6__["FontAwesomeIcon"], {
          icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__["faCrop"],
          size: "2x",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 151
          },
          __self: undefined
        });
      }
    }
  };
};
const getCropSave = props => {
  return {
    subType: _Options_enum__WEBPACK_IMPORTED_MODULE_4__["EDIT_OPTIONS"].CROP_SAVE,
    position: OPTION_POSITION.LEFT,
    order: 13,
    config: {
      clickHandler: () => {
        console.log(props);
      },
      content: () => {
        return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_6__["FontAwesomeIcon"], {
          icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__["faCheck"],
          size: "2x",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 168
          },
          __self: undefined
        });
      }
    }
  };
};
const getCropCancel = props => {
  return {
    subType: _Options_enum__WEBPACK_IMPORTED_MODULE_4__["EDIT_OPTIONS"].CROP_CANCEL,
    position: OPTION_POSITION.LEFT,
    order: 14,
    config: {
      clickHandler: () => {
        console.log(props);
      },
      content: () => {
        return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_6__["FontAwesomeIcon"], {
          icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__["faTimes"],
          size: "2x",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 185
          },
          __self: undefined
        });
      }
    }
  };
};
const getDelete = props => {
  return {
    subType: _Options_enum__WEBPACK_IMPORTED_MODULE_4__["EDIT_OPTIONS"].DELETE_LAYER,
    position: OPTION_POSITION.LEFT,
    hideOnEditMode: true,
    order: 20,
    config: {
      clickHandler: () => {},
      content: () => {
        return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_DeleteLayer_DeleteLayer__WEBPACK_IMPORTED_MODULE_9__["default"], Object.assign({}, props, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 202
          },
          __self: undefined
        }));
      }
    }
  };
};

const filp = (layerList, direction, props) => {
  var layer = [...layerList];
  var index = Object(_CommonUtils__WEBPACK_IMPORTED_MODULE_7__["findIndex"])(layer, props);

  if (index >= 0) {
    let copyChild = Object(_home_osboxes_development_react_smb2_image_editor_repo_node_modules_babel_runtime_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_0__["default"])({}, layer[index]);

    if (direction === "vertical") {
      copyChild.scaleY = -copyChild.scaleY;
    } else if (direction === "horizontal") {
      copyChild.scaleX = -copyChild.scaleX;
    }

    layer[index] = copyChild;
  }

  return layer;
};

function handleFlip(direction, props) {
  let groupIndex = Object(_CommonUtils__WEBPACK_IMPORTED_MODULE_7__["findGroupIndex"])(props.layer, props);

  if (groupIndex >= 0) {
    let layerList = [...props.layer];

    let groupLayer = Object(_home_osboxes_development_react_smb2_image_editor_repo_node_modules_babel_runtime_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_0__["default"])({}, layerList[groupIndex]);

    groupLayer.childElements = filp(groupLayer.childElements, direction, props);
    layerList[groupIndex] = groupLayer;
    props.onChange(layerList);
  } else {
    props.onChange(filp(props.layer, direction, props));
  }
}

function handleCropStart(props) {
  var groupIndex = null;
  var layer = [...props.layer];
  var index = layer.findIndex(obj => obj.id === props.shapeRef.current.attrs.id);

  if (index === -1) {
    groupIndex = layer.findIndex(layer => layer.id === props.selectedGroupId);
    var groupLayer = [...layer[groupIndex].childElements];
    index = groupLayer.findIndex(obj => obj.id === props.shapeRef.current.attrs.id);
  }

  props.onCropStart(index, groupIndex);
}

const updateTransparency = (calOpacity, props) => {
  if (props.shapeRef && props.shapeRef.current) {
    let obj = Object(_CommonUtils__WEBPACK_IMPORTED_MODULE_7__["findLayer"])(props.layer, props);

    if (obj) {
      let index = Object(_CommonUtils__WEBPACK_IMPORTED_MODULE_7__["findIndex"])(props.layer, props);

      let copyObj = Object(_home_osboxes_development_react_smb2_image_editor_repo_node_modules_babel_runtime_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_0__["default"])({}, obj);

      copyObj.opacity = calOpacity * 0.01;
      let copyLayer = [...props.layer];

      if (copyObj.isChildren) {
        let parentIndex = props.layer.findIndex(l => copyObj.parentId === l.id);

        let parent = Object(_home_osboxes_development_react_smb2_image_editor_repo_node_modules_babel_runtime_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_0__["default"])({}, props.layer[parentIndex]);

        parent.childElements = [...parent.childElements];
        parent.childElements[index] = copyObj;
        copyLayer[parentIndex] = parent;
      } else {
        copyLayer[index] = copyObj;
      }

      props.onChange(copyLayer);
    }
  }
};

function handleLockLayer(props) {
  let groupIndex = Object(_CommonUtils__WEBPACK_IMPORTED_MODULE_7__["findGroupIndex"])(props.layer, props);

  if (groupIndex >= 0) {
    let layerList = [...props.layer];

    let groupLayer = Object(_home_osboxes_development_react_smb2_image_editor_repo_node_modules_babel_runtime_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_0__["default"])({}, layerList[groupIndex]);

    groupLayer.locked = !groupLayer.locked;
    groupLayer.childElements = lockLayers(groupLayer.childElements, props);
    layerList[groupIndex] = groupLayer;
    props.onChange(layerList);
  } else {
    props.onChange(lockLayers(props.layer, props));
  }
}

const lockLayers = (layers, props) => {
  var copyLayerList = [...layers];

  for (let i = 0; i < copyLayerList.length; i++) {
    let copyLayer = Object(_home_osboxes_development_react_smb2_image_editor_repo_node_modules_babel_runtime_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_0__["default"])({}, copyLayerList[i]);

    if (copyLayer.type === 'Group') {
      let returnChildElements = lockLayers(copyLayer.childElements);

      if (returnChildElements) {
        copyLayer.childElements = returnChildElements;
      }

      copyLayerList[i] = copyLayer;
      copyLayer.locked = !copyLayer.locked;
    } else {
      if (copyLayer.id === props.shapeRef.current.attrs.id || copyLayer.isChildren) {
        copyLayer.locked = !copyLayer.locked;
        copyLayerList[i] = copyLayer;
      }
    }
  }

  return copyLayerList;
};

const getFontSize = (fontType, props = {}) => {
  return {
    subType: _Options_enum__WEBPACK_IMPORTED_MODULE_4__["EDIT_OPTIONS"].FONT_SIZE,
    position: OPTION_POSITION.LEFT,
    order: 2,
    config: {
      clickHandler: () => {},
      disableHover: true,
      content: () => {
        return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_FontSize_FontSize__WEBPACK_IMPORTED_MODULE_10__["default"], Object.assign({
          fontType: fontType
        }, props, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 325
          },
          __self: undefined
        }));
      }
    }
  };
};

/***/ })

})
//# sourceMappingURL=main.315cd7f674fec7b7022a.hot-update.js.map