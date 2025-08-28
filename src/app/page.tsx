"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createGameRoom, fetchGameRooms, GameRoom } from "@/lib/api";
import toast from "react-hot-toast";

export default function Page() {
  const [gameRooms, setGameRooms] = useState<GameRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    const loadGameRooms = async () => {
      try {
        setLoading(true);
        const rooms = await fetchGameRooms();
        setGameRooms(rooms);
      } catch (error) {
        console.error("Failed to fetch game rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGameRooms();
  }, []);

  const createNewGame = async () => {
    if (playerName.trim() == "") {
      toast.error("Username is empty");
    }
    const newGameId = await createGameRoom(playerName);
    if (!newGameId) return;
    window.location.href = `/${newGameId}?username=${playerName}`;
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Catan Lobby</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Name</label>
            <Input
              placeholder="Enter your name"
              className="w-full"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Available Games</h3>
              <Button onClick={createNewGame}>Create New Game</Button>
            </div>
            <div className="space-y-2">
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading game rooms...
                </div>
              ) : gameRooms.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No games available. Create one to get started!
                </div>
              ) : (
                gameRooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{room.name}</div>
                      <div className="text-sm text-gray-500">
                        Host: {room.host} • Players: {room.players.length}/{4}
                      </div>
                      {room.status && (
                        <div className="text-xs text-blue-600 mt-1">
                          Status: {room.status}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (playerName.trim() == "") {
                          toast.error("Please enter your name");
                          return;
                        }
                        window.location.href = `/${room.id}?username=${playerName}`;
                      }}
                      disabled={room.players.length >= 4}
                    >
                      {room.players.length >= 4 ? "Full" : "Join Game"}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
