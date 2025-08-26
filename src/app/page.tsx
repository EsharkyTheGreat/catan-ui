import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Page() {
  const gameRooms = [
    { id: 1, host: "esharky", players: 5, maxPlayers: 12, name: "gamename" },
  ];
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
        <CardHeader>
            <CardTitle className="text-center text-2xl">
            Catan Lobby
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
            <label className="text-sm font-medium">Your Name</label>
            <Input placeholder="Enter your name" className="w-full" />
            </div>

            <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Available Games</h3>
                <Button>Create New Game</Button>
            </div>

            <div className="space-y-2">
                {gameRooms.map((room) => (
                <div
                    key={room.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                >
                    <div>
                    <div className="font-medium">{room.name}</div>
                    <div className="text-sm text-gray-500">
                        Host: {room.host} • Players: {room.players}/
                        {room.maxPlayers}
                    </div>
                    </div>
                    <Button variant="outline">Join Game</Button>
                </div>
                ))}
            </div>
            </div>
        </CardContent>
        </Card>
    </div>
  );
}
