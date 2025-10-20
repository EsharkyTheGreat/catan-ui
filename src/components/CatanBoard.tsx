import Konva from "konva";
import { useRef, useEffect, useState } from "react";
import { Image, Layer, Path, Rect, Stage, Text } from "react-konva";
import HexagonLayer from "@/components/HexagonLayer";
import VertexLayer from "@/components/VertexLayer";
import EdgeLayer from "@/components/EdgeLayer";
import { useGameStore } from "@/store/GameState";
import PhaseIndicator from "./PhaseIndicator";

type Props = {
  parentRef: React.RefObject<HTMLDivElement | null>;
};

export default function CatanBoard({ parentRef }: Props) {
  const stageRef = useRef<Konva.Stage>(null);
  const [canvasScale, setCanvasScale] = useState<number>(1.0);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [bgImg, setBgImg] = useState<HTMLImageElement | null>();

  const { setVertices, dimensions, setDimensions } = useGameStore();

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

  // // Generate catan tiles when dimensions change
  // useEffect(() => {
  //   if (dimensions.width > 0 && dimensions.height > 0) {
  //     // const tiles = generateCatanMap(dimensions);
  //     // setFaces(tiles);
  //     // setVertices(calculateVertices(tiles));
  //     // setEdges(calculateEdges(tiles));
  //   }
  // }, [dimensions]);

  const pathData =
    "M62.79,29.172l-28-28C34.009,0.391,32.985,0,31.962,0s-2.047,0.391-2.828,1.172l-28,28 c-1.562,1.566-1.484,4.016,0.078,5.578c1.566,1.57,3.855,1.801,5.422,0.234L8,33.617V60c0,2.211,1.789,4,4,4h16V48h8v16h16 c2.211,0,4-1.789,4-4V33.695l1.195,1.195c1.562,1.562,3.949,1.422,5.516-0.141C64.274,33.188,64.356,30.734,62.79,29.172z";

  return (
    <div>
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
        <HexagonLayer />
        {/* Render edges */}
        <EdgeLayer />
        {/* Render vertices */}
        <VertexLayer />
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
        <Layer>
          <Path
            data={pathData}
            fill="blue" // your SVG fill
            stroke="#000" // optional stroke
            strokeWidth={4} // optional stroke width
            x={5} // position on the canvas
            y={5}
            scaleX={0.25} // scale it up/down to fit your Stage
            scaleY={0.25}
            draggable
          />
        </Layer>
      </Stage>
      <div
        style={{
          position: "absolute",
          top: dimensions.height - 100,
          left: dimensions.width - 200,
          background: "white",
          border: "2px solid black",
          borderRadius: "8px",
          padding: "8px 12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        <PhaseIndicator />
      </div>
    </div>

  );
}
