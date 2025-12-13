import { HoverCard, HoverCardTrigger, HoverCardContent } from "@radix-ui/react-hover-card";
import { Minus } from "lucide-react";
import ResourceCard from "@/components/ResourceCard";
import { useGameStore } from "@/store/GameState";

export default function PlaceRoadButton() {
    const {phase, setPhase, playerResources, freeRoadCount, username, currentPlayer, myRoadCounts, discardInProgress} = useGameStore()

    const canBuyRoad = ((playerResources.BRICK >= 1 && playerResources.TREE >= 1) || freeRoadCount > 0) || myRoadCounts < 2;
    const myTurn = username === currentPlayer

    return (
        <div className="transition-transform duration-200 hover:scale-110">
          <HoverCard openDelay={10} closeDelay={10}>
            <HoverCardTrigger>
              <Minus
                size={88}
                stroke="black"
                className={canBuyRoad && myTurn && !discardInProgress ? "hover:cursor-pointer" : "hover:cursor-not-allowed"}
                onClick={() => {
                  if (phase !== "road_placement" && canBuyRoad && !discardInProgress) setPhase("road_placement");
                  else setPhase(null)
                }}
              />
              <div className="text-[10px] text-center leading-tight">Road</div>
            </HoverCardTrigger>
            <HoverCardContent className="w-fit">
              <div className="flex items-center h-full bg-amber-50 rounded-xl p-2">
                <ResourceCard resourceType="BRICK" count={1} size={60} hidden={playerResources.BRICK < 1}/>
                <ResourceCard resourceType="TREE" count={1} size={60} hidden={playerResources.TREE < 1}/>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
    )
}