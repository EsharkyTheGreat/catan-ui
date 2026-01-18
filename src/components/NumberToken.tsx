import React from "react";
import { Group, Rect, Text, Circle } from "react-konva";

type NumberTokenProps = {
  number: number; // e.g. 3, 6, 8
  x: number; // center position
  y: number;
  size?: number; // width/height of the box
};

export default function NumberToken({
  number,
  x,
  y,
  size = 20,
}: NumberTokenProps) {
  // spacing for dots
  const dotCount =
    number === 6 || number === 8
      ? 5
      : number === 5 || number === 9
      ? 4
      : number === 4 || number === 10
      ? 3
      : number === 3 || number === 11
      ? 2
      : number === 2 || number === 12
      ? 1
      : 0;

  const dotSpacing = 2;

  return (
    <Group x={x} y={y} listening={false}>
      {/* background rect */}
      <Rect
        x={-size / 2}
        y={+size * 0.15}
        width={size}
        height={size}
        cornerRadius={3}
        fill="white"
        stroke="black"
        strokeWidth={2}
        // shadowBlur={4}
      />

      {/* number text */}
      <Text
        text={number.toString()}
        fontSize={size / 2}
        fontStyle="bold"
        fill="green"
        align="center"
        verticalAlign="middle"
        width={size}
        height={size / 2}
        stroke="green"
        strokeWidth={0.5}
        y={+size / 3}
        x={-size / 2}
      />

      {/* probability dots */}
      <Group y={size * 1.0}>
        {Array.from({ length: dotCount }).map((_, i) => (
          <Circle
            key={i}
            radius={1}
            fill="black"
            x={(i - (dotCount - 1) / 2) * dotSpacing}
            y={0}
          />
        ))}
      </Group>
    </Group>
  );
}
