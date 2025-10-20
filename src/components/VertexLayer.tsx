import { Layer, Circle, Path } from "react-konva";
import Konva from "konva";
import { useGameStore } from "@/store/GameState";
import { getCatanVertexPositions } from "@/lib/hexagonUtils";
import { useEffect, useMemo, useState } from "react";
import { CatanVertex } from "@/lib/types";
import { HousePlacedEvent, SettlementPlacedEvent } from "@/lib/websocket";
import { fetchValidHousePlacementPositions } from "@/lib/api";

const houseSvg = "M62.79,29.172l-28-28C34.009,0.391,32.985,0,31.962,0s-2.047,0.391-2.828,1.172l-28,28 c-1.562,1.566-1.484,4.016,0.078,5.578c1.566,1.57,3.855,1.801,5.422,0.234L8,33.617V60c0,2.211,1.789,4,4,4h16V48h8v16h16 c2.211,0,4-1.789,4-4V33.695l1.195,1.195c1.562,1.562,3.949,1.422,5.516-0.141C64.274,33.188,64.356,30.734,62.79,29.172z";


export default function VertexLayer() {
  const { id, username, vertices, dimensions, phase, currentPlayer, socket, setPhase } = useGameStore();

  const [allowedVertices, setAllowedVertices] = useState<CatanVertex[]>([]);

  // positions of all board vertices (for rendering houses already placed)
  const allVertexPositions = useMemo(() => {
    return getCatanVertexPositions(dimensions, vertices);
  }, [dimensions, vertices]);

  // positions of allowed vertices only during house placement
  const allowedVertexPositions = useMemo(() => {
    return getCatanVertexPositions(dimensions, allowedVertices);
  }, [dimensions, allowedVertices]);

  useEffect(() => {
    let cancelled = false;
    const maybeFetch = async () => {
      if (phase !== "house_placement") {
        setAllowedVertices([]);
        return;
      }
      if (!id || !username) return;
      const resp = await fetchValidHousePlacementPositions(id, username);
      if (!cancelled && resp && Array.isArray(resp.vertices)) {
        setAllowedVertices(resp.vertices);
      }
    };
    maybeFetch();
    return () => {
      cancelled = true;
    };
  }, [phase, id, username]);
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

  const handleVertexMouseClick = (vertex: CatanVertex, housePlaced: boolean, settlementPlaced: boolean) => {
    if (!currentPlayer) return;
    setPhase(null)
    if (housePlaced) {
      const data: HousePlacedEvent = {
        q1: vertex.q1,
        q2: vertex.q2,
        q3: vertex.q3,
        r1: vertex.r1,
        r2: vertex.r2,
        r3: vertex.r3,
        s1: vertex.s1,
        s2: vertex.s2,
        s3: vertex.s3,
        type: "HOUSE_PLACED",
        username: currentPlayer
      }
      return socket?.send(JSON.stringify(data))
    }
    if (settlementPlaced) {
      const data: SettlementPlacedEvent = {
        q1: vertex.q1,
        q2: vertex.q2,
        q3: vertex.q3,
        r1: vertex.r1,
        r2: vertex.r2,
        r3: vertex.r3,
        s1: vertex.s1,
        s2: vertex.s2,
        s3: vertex.s3,
        type: "SETTLEMENT_PLACED",
        username: currentPlayer
      }
      return socket?.send(JSON.stringify(data))
    }
  } 

  return (
    <Layer>
      {/* Render vertices as circles */}
      {allVertexPositions.map((vertex, index)=> {
        if (vertex.data.hasHouse) {
          return (
            <Path
              key={`vertex-${index}`}
              data={houseSvg}
              fill="blue" // your SVG fill
              stroke="#000" // optional stroke
              strokeWidth={4} // optional stroke width
              x={vertex.x - 7} // position on the canvas
              y={vertex.y - 8}
              scaleX={0.25} // scale it up/down to fit your Stage
              scaleY={0.25}
            />
          )
        }
      })}
      {phase === "house_placement" && allowedVertexPositions.map((vertex, index) => (
        <Circle
          key={`allowed-vertex-${index}`}
          x={vertex.x}
          y={vertex.y}
          radius={5}
          fill="#FF6B6B"
          stroke="#D63031"
          strokeWidth={1}
          onMouseEnter={(e) => {
            handleVertexMouseEnter(e);
          }}
          onMouseLeave={handleVertexMouseLeave}
          onClick={()=>handleVertexMouseClick(vertex.data,true,false)}
        />
      ))}
    </Layer>
  );
}
