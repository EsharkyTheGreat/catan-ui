import { HoverCard, HoverCardTrigger, HoverCardContent } from "@radix-ui/react-hover-card";
import { Minus } from "lucide-react";
import ResourceCard from "@/components/ResourceCard";
import { useGameStore } from "@/store/GameState";

export default function PlaceRoadButton() {
  const { phase, setPhase, playerResources, freeRoadCount, username, currentPlayer, myRoadCounts, discardInProgress, playerTurnCount, roadsPlacedThisTurn, housesPlacedThisTurn, dieRolledThisTurn } = useGameStore()

  const canBuyRoad = ((playerResources.BRICK >= 1 && playerResources.TREE >= 1) || freeRoadCount > 0) || myRoadCounts < 2;
  const myTurn = username === currentPlayer
  const setupPhaseRoadCriteria = playerTurnCount[username] in [0, 1] ? roadsPlacedThisTurn === 0 && housesPlacedThisTurn === 1 : dieRolledThisTurn;
  const maxRoadsReached = myRoadCounts >= 15;

  const canPlaceRoad = !maxRoadsReached && canBuyRoad && myTurn && !discardInProgress && setupPhaseRoadCriteria;

  return (
    <div className="transition-transform duration-200 hover:scale-110">
      <HoverCard openDelay={10} closeDelay={10}>
        <HoverCardTrigger>
          <Minus
            size={88}
            stroke="black"
            className={canPlaceRoad ? "hover:cursor-pointer" : "hover:cursor-not-allowed opacity-50"}
            onClick={() => {
              if (phase !== "road_placement" && canBuyRoad) setPhase("road_placement");
              else setPhase(null)
            }}
          />
          <div className="text-[10px] text-center leading-tight">Road</div>
        </HoverCardTrigger>
        <HoverCardContent className="w-fit">
          {freeRoadCount > 0 ? <div className="flex items-center h-full bg-amber-50 rounded-xl p-2">
            <p>{`Free Road (${freeRoadCount}) available`}</p>
          </div> : <div className="flex items-center h-full bg-amber-50 rounded-xl p-2">
            <ResourceCard resourceType="BRICK" count={1} size={60} hidden={playerResources.BRICK < 1} />
            <ResourceCard resourceType="TREE" count={1} size={60} hidden={playerResources.TREE < 1} />
          </div>}
          <div className="text-[10px] text-center">{`Placed (${myRoadCounts}/15)`}</div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}