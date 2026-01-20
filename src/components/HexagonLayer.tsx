import { Image, Layer, Line, RegularPolygon, Text } from "react-konva";
import { useMemo, useState, useEffect } from "react";
import useImage from "use-image";
import NumberToken from "@/components/NumberToken";
import { useGameStore } from "@/store/GameState";
import { getCatanFacePositions, getCatanPortPositions } from "@/lib/hexagonUtils";
import { RobberPlaceEvent } from "@/lib/websocket";
import { CatanTilePosition, CatanResource } from "@/lib/types";
import toast from "react-hot-toast";

export default function HexagonLayer() {
  const { faces, dimensions, phase, socket, username, ports, edges } = useGameStore();
  const [blink, setBlink] = useState(true);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [brickImage] = useImage("/BrickSprite.png");
  const [stoneImage] = useImage("/StoneSprite.png");
  const [wheatImage] = useImage("/WheatSprite.png");
  const [forestImage] = useImage("/ForestSprite.png");
  const [sheepImage] = useImage("/SheepSprite.png")
  const [dessertImage] = useImage("/DessertSprite.png")
  const [robberImage] = useImage("/robber.svg")
  const [brickPortImage] = useImage("/brick_port.png");
  const [genericPortImage] = useImage("/generic_port.png");
  const [treePortImage] = useImage("/tree_port.png");
  const [sheepPortImage] = useImage("/sheep_port.png")
  const portImageMap = {
    BRICK: brickPortImage,
    SHEEP: sheepPortImage,
    STONE: brickPortImage,
    TREE: treePortImage,
    WHEAT: brickPortImage,
    GENERIC: genericPortImage,
  }
  const faceWithPositions = useMemo(
    () => getCatanFacePositions(dimensions, faces),
    [dimensions, faces]
  );
  const portWithPositions = useMemo(
    () => getCatanPortPositions(dimensions, ports, edges),
    [dimensions, ports, edges]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === "place_robber") {
      interval = setInterval(() => {
        setBlink((prev) => !prev);
      }, 500);
    } else {
      setBlink(true);
    }
    return () => clearInterval(interval);
  }, [phase]);

  const handleTileClick = (tile: CatanTilePosition) => {
    if (phase === "place_robber") {
      const event: RobberPlaceEvent = {
        type: "ROBBER_PLACED",
        username: username,
        q: tile.data.q,
        r: tile.data.r,
        s: tile.data.s
      }
      if (tile.data.hasRobber) {
        toast.error("Robber is already on this tile")
        return;
      } else {
        socket?.send(JSON.stringify(event))
      }
    }
  }

  return (
    <Layer>
      {/* Render Catan tiles */}
      {faceWithPositions.map((tile) => {
        const tileKey = `${tile.data.q}-${tile.data.r}-${tile.data.s}`;
        // Determine which image to use based on tile resource
        let backgroundImage = brickImage;
        if (tile.data.resource === "BRICK") {
          backgroundImage = brickImage;
        } else if (tile.data.resource === "STONE") {
          backgroundImage = stoneImage;
        } else if (tile.data.resource === "WHEAT") {
          backgroundImage = wheatImage;
        } else if (tile.data.resource === "TREE") {
          backgroundImage = forestImage;
        } else if (tile.data.resource === "SHEEP") {
          backgroundImage = sheepImage;
        } else if (tile.data.resource === "DESERT") {
          backgroundImage = dessertImage;
        }

        return (
          <RegularPolygon
            key={tileKey}
            sides={6}
            radius={30}
            x={tile.x}
            y={tile.y}
            stroke="black"
            strokeWidth={1}
            rotation={0}
            fillPatternImage={backgroundImage}
            fillPatternScaleX={0.074}
            fillPatternScaleY={0.074}
            fillPatternOffsetX={500}
            fillPatternOffsetY={500}
            opacity={phase === "place_robber" ? (blink ? 1 : 0.6) : (hoveredKey === tileKey ? 0.7 : 1)}
            onMouseEnter={(e) => {
              setHoveredKey(tileKey);
              if (phase === "place_robber") {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = "pointer";
              }
            }}
            onMouseLeave={(e) => {
              setHoveredKey(null);
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = "default";
            }}
            onClick={() => handleTileClick(tile)}
          />
        );
      })}
      {faceWithPositions.map((tile) => {
        if (tile.data.number === null) return;
        return (
          <NumberToken
            key={`${tile.data.q}-${tile.data.r}-${tile.data.s}`}
            number={tile.data.number}
            // coords={`q=${tile.data.q},r=${tile.data.r},s=${tile.data.s}`}
            x={tile.x}
            y={tile.y}
          />
        );
      })}
      {faceWithPositions.map((tile) => {
        if (!tile.data.hasRobber) return;
        return (
          <Image
            key={`robber-${tile.data.q}-${tile.data.r}-${tile.data.s}`}
            image={robberImage}
            x={tile.x - 20}
            y={tile.y - 20}
            width={40}
            height={40}
            listening={false}
          />
        )
      })}
      {portWithPositions.map((port) => {
        return (
          <Line
            key={`port-${port.data.target_edge.q1}-${port.data.target_edge.r1}-${port.data.target_edge.s1}-${port.line1endX}-${port.line1endY}`}
            points={[port.x, port.y, port.line1endX, port.line1endY]}
            stroke="black"
            strokeWidth={1}
            listening={false}
          />
        )
      })}
      {portWithPositions.map((port) => {
        return (
          <Line
            key={`port-${port.data.target_edge.q2}-${port.data.target_edge.r2}-${port.data.target_edge.s2}-${port.line2endX}-${port.line2endY}`}
            points={[port.x, port.y, port.line2endX, port.line2endY]}
            stroke="black"
            strokeWidth={1}
            listening={false}
          />
        )
      })}
      {/* {portWithPositions.map((port) => {
        return (
          <Text
            key={`port-${port.data.target_edge.q1}-${port.data.target_edge.r1}-${port.data.target_edge.s1}-${port.line1endX}-${port.line1endY}-txt`}
            text={JSON.stringify(port.data.trade_ratio)}
            x={port.x}
            y={port.y}
            fontSize={10}
            fill="black"
            listening={false}
          />
        )
      })} */}
      {portWithPositions.map((port) => {
        const tradeRatio = port.data.trade_ratio;
        const genericPort = tradeRatio.BRICK == 3 && tradeRatio.SHEEP == 3 && tradeRatio.STONE == 3 && tradeRatio.TREE == 3 && tradeRatio.WHEAT == 3;
        let resourcePort = "BRICK"
        let portImage = portImageMap.GENERIC
        if (!genericPort) {
          Object.keys(tradeRatio).forEach((key) => {
            if (tradeRatio[key as CatanResource] === 2) {
              resourcePort = key;
            }
          })
          portImage = portImageMap[resourcePort as CatanResource]
        }
        return (
          <Image
            key={`port-${port.data.target_edge.q1}-${port.data.target_edge.r1}-${port.data.target_edge.s1}-${port.line1endX}-${port.line1endY}`}
            image={portImage}
            x={port.x}
            y={port.y}
            offset={{ x: 15, y: 15 }}
            width={30}
            height={30}
            listening={false}
          />
        )
      })}
    </Layer>
  );
}
