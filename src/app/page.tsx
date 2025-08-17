"use client"
import Konva from "konva";
import { useRef, useEffect, useState } from "react";
import { Image, Layer, Rect, Stage, Text } from "react-konva";

export default function Home() {

  const canvasParentRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [canvasScale,setCanvasScale] = useState<number>(1.0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [canvasPosition, setCanvasPosition] = useState({x:0,y:0})
  const [isDragging, setIsDragging] = useState(false)
  const [lastPos, setLastPos] = useState({x:0,y:0})
  const [bgImg, setBgImg] = useState<HTMLImageElement|null>();

  const canvasOnWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    if (stageRef.current) {
      e.evt.preventDefault()
      const oldScale = stageRef.current.scaleX()
      const pointer = stageRef.current.getPointerPosition()
      if (pointer == null) {
        return
      }
      const scaleBy = 1.05;
      const direction = e.evt.deltaY > 0 ? 1 : -1;
      const newScale = direction > 0 ? oldScale / scaleBy : oldScale * scaleBy;

      const mousePointTo = {
        x: (pointer.x - stageRef.current.x()) / oldScale,
        y: (pointer.y - stageRef.current.y()) / oldScale,
      };
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      setCanvasScale(newScale)
      setCanvasPosition(newPos)
    }
  }

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    setIsDragging(true)
    setLastPos(stageRef.current?.getPointerPosition() || {x: 0, y: 0})
  }

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDragging) return
    
    const pos = stageRef.current?.getPointerPosition()
    if (!pos) return
    
    const newPos = {
      x: canvasPosition.x + (pos.x - lastPos.x),
      y: canvasPosition.y + (pos.y - lastPos.y),
    }
    setCanvasPosition(newPos)
    setLastPos(pos)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (canvasParentRef.current) {
      const { width, height } = canvasParentRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
    const image = new window.Image()
    image.src = "/image.png"
    image.onload = () => {
      setBgImg(image);
    }
  }, []);

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
            {bgImg && <Image image={bgImg} width={dimensions.width} height={dimensions.height} /> }
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
      <div className="w-1/5 h-full bg-green-500">
      </div>
      
      {/* Bottom Navbar */}
      <div className="absolute bottom-0 left-0 w-4/5 h-1/5 bg-red-500">
      </div>
    </div>
  );
}
