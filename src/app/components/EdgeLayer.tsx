import { Layer, Line } from "react-konva";
import Konva from "konva";
import { CatanEdgePosition } from "../lib/types";
import { useGameStore } from "../store/GameState";
import { useState } from "react";

export default function EdgeLayer() {
  const { phase, buildRoad, edges } = useGameStore();
  const [hoveredEdgeIndex, setHoveredEdgeIndex] = useState<number | null>(null);

  // Handle edge hover effects
  const handleEdgeMouseEnter = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const target = e.target as Konva.Line;
    target.stroke("black");
    target.strokeWidth(4);
    
    // Get the edge index from the key
    const edgeIndex = target.index;
    setHoveredEdgeIndex(edgeIndex);
  };

  const handleEdgeMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const target = e.target as Konva.Line;
    // Restore the original random color and stroke width
    const edgeIndex = target.index;
    const originalEdge = edges[edgeIndex];
    if (originalEdge) {
      target.stroke(originalEdge.color);
      target.strokeWidth(2);
    }
    setHoveredEdgeIndex(null);
  };

  const handleEdgeMouseClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const target = e.target as Konva.Line;
    const edgeIndex = target.index;
    buildRoad(edgeIndex)
  }

  return (
    <Layer>
      {/* Render edges as lines */}
      {edges.map((edge, index) => {
        // Determine opacity based on ownership and hover state
        let opacity = 0;
        if (edge.data.owner !== null) {
          opacity = 1; // Full opacity for owned edges
        } else if (hoveredEdgeIndex === index && phase === "road_placement") {
          opacity = 0.7; // 0.7 opacity on hover during road placement phase
        }
        // Default is 0 for unowned edges

        return (
          <Line
            key={`edge-${index}`}
            points={[edge.startX, edge.startY, edge.endX, edge.endY]}
            stroke={edge.color}
            opacity={opacity}
            strokeWidth={2}
            onMouseEnter={handleEdgeMouseEnter}
            onMouseLeave={handleEdgeMouseLeave}
            onClick={handleEdgeMouseClick}
          />
        );
      })}
    </Layer>
  );
}
