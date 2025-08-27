"use client";
import { useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import CatanBoard from "@/components/CatanBoard";
import BottomNavbar from "@/components/BottomNavbar";
import RightNavbar from "@/components/RightNavbar";

export default function Home() {
  const canvasParentRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const gameId = params.game as string;

  useEffect(() => {
    if (!gameId) return;

    // Establish WebSocket connection
    const ws = new WebSocket(`ws://localhost:8000/ws/game/${gameId}`);

    ws.onopen = () => {
      console.log(`WebSocket connected to game ${gameId}`);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);
        // Handle different message types here
        // e.g., game state updates, player moves, etc.
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log(`WebSocket disconnected from game ${gameId}`);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [gameId]);

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
