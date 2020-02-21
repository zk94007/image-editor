import React from "react";
import "./ShapesTray.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareFull, faCircle } from "@fortawesome/free-solid-svg-icons";
import Chart from "../../../../shared/chart/Chart";
import { CHART_TYPE } from "../../../../shared/chart/ChartEnums";
import { ELEMENT_SUB_TYPE } from "../../ElementsPicker";

function ShapesTray(props) {
  return (
    <div className="elements-tray">
      <div
        className="elements-rect"
        onClick={() =>
          props.handleAddElement({
            type: "Rect",
            subType: ELEMENT_SUB_TYPE.RECT,
            value: undefined
          })
        }
      >
        <FontAwesomeIcon icon={faSquareFull} size="6x" />
      </div>
      <div
        className="elements-circle"
        onClick={() =>
          props.handleAddElement({
            type: "Circle",
            subType: ELEMENT_SUB_TYPE.CIRCLE,
            value: undefined
          })
        }
      >
        <FontAwesomeIcon icon={faCircle} size="6x" />
      </div>
      {/* <StackBarChartVertical {...props}></StackBarChartVertical>
      <StackBarChartHorizontal {...props}></StackBarChartHorizontal> */}
      <Chart {...props} chartType={CHART_TYPE.VERTICAL_BAR_CHART}></Chart>
      <Chart {...props} chartType={CHART_TYPE.HORIZONTAL_BAR_CHART}></Chart>
      <Chart {...props} chartType={CHART_TYPE.PIE_CHART}></Chart>
      <Chart {...props} chartType={CHART_TYPE.LINE_CHART}></Chart>
      <div className="chart-container">
        <svg id="chart-svg"></svg>
      </div>
    </div>
  );
}

export default ShapesTray;
