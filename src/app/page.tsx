"use client";
import { useRef } from "react";
import CatanBoard from "./components/CatanBoard";

export default function Home() {
  const canvasParentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-screen h-screen flex">
      {/* Game Canvas */}
      <div className="w-4/5 h-4/5" ref={canvasParentRef}>
        <CatanBoard parentRef={canvasParentRef} />
      </div>

      {/* Right Navbar */}
      <div className="w-1/5 h-full bg-green-500"></div>

      {/* Bottom Navbar */}
      <div className="absolute bottom-0 left-0 w-4/5 h-1/5 bg-red-500"></div>
    </div>
  );
}
