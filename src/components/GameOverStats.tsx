
"use client";

import { useEffect, useState } from "react";
import { fetchGameOverSummary, GameOverStatistics } from "@/lib/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

type Props = {
    gameId: string;
    visible: boolean;
};

export default function GameOverStats({ gameId, visible }: Props) {
    const [stats, setStats] = useState<GameOverStatistics | null>(null);

    useEffect(() => {
        if (visible && gameId) {
            fetchGameOverSummary(gameId).then((data) => {
                if (data) setStats(data);
            });
        }
    }, [gameId, visible]);

    if (!stats) return <div>Loading Stats...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-4 bg-yellow-100 rounded-lg">
                <Trophy className="w-16 h-16 text-yellow-600 mb-2" />
                <h2 className="text-2xl font-bold text-yellow-800">
                    Winner: {stats.winner}
                </h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Game Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Player</TableHead>
                                <TableHead>Victory Points</TableHead>
                                <TableHead>Longest Road</TableHead>
                                <TableHead>Longest Army</TableHead>
                                <TableHead>Houses Placed</TableHead>
                                <TableHead>Settlements Placed</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.players.map((player) => (
                                <TableRow key={player.id}>
                                    <TableCell className="font-medium">{player.name}</TableCell>
                                    <TableCell>{player.victory_points}</TableCell>
                                    <TableCell>{player.longestRoad}</TableCell>
                                    <TableCell>{player.longestArmy}</TableCell>
                                    <TableCell>{player.houses_placed}</TableCell>
                                    <TableCell>{player.settlements_placed}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
