import { Layer, RegularPolygon } from "react-konva";
import { useMemo, useState } from "react";
import useImage from "use-image";
import NumberToken from "@/components/NumberToken";
import { useGameStore } from "@/store/GameState";
import { getCatanFacePositions } from "@/lib/hexagonUtils";

export default function HexagonLayer() {
  const { faces, dimensions } = useGameStore();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [brickImage] = useImage("/BrickSprite.png");
  const [stoneImage] = useImage("/StoneSprite.png");
  const [wheatImage] = useImage("/WheatSprite.png");
  const [forestImage] = useImage("/ForestSprite.png");
  const faceWithPositions = useMemo(
    () => getCatanFacePositions(dimensions, faces),
    [dimensions, faces]
  );

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
            opacity={hoveredKey === tileKey ? 0.7 : 1}
            onMouseEnter={() => setHoveredKey(tileKey)}
            onMouseLeave={() => setHoveredKey(null)}
          />
        );
      })}
      {faceWithPositions.map((tile) => {
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
    </Layer>
  );
}
