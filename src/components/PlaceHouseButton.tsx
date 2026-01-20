import { House } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import ResourceCard from "@/components/ResourceCard";
import { useGameStore } from "@/store/GameState";

export default function PlaceHouseButton() {
  const { phase, setPhase, playerResources, username, currentPlayer, myHouseCounts, discardInProgress, housesPlacedThisTurn, playerTurnCount, dieRolledThisTurn, config } = useGameStore()
  const canBuyHouse = (playerResources.BRICK >= 1 && playerResources.TREE >= 1 && playerResources.SHEEP >= 1 && playerResources.WHEAT >= 1) || myHouseCounts < 2;
  const myTurn = username === currentPlayer
  const maxHouseReached = myHouseCounts >= config.max_houses;

  const canPlaceHouse: boolean = !maxHouseReached && myTurn && canBuyHouse && !discardInProgress && (playerTurnCount[username] in [0, 1] ? housesPlacedThisTurn < 1 : dieRolledThisTurn);

  return (
    <div className="transition-transform duration-200 hover:scale-110">
      <HoverCard openDelay={10} closeDelay={10}>
        <HoverCardTrigger>
          <House
            size={88}
            stroke="black"
            className={canPlaceHouse ? "hover:cursor-pointer" : "hover:cursor-not-allowed opacity-50"}
            onClick={() => {
              if (phase !== "house_placement" && canPlaceHouse) setPhase("house_placement");
              else if (phase === "house_placement") setPhase(null);
            }}
          />
          <div className="text-[10px] text-center leading-tight">House</div>
        </HoverCardTrigger>
        <HoverCardContent className="w-fit">
          <div className="flex items-center h-full bg-amber-50 rounded-xl">
            <ResourceCard resourceType="BRICK" count={1} size={60} hidden={playerResources.BRICK < 1} />
            <ResourceCard resourceType="TREE" count={1} size={60} hidden={playerResources.TREE < 1} />
            <ResourceCard resourceType="SHEEP" count={1} size={60} hidden={playerResources.SHEEP < 1} />
            <ResourceCard resourceType="WHEAT" count={1} size={60} hidden={playerResources.WHEAT < 1} />
          </div>
          <div className="text-[10px] text-center">{`Placed (${myHouseCounts}/${config.max_houses})`}</div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}