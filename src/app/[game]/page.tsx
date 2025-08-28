"use client";
import { useRef, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import CatanBoard from "@/components/CatanBoard";
import BottomNavbar from "@/components/BottomNavbar";
import RightNavbar from "@/components/RightNavbar";
import { useGameStore } from "@/store/GameState";

export default function Home() {
  const canvasParentRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const gameId = params.game as string;
  const { connect } = useGameStore();

  useEffect(() => {
    if (!gameId) return;
    const ws = new WebSocket(
      `ws://localhost:8000/ws/${gameId}?player_name=${username}`
    );
    connect(ws);
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

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
