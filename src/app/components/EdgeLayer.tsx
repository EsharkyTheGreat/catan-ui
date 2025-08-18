import { Layer, Line } from "react-konva";
import Konva from "konva";
import { CatanEdge } from "../lib/types";

type Props = {
  edges: CatanEdge[];
};

export default function EdgeLayer({ edges }: Props) {
  // Handle edge hover effects
  const handleEdgeMouseEnter = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const target = e.target as Konva.Shape;
    target.stroke("black");
    target.strokeWidth(4);
  };

  const handleEdgeMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const target = e.target as Konva.Shape;
    // Restore the original random color and stroke width
    const edgeIndex = parseInt(target.attrs.key?.split("-")[1] || "0");
    const originalEdge = edges[edgeIndex];
    if (originalEdge) {
      target.stroke(originalEdge.color);
      target.strokeWidth(2);
    }
  };

  return (
    <Layer>
      {/* Render edges as lines */}
      {edges.map((edge, index) => (
        <Line
          key={`edge-${index}`}
          points={[edge.startX, edge.startY, edge.endX, edge.endY]}
          stroke={edge.color}
          strokeWidth={2}
          onMouseEnter={handleEdgeMouseEnter}
          onMouseLeave={handleEdgeMouseLeave}
        />
      ))}
    </Layer>
  );
}
