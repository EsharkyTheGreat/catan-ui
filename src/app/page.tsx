"use client";
import Konva from "konva";
import { useRef, useEffect, useState } from "react";
import { Image, Layer, Rect, Stage, Text, Circle, Line } from "react-konva";
import {
  CatanTile,
  generateCatanMap,
  calculateVertices,
  calculateEdges,
} from "./lib/hexagonUtils";
import HexagonLayer from "@/app/components/HexagonLayer";

export default function Home() {
  const canvasParentRef = useRef<HTMLDivElement>(null);
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
  const [catanEdges, setCatanEdges] = useState<
    {
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      color: string;
    }[]
  >([]);

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
    const originalEdge = catanEdges[edgeIndex];
    if (originalEdge) {
      target.stroke(originalEdge.color);
      target.strokeWidth(2);
    }
  };

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
    if (canvasParentRef.current) {
      const { width, height } = canvasParentRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
    const image = new window.Image();
    image.src = "/image.png";
    image.onload = () => {
      setBgImg(image);
    };
  }, []);

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
    <div className="w-screen h-screen flex">
      {/* Game Canvas */}
      <div className="w-4/5 h-4/5" ref={canvasParentRef}>
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
          <Layer>
            {/* Render edges as lines */}
            {catanEdges.map((edge, index) => (
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
          <Layer>
            {/* Render vertices as circles */}
            {catanVertices.map((vertex, index) => (
              <Circle
                key={`vertex-${index}`}
                x={vertex.x}
                y={vertex.y}
                radius={5}
                fill="#FF6B6B"
                stroke="#D63031"
                strokeWidth={1}
                onMouseEnter={handleVertexMouseEnter}
                onMouseLeave={handleVertexMouseLeave}
              />
            ))}
          </Layer>
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
      </div>

      {/* Right Navbar */}
      <div className="w-1/5 h-full bg-green-500"></div>

      {/* Bottom Navbar */}
      <div className="absolute bottom-0 left-0 w-4/5 h-1/5 bg-red-500"></div>
    </div>
  );
}
