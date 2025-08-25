import { Player } from "@/lib/types";

type Props = {
  player: Player;
};

export default function PlayerInfo({ player }: Props) {
  return (
    <div className="h-1/8 bg-orange-200 border-b border-gray-300">
      <div className="p-4">
        <h3 className="font-bold text-lg">{player.name}</h3>
        <div className="flex flex-row gap-5 w-full">
          <div> {player.id}</div>
          <div>{player.victoryPoints}</div>
          <div>{player.cardCount}</div>
        </div>
      </div>
    </div>
  );
}
