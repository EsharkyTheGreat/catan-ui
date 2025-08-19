import { Layer, RegularPolygon, Image } from "react-konva";
import { CatanTilePosition } from "../lib/types";
import useImage from "use-image";
import NumberToken from "./NumberToken";

type Props = {
  catanTiles: CatanTilePosition[];
};

export default function HexagonLayer({ catanTiles }: Props) {
  const [brickImage] = useImage("/BrickSprite.png");
  const [stoneImage] = useImage("/StoneSprite.png");
  const [wheatImage] = useImage("/WheatSprite.png");
  const [forestImage] = useImage("/ForestSprite.png");

  return (
    <Layer>
      {/* Render Catan tiles */}
      {catanTiles.map((tile) => {
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
            key={`${tile.data.q}-${tile.data.r}-${tile.data.s}`}
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
          />
        );
      })}
      {catanTiles.map((tile) => {
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
