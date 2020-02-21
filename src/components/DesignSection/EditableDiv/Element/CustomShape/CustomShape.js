import React from 'react';
import { Shape } from 'react-konva';
import { ELEMENT_SUB_TYPE } from '../../../ElementsPicker/ElementsPicker';

const EXTRA_PADDING = 2000;

export default function CustomShape(props) {
  let { width, height, verticalPadding, horizontalPadding } = props.containerOffset;

  return (
    <Shape
      listening={true}
      subType={ELEMENT_SUB_TYPE.CUSTOM_SHAPE}
      sceneFunc={function (context, shape) {
        context.fillStyle = '#e8e8e8';
        context.fillRect(-EXTRA_PADDING, -EXTRA_PADDING, width + EXTRA_PADDING, verticalPadding + EXTRA_PADDING);
        context.fillRect(
          width - horizontalPadding,
          -EXTRA_PADDING,
          horizontalPadding + EXTRA_PADDING,
          height + EXTRA_PADDING
        )
        context.fillRect(
          -EXTRA_PADDING,
          height - verticalPadding,
          width + EXTRA_PADDING + EXTRA_PADDING,
          verticalPadding + EXTRA_PADDING
        );

        context.fillRect(-EXTRA_PADDING, -EXTRA_PADDING, horizontalPadding + EXTRA_PADDING, height + EXTRA_PADDING);
        // context.fillStyle = 'green';
        // context.fillRect(horizontalPadding, verticalPadding, 250, 400);
      }}
      hitFunc={function (context, shape) {
        context.beginPath();
        context.rect(-EXTRA_PADDING, -EXTRA_PADDING, width + EXTRA_PADDING, verticalPadding + EXTRA_PADDING);
        context.rect(
          width - horizontalPadding,
          -EXTRA_PADDING,
          horizontalPadding + EXTRA_PADDING,
          height + EXTRA_PADDING
        );
        context.rect(
          -EXTRA_PADDING,
          height - verticalPadding,
          width + EXTRA_PADDING + EXTRA_PADDING,
          verticalPadding + EXTRA_PADDING
        );
        context.rect(-EXTRA_PADDING, -EXTRA_PADDING, horizontalPadding + EXTRA_PADDING, height + EXTRA_PADDING);
        context.closePath();
        context.fillStrokeShape(shape);
      }}
    />
  )
}
