import { Building } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import ResourceCard from "./ResourceCard";
import { useGameStore } from "@/store/GameState";

export default function PlaceSettlementButton() {

    const { phase, setPhase, playerResources, username, currentPlayer } = useGameStore()
    const canBuySettlement = playerResources.STONE >= 3 && playerResources.WHEAT >= 2
    const myTurn = username === currentPlayer
    
    return (
        <div className="transition-transform duration-200 hover:scale-110">
          <HoverCard openDelay={10} closeDelay={10}>
            <HoverCardTrigger>
              <Building
                size={88}
                stroke="black"
                className={myTurn && canBuySettlement ? "hover:cursor-pointer" : "hover:cursor-not-allowed"}
                onClick={() => {
                  if (phase !== "settlement_placement" && myTurn && canBuySettlement) setPhase("settlement_placement");
                  else setPhase(null)
                }}
              />
              <div className="text-[10px] text-center leading-tight">Settlement</div>
            </HoverCardTrigger>
            <HoverCardContent className="w-fit">
              <div className="flex items-center h-full bg-amber-50 rounded-xl">
                <ResourceCard resourceType="STONE" count={3} size={60} hidden={playerResources.STONE < 3}/>
                <ResourceCard resourceType="WHEAT" count={2} size={60} hidden={playerResources.WHEAT < 2}/>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
    )
}