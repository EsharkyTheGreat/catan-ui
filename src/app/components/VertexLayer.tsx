import { Layer, Circle } from "react-konva";
import Konva from "konva";
import { useGameStore } from "../store/GameState";


export default function VertexLayer() {
  const {vertices} = useGameStore();
  // Handle vertex hover effects
  const handleVertexMouseEnter = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const target = e.target as Konva.Shape;
    target.stroke("black");
    target.strokeWidth(3);
  };

  const handleVertexMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const target = e.target as Konva.Shape;
    target.stroke("#D63031");
    target.strokeWidth(1);
  };

  return (
    <Layer>
      {/* Render vertices as circles */}
      {vertices.map((vertex, index) => (
        <Circle
          key={`vertex-${index}`}
          x={vertex.x}
          y={vertex.y}
          radius={5}
          fill="#FF6B6B"
          stroke="#D63031"
          strokeWidth={1}
          onMouseEnter={handleVertexMouseEnter}
          onMouseLeave={handleVertexMouseLeave}
        />
      ))}
    </Layer>
  );
}
