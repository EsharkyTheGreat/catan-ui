import { Layer, Line } from "react-konva";
import Konva from "konva";
import { useGameStore } from "@/store/GameState";
import { useMemo, useState } from "react";
import { getCatanEdgePositions } from "@/lib/hexagonUtils";
import { RoadPlacedEvent } from "@/lib/websocket";

export default function EdgeLayer() {
  const { phase, edges, dimensions, socket, currentPlayer, players } =
    useGameStore();
  const [hoveredEdgeIndex, setHoveredEdgeIndex] = useState<number | null>(null);

  const catanEdges = useMemo(
    () => getCatanEdgePositions(dimensions, edges),
    [dimensions, edges]
  );

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
    // const target = e.target as Konva.Line;
    // // Restore the original random color and stroke width
    // const edgeIndex = target.index;
    // const originalEdge = edges[edgeIndex];
    // if (originalEdge) {
    //   target.stroke(`hsl(${Math.random() * 360}, 70%, 60%)`);
    //   target.strokeWidth(2);
    // }
    setHoveredEdgeIndex(null);
  };

  const handleEdgeMouseClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!currentPlayer) return;
    if (!socket) return;
    const target = e.target as Konva.Line;
    const edgeIndex = target.index;
    const edge = edges[edgeIndex];
    const data: RoadPlacedEvent = {
      type: "ROAD_PLACED",
      q1: edge.q1,
      q2: edge.q2,
      r1: edge.r1,
      r2: edge.r2,
      s1: edge.s1,
      s2: edge.s2,
      username: currentPlayer,
    };
    socket.send(JSON.stringify(data));
  };

  return (
    <Layer>
      {/* Render edges as lines */}
      {catanEdges.map((edge, index) => {
        // Determine opacity based on ownership and hover state
        let opacity = 0;
        let ownedRoad: boolean = false;
        if (edge.data.owner !== null) {
          ownedRoad = true;
          opacity = 1; // Full opacity for owned edges
          const ownerPlayer = players.find((p) => p.name === edge.data.owner);
          if (!ownerPlayer) {
            opacity = 0;
          } else {
            edge.color = ownerPlayer.color;
          }
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
            strokeWidth={3}
            onMouseEnter={(e) => {
              if (!ownedRoad) {
                handleEdgeMouseEnter(e);
              }
            }}
            onMouseLeave={(e) => {
              if (!ownedRoad) {
                handleEdgeMouseLeave(e);
              }
            }}
            onClick={(e) => {
              if (!ownedRoad) {
                handleEdgeMouseClick(e);
              }
            }}
          />
        );
      })}
    </Layer>
  );
}
