import Konva from "konva";
import { useRef, useEffect, useState } from "react";
import { Image, Layer, Rect, Stage, Text } from "react-konva";
import {
  CatanTile,
  generateCatanMap,
  calculateVertices,
  calculateEdges,
} from "../lib/hexagonUtils";
import { CatanEdge } from "../lib/types";
import HexagonLayer from "./HexagonLayer";
import VertexLayer from "./VertexLayer";
import EdgeLayer from "./EdgeLayer";

type Props = {
  parentRef: React.RefObject<HTMLDivElement | null>;
};

export default function CatanBoard({ parentRef }: Props) {
  const stageRef = useRef<Konva.Stage>(null);
  const [canvasScale, setCanvasScale] = useState<number>(1.0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [bgImg, setBgImg] = useState<HTMLImageElement | null>();

  const [catanTiles, setCatanTiles] = useState<CatanTile[]>([]);
  const [catanVertices, setCatanVertices] = useState<
    { x: number; y: number }[]
  >([]);
  const [catanEdges, setCatanEdges] = useState<CatanEdge[]>([]);

  const clampStagePosition = (
    pos: { x: number; y: number },
    scale: number
  ): { x: number; y: number } => {
    const maxX = 0;
    const maxY = 0;
    const minX = dimensions.width - dimensions.width * scale;
    const minY = dimensions.height - dimensions.height * scale;
    return {
      x: Math.min(maxX, Math.max(minX, pos.x)),
      y: Math.min(maxY, Math.max(minY, pos.y)),
    };
  };

  const canvasOnWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    if (stageRef.current) {
      e.evt.preventDefault();
      const oldScale = stageRef.current.scaleX();
      const pointer = stageRef.current.getPointerPosition();
      if (pointer == null) {
        return;
      }
      const scaleBy = 1.05;
      const direction = e.evt.deltaY > 0 ? 1 : -1;
      const unclampedScale =
        direction > 0 ? oldScale / scaleBy : oldScale * scaleBy;
      const newScale = Math.max(1, unclampedScale);

      const mousePointTo = {
        x: (pointer.x - stageRef.current.x()) / oldScale,
        y: (pointer.y - stageRef.current.y()) / oldScale,
      };
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      const clampedPos = clampStagePosition(newPos, newScale);
      setCanvasScale(newScale);
      setCanvasPosition(clampedPos);
    }
  };

  const handleMouseDown: (
    e: Konva.KonvaEventObject<MouseEvent>
  ) => void = () => {
    setIsDragging(true);
    setLastPos(stageRef.current?.getPointerPosition() || { x: 0, y: 0 });
  };

  const handleMouseMove: (
    e: Konva.KonvaEventObject<MouseEvent>
  ) => void = () => {
    if (!isDragging) return;

    const pos = stageRef.current?.getPointerPosition();
    if (!pos) return;

    const newPos = {
      x: canvasPosition.x + (pos.x - lastPos.x),
      y: canvasPosition.y + (pos.y - lastPos.y),
    };
    const clampedPos = clampStagePosition(newPos, canvasScale);
    setCanvasPosition(clampedPos);
    setLastPos(pos);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (parentRef.current) {
      const { width, height } = parentRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
    const image = new window.Image();
    image.src = "/image.png";
    image.onload = () => {
      setBgImg(image);
    };
  }, [parentRef]);

  // Generate catan tiles when dimensions change
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      const tiles = generateCatanMap(dimensions);
      setCatanTiles(tiles);
      setCatanVertices(calculateVertices(tiles));
      setCatanEdges(calculateEdges(tiles));
    }
  }, [dimensions]);

  return (
    <Stage
      width={dimensions.width}
      height={dimensions.height}
      ref={stageRef}
      scaleX={canvasScale}
      scaleY={canvasScale}
      onWheel={canvasOnWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      x={canvasPosition.x}
      y={canvasPosition.y}
    >
      <Layer>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        {bgImg && (
          <Image
            image={bgImg}
            width={dimensions.width}
            height={dimensions.height}
          />
        )}
      </Layer>
      {/* Render Catan tiles */}
      <HexagonLayer catanTiles={catanTiles} />
      {/* Render edges */}
      <EdgeLayer edges={catanEdges} />
      {/* Render vertices */}
      <VertexLayer vertices={catanVertices} />
      <Layer>
        <Text text="Try to drag shapes" fontSize={15} />
        <Rect
          x={20}
          y={50}
          width={100}
          height={100}
          fill="red"
          shadowBlur={10}
          draggable
        />
      </Layer>
    </Stage>
  );
}
