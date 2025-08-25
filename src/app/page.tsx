"use client";
import { useRef } from "react";
import CatanBoard from "./components/CatanBoard";
import BottomNavbar from "./components/BottomNavbar";
import RightNavbar from "./components/RightNavbar";

export default function Home() {
  const canvasParentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-screen h-screen flex">
      {/* Game Canvas */}
      <div className="w-4/5 h-14/16" ref={canvasParentRef}>
        <CatanBoard parentRef={canvasParentRef} />
      </div>

      {/* Right Navbar */}
      <div className="w-1/5 h-full bg-green-500">
        <RightNavbar />
      </div>

      {/* Bottom Navbar */}
      <div className="absolute bottom-0 left-0 w-4/5 h-2/16 bg-black">
        <BottomNavbar />
      </div>
    </div>
  );
}
