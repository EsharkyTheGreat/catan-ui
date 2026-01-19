import { Player } from "@/lib/types";
import { useGameStore } from "@/store/GameState";

type Props = {
  player: Player;
};

const PLAYER_COLORS: Record<Player["color"], string> = {
  RED: "text-red-600",
  YELLOW: "text-yellow-700",
  BLUE: "text-blue-600",
  GREEN: "text-green-600",
};

export default function PlayerInfo({ player }: Props) {
  const { username, myVictoryPoints } = useGameStore();

  return (
    <div className="h-1/8 bg-orange-200 border-b border-gray-300">
      <div className="p-4">
        <h3 className={`font-bold text-lg ${PLAYER_COLORS[player.color]}`}>{player.name} {username === player.name ? "(You)" : ""}</h3>
        <div className="flex flex-row gap-5 w-full">
          <div>ID-{player.id}</div>
          <div>Cards-{player.cardCount}</div>
          {player.name === username && <div>Victory Points-{myVictoryPoints}</div>}
          <div>Longest Road-{player.longestRoad}</div>
          <div>Longest Army-{player.longestArmy}</div>
        </div>
      </div>
    </div>
  );
}
