import { useGameStore } from "@/store/GameState";
import Bank from "./Bank";
import GameChat from "./GameChat";
import GameLog from "./GameLog";
import PlayerInfo from "./PlayerInfo";

export default function RightNavbar() {
  const { players } = useGameStore();
  return (
    <div className="flex flex-col h-full">
      {/* Top section - Game Chat - 25% */}
      <GameChat />
      {/* Second section - Game Log - 25% */}
      <GameLog />

      {/* Third section - Bank - 12.5% */}
      <Bank />

      {players.map((player, i) => (
        <PlayerInfo key={i} player={player} />
      ))}
    </div>
  );
}
