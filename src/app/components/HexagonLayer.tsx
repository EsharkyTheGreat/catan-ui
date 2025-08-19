import { Layer, RegularPolygon } from "react-konva";
import { useState } from "react";
import useImage from "use-image";
import NumberToken from "./NumberToken";
import { useGameStore } from "../store/GameState";

export default function HexagonLayer() {
  const {faces} = useGameStore();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [brickImage] = useImage("/BrickSprite.png");
  const [stoneImage] = useImage("/StoneSprite.png");
  const [wheatImage] = useImage("/WheatSprite.png");
  const [forestImage] = useImage("/ForestSprite.png");

  return (
    <Layer>
      {/* Render Catan tiles */}
      {faces.map((tile) => {
        const tileKey = `${tile.data.q}-${tile.data.r}-${tile.data.s}`;
        // Determine which image to use based on tile type
        let backgroundImage = brickImage;
        if (tile.data.type === "brick") {
          backgroundImage = brickImage;
        } else if (tile.data.type === "stone") {
          backgroundImage = stoneImage;
        } else if (tile.data.type === "wheat") {
          backgroundImage = wheatImage;
        } else if (tile.data.type === "forest") {
          backgroundImage = forestImage;
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
            fillPatternScaleX={0.07}
            fillPatternScaleY={0.07}
            fillPatternOffsetX={500}
            fillPatternOffsetY={500}
            opacity={hoveredKey === tileKey ? 0.7 : 1}
            onMouseEnter={() => setHoveredKey(tileKey)}
            onMouseLeave={() => setHoveredKey(null)}
          />
        );
      })}
      {faces.map((tile) => {
        return (
          <NumberToken
            key={`${tile.data.q}-${tile.data.r}-${tile.data.s}`}
            number={tile.data.number}
            x={tile.x}
            y={tile.y}
          />
        );
      })}
    </Layer>
  );
}
