"use client";
import { useRef, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import CatanBoard from "@/components/CatanBoard";
import BottomNavbar from "@/components/BottomNavbar";
import RightNavbar from "@/components/RightNavbar";
import DiscardCardsDialog from "@/components/DiscardCardsDialog";
import { useGameStore } from "@/store/GameState";
import { fetchGameRoomSummary } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameStartedEvent } from "@/lib/websocket";

export default function Home() {
  const canvasParentRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const gameId = params.game as string;
  const {
    connect,
    players,
    status,
    socket,
    refreshGameMetadata,
    setId,
    setUsername,
    gameWinner,
  } = useGameStore();

  useEffect(() => {
    async function startup() {
      if (!gameId) return;
      if (!username) return;
      setId(gameId);
      setUsername(username);
      refreshGameMetadata();
      const ws = new WebSocket(
        `ws://localhost:8000/ws/${gameId}?player_name=${username}`
      );
      connect(ws);
      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    }
    startup();
  }, []);

  function startGame() {
    if (!socket) return;
    const x: GameStartedEvent = { type: "GAME_STARTED" };
    socket.send(JSON.stringify(x));
  }

  if (status === "finished") {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Game Finished - {gameId}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Winner - {gameWinner}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "lobby") {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Game Lobby - {gameId}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Players - {players.length}/4
                </h3>
                <Button onClick={startGame}>Start</Button>
              </div>
              <div className="space-y-2">
                {players.map((player, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{player.name}</div>
                    </div>
                    <Button variant="destructive">Kick</Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

      {/* Discard Cards Dialog */}
      <DiscardCardsDialog />
    </div>
  );
}
