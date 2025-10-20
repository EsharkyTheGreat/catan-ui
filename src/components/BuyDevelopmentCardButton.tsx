import { Spade } from "lucide-react";
import ResourceCard from "@/components/ResourceCard";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useGameStore } from "@/store/GameState";
import { BuyDevelopmentCardEvent } from "@/lib/websocket";

export default function BuyDevelopmentCardButton() {
    const { playerResources, currentPlayer, socket } = useGameStore()

    const canBuyDevelopmentCard = playerResources.SHEEP >= 1 && playerResources.STONE >= 1 && playerResources.WHEAT >= 1

    const buyDevelopmentCard = () => {
        if (!currentPlayer) return;
        if (!socket) return;
        if (!canBuyDevelopmentCard) return;
        const data: BuyDevelopmentCardEvent = {
          type: "DEVELOPMENT_CARD_BUY_REQUEST",
          username: currentPlayer
        }
        socket.send(JSON.stringify(data))
    }


    return (
        <div className="transition-transform duration-200 hover:scale-110">
          <HoverCard openDelay={10} closeDelay={10}>
            <HoverCardTrigger>
              <Spade size={64} stroke="black" className={canBuyDevelopmentCard ? "hover:cursor-pointer" : "hover:cursor-not-allowed"} onClick={()=>buyDevelopmentCard()} />
              <div className="text-[10px] text-center leading-tight">Buy Development Card</div>
            </HoverCardTrigger>
            <HoverCardContent className="w-fit">
              <div className="flex items-center h-full bg-amber-50 rounded-xl">
                <ResourceCard resourceType="STONE" count={1} size={60} hidden={playerResources.STONE == 0} />
                <ResourceCard resourceType="WHEAT" count={1} size={60} hidden={playerResources.WHEAT == 0}/>
                <ResourceCard resourceType="SHEEP" count={1} size={60} hidden={playerResources.SHEEP == 0} />
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
    )
}