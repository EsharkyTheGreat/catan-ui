"use client"
import Konva from "konva";
import { useRef, useEffect, useState } from "react";
import { Image, Layer, Rect, RegularPolygon, Stage, Text, Circle, Line } from "react-konva";

export default function Home() {

  const canvasParentRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [canvasScale,setCanvasScale] = useState<number>(1.0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [canvasPosition, setCanvasPosition] = useState({x:0,y:0})
  const [isDragging, setIsDragging] = useState(false)
  const [lastPos, setLastPos] = useState({x:0,y:0})
  const [bgImg, setBgImg] = useState<HTMLImageElement|null>();

  // Define CatanTile interface
  interface CatanTile {
    q: number;
    r: number;
    s: number;
    x: number;
    y: number;
    type: string;
    number: number | null;
  }

  // Convert q,r,s coordinates to x,y coordinates
  const hexToPixel = (q: number, r: number, s: number, size: number = 30) => {
    const x = size * (Math.sqrt(3) * q + Math.sqrt(3)/2 * r);
    const y = size * (3/2 * r);
    return { x, y };
  };

  // Generate Catan map tiles in q,r,s coordinate system
  const generateCatanMap = () => {
    const tiles = [];
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    // Create a 3x3 grid of hexagons around center
    for (let q = -3; q <= 3; q++) {
      for (let r = -3; r <= 3; r++) {
        for (let s = -3; s <= 3; s++) {
          // q + r + s must equal 0 for valid hex coordinates
          if (q + r + s === 0) {
            const { x, y } = hexToPixel(q, r, s);
            tiles.push({
              q, r, s,
              x: centerX + x,
              y: centerY + y,
              type: 'grass', // You can randomize this later
              number: Math.floor(Math.random() * 6) + 2 // Random number token 2-7
            });
          }
        }
      }
    }
    return tiles;
  };

  const [catanTiles, setCatanTiles] = useState<CatanTile[]>([]);

  // Calculate all vertex coordinates for the hexagonal tiles
  const calculateVertices = (tiles: CatanTile[]) => {
    const vertices = new Set<string>(); // Use Set to avoid duplicates
    const size = 30; // Same size as used in hexToPixel
    
    tiles.forEach(tile => {
      // Calculate the 6 vertices of each hexagon
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60) * Math.PI / 180 + Math.PI/6; // 60 degrees per vertex
        const vertexX = tile.x + size * Math.cos(angle);
        const vertexY = tile.y + size * Math.sin(angle);
        
        // Round to avoid floating point precision issues
        const roundedX = Math.round(vertexX * 100000) / 100000;
        const roundedY = Math.round(vertexY * 100000) / 100000;
        vertices.add(`${roundedX},${roundedY}`);
      }
    });
    
    // Convert back to array of coordinate objects
    return Array.from(vertices).map(coord => {
      const [x, y] = coord.split(',').map(Number);
      return { x, y };
    });
  };

  const [catanVertices, setCatanVertices] = useState<{x: number, y: number}[]>([]);

  // Calculate all edges between vertices
  const calculateEdges = (tiles: CatanTile[]) => {
    const edges = new Set<string>(); // Use Set to avoid duplicates
    const size = 30; // Same size as used in hexToPixel
    
    tiles.forEach(tile => {
      // Calculate the 6 vertices of each hexagon
      for (let i = 0; i < 6; i++) {
        const angle1 = (i * 60) * Math.PI / 180 + Math.PI/6;
        const angle2 = ((i + 1) % 6) * 60 * Math.PI / 180 + Math.PI/6;
        
        const vertex1X = tile.x + size * Math.cos(angle1);
        const vertex1Y = tile.y + size * Math.sin(angle1);
        const vertex2X = tile.x + size * Math.cos(angle2);
        const vertex2Y = tile.y + size * Math.sin(angle2);
        
        // Round to avoid floating point precision issues
        const rounded1X = Math.round(vertex1X * 100000) / 100000;
        const rounded1Y = Math.round(vertex1Y * 100000) / 100000;
        const rounded2X = Math.round(vertex2X * 100000) / 100000;
        const rounded2Y = Math.round(vertex2Y * 100000) / 100000;
        
        // Create edge key ensuring consistent ordering
        const edgeKey = rounded1X < rounded2X || (rounded1X === rounded2X && rounded1Y < rounded2Y) 
          ? `${rounded1X},${rounded1Y}-${rounded2X},${rounded2Y}`
          : `${rounded2X},${rounded2Y}-${rounded1X},${rounded1Y}`;
        
        edges.add(edgeKey);
      }
    });
    
    // Convert back to array of edge objects
    return Array.from(edges).map(edge => {
      const [start, end] = edge.split('-');
      const [startX, startY] = start.split(',').map(Number);
      const [endX, endY] = end.split(',').map(Number);
      return { 
        startX, 
        startY, 
        endX, 
        endY,
        color: `hsl(${Math.random() * 360}, 70%, 60%)` // Random HSL color
      };
    });
  };

  const [catanEdges, setCatanEdges] = useState<{startX: number, startY: number, endX: number, endY: number, color: string}[]>([]);

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
      e.evt.preventDefault()
      const oldScale = stageRef.current.scaleX()
      const pointer = stageRef.current.getPointerPosition()
      if (pointer == null) {
        return
      }
      const scaleBy = 1.05;
      const direction = e.evt.deltaY > 0 ? 1 : -1;
      const unclampedScale = direction > 0 ? oldScale / scaleBy : oldScale * scaleBy;
      const newScale = Math.max(1, unclampedScale);

      const mousePointTo = {
        x: (pointer.x - stageRef.current.x()) / oldScale,
        y: (pointer.y - stageRef.current.y()) / oldScale,
      };
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      const clampedPos = clampStagePosition(newPos, newScale)
      setCanvasScale(newScale)
      setCanvasPosition(clampedPos)
    }
  }

  const handleMouseDown: (e: Konva.KonvaEventObject<MouseEvent>) => void = () => {
    setIsDragging(true)
    setLastPos(stageRef.current?.getPointerPosition() || {x: 0, y: 0})
  }

  const handleMouseMove: (e: Konva.KonvaEventObject<MouseEvent>) => void = () => {
    if (!isDragging) return
    
    const pos = stageRef.current?.getPointerPosition()
    if (!pos) return
    
    const newPos = {
      x: canvasPosition.x + (pos.x - lastPos.x),
      y: canvasPosition.y + (pos.y - lastPos.y),
    }
    const clampedPos = clampStagePosition(newPos, canvasScale)
    setCanvasPosition(clampedPos)
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

  // Generate catan tiles when dimensions change
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      const tiles = generateCatanMap();
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
            {bgImg && <Image image={bgImg} width={dimensions.width} height={dimensions.height} /> }
          </Layer>
          <Layer>
            {/* Render Catan tiles */}
            {catanTiles.map((tile, index) => (
              <RegularPolygon
                key={`${tile.q}-${tile.r}-${tile.s}`}
                sides={6}
                radius={30}
                x={tile.x}
                y={tile.y}
                fill={tile.type === 'water' ? '#4A90E2' : '#90EE90'}
                stroke="black"
                strokeWidth={1}
                rotation={0}
              />
            ))}
          </Layer>
          <Layer>
            {/* Render edges as lines */}
            {catanEdges.map((edge, index) => (
              <Line
                key={`edge-${index}`}
                points={[edge.startX, edge.startY, edge.endX, edge.endY]}
                stroke={edge.color}
                strokeWidth={2}
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
      <div className="w-1/5 h-full bg-green-500">
      </div>
      
      {/* Bottom Navbar */}
      <div className="absolute bottom-0 left-0 w-4/5 h-1/5 bg-red-500">
      </div>
    </div>
  );
}
