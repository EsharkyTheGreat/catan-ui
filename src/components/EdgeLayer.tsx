import { Layer, Line } from "react-konva";
import Konva from "konva";
import { useGameStore } from "@/store/GameState";
import { useEffect, useMemo, useState } from "react";
import { getCatanEdgePositions } from "@/lib/hexagonUtils";
import { RoadPlacedEvent } from "@/lib/websocket";
import { fetchValidRoadPlacementPositions } from "@/lib/api";
import { CatanEdge } from "@/lib/types";

export default function EdgeLayer() {
  const { id, username, phase, edges, dimensions, socket, currentPlayer, players, setPhase } =
    useGameStore();
  const [allowedEdges, setAllowedEdges] = useState<CatanEdge[]>([]);
  const [blinkOn, setBlinkOn] = useState<boolean>(true);

  const catanEdges = useMemo(
    () => getCatanEdgePositions(dimensions, edges),
    [dimensions, edges]
  );

  const allowedEdgePositions = useMemo(
    () => getCatanEdgePositions(dimensions, allowedEdges),
    [dimensions, allowedEdges]
  );

  useEffect(() => {
    let cancelled = false;
    const maybeFetch = async () => {
      if (phase !== "road_placement") {
        setAllowedEdges([]);
        return;
      }
      if (!id || !username) return;
      const resp = await fetchValidRoadPlacementPositions(id, username);
      if (!cancelled && resp && Array.isArray(resp.edges)) {
        setAllowedEdges(resp.edges);
      }
    };
    maybeFetch();
    return () => {
      cancelled = true;
    };
  }, [phase, id, username]);

  // Blink animation for allowed edges during road placement
  useEffect(() => {
    if (phase !== "road_placement") return;
    const interval = setInterval(() => {
      setBlinkOn((prev) => !prev);
    }, 600);
    return () => clearInterval(interval);
  }, [phase]);

  const handleAllowedEdgeClick = (edge: CatanEdge) => {
    if (!currentPlayer) return;
    if (!socket) return;
    setPhase(null)
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
        // Only show owned edges (full opacity, owner color)
        let opacity = 0;
        let ownedRoad: boolean = false;
        if (edge.data.owner !== null) {
          ownedRoad = true;
          opacity = 1;
          const ownerPlayer = players.find((p) => p.name === edge.data.owner);
          if (!ownerPlayer) {
            opacity = 0;
          } else {
            edge.color = ownerPlayer.color;
          }
        }

        return (
          <Line
            key={`edge-${index}`}
            points={[edge.startX, edge.startY, edge.endX, edge.endY]}
            stroke={edge.color}
            opacity={opacity}
            strokeWidth={4}
          />
        );
      })}

      {phase === "road_placement" && allowedEdgePositions.map((edge, index) => (
        <Line
          key={`allowed-edge-${index}`}
          points={[edge.startX, edge.startY, edge.endX, edge.endY]}
          stroke="white"
          opacity={blinkOn ? 0.9 : 0.6}
          strokeWidth={4}
          onMouseEnter={(e) => {
            const target = e.target as Konva.Line;
            target.stroke("black");
            target.strokeWidth(4);
            target.getStage()?.container().style && (target.getStage()!.container().style.cursor = "pointer");
          }}
          onMouseLeave={(e) => {
            const target = e.target as Konva.Line;
            target.stroke("white");
            target.strokeWidth(4);
            target.getStage()?.container().style && (target.getStage()!.container().style.cursor = "default");
          }}
          onClick={(e) => {
            const target = e.target as Konva.Line;
            target.getStage()?.container().style && (target.getStage()!.container().style.cursor = "default");
            handleAllowedEdgeClick(edge.data)
          }}
        />
      ))}
    </Layer>
  );
}
