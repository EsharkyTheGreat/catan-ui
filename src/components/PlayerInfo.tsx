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
          <div>ID-{player.id}</div>
          <div>VP-{player.victoryPoints}</div>
          <div>Cards-{player.cardCount}</div>
        </div>
      </div>
    </div>
  );
}
