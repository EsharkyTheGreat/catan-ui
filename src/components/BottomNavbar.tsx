import {
  Building,
  Check,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Hammer,
  Handshake,
  House,
  Minus,
  Play,
  Spade,
} from "lucide-react";
import Image from "next/image";
import { useGameStore } from "../store/GameState";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { DiceRollRequestEvent } from "@/lib/websocket";
import ResourceCount from "./ResourceCount";
import TradePopup from "./TradePopup";
import DevelopmentCardShop from "./DevelopmentCardShop";
import { HoverCard, HoverCardContent } from "./ui/hover-card";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import ResourceCard from "./ResourceCard";
import BuyDevelopmentCardButton from "./BuyDevelopmentCardButton";

export default function BottomNavbar() {
  const { phase, setPhase, socket, currentPlayer, lastRoll, playerResources } = useGameStore();

  const diceComponentMap: Record<number, any> = {
    1: Dice1,
    2: Dice2,
    3: Dice3,
    4: Dice4,
    5: Dice5,
    6: Dice6,
  };

  const diceRoll = () => {
    if (!currentPlayer) return;
    if (!socket) return;
    const data: DiceRollRequestEvent = {
      type: "DICE_ROLL_REQUEST",
      username: currentPlayer,
    }
    socket.send(JSON.stringify(data))
  }

  return (
    <div className="flex h-full gap-1">
      <ResourceCount />
      <div className="flex gap-1 px-2 items-center h-full bg-amber-900 rounded-xl">
        <div className="transition-transform duration-200 hover:scale-110">
          <TradePopup />
          <div className="text-[10px] text-center leading-tight">Trade</div>
        </div>
      </div>
      <div className="flex gap-1 px-2 items-center h-full bg-amber-50 rounded-xl">
        <div className="transition-transform duration-200 hover:scale-110">
          <DevelopmentCardShop />
          <div className="text-[10px] text-center leading-tight">Play Development Card</div>
        </div>
      </div>
      <div className="flex px-2 items-center h-full bg-amber-50 rounded-xl">
        <div className="transition-transform duration-200 hover:scale-110">
          <HoverCard openDelay={10} closeDelay={10}>
            <HoverCardTrigger>
              <Minus
                size={88}
                stroke="black"
                className=""
                onClick={() => {
                  setPhase("road_placement");
                }}
              />
              <div className="text-[10px] text-center leading-tight">Road</div>
            </HoverCardTrigger>
            <HoverCardContent className="w-fit">
              <div className="flex items-center h-full bg-amber-50 rounded-xl">
                <ResourceCard resourceType="BRICK" count={1} size={60} hidden={playerResources.BRICK < 1}/>
                <ResourceCard resourceType="TREE" count={1} size={60} hidden={playerResources.TREE < 1}/>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
      <div className="flex px-2 items-center h-full bg-amber-50 rounded-xl">
        <div className="transition-transform duration-200 hover:scale-110">
          <HoverCard openDelay={10} closeDelay={10}>
            <HoverCardTrigger>
              <House
                size={88}
                stroke="black"
                className=""
                onClick={() => {
                  if (phase !== "house_placement") setPhase("house_placement");
                  else setPhase(null);
                }}
              />
              <div className="text-[10px] text-center leading-tight">House</div>
            </HoverCardTrigger>
            <HoverCardContent className="w-fit">
              <div className="flex items-center h-full bg-amber-50 rounded-xl">
                <ResourceCard resourceType="BRICK" count={1} size={60} hidden={playerResources.BRICK < 1}/>
                <ResourceCard resourceType="TREE" count={1} size={60} hidden={playerResources.TREE < 1} />
                <ResourceCard resourceType="SHEEP" count={1} size={60} hidden={playerResources.SHEEP < 1}/>
                <ResourceCard resourceType="WHEAT" count={1} size={60} hidden={playerResources.WHEAT < 1}/>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
      <div className="flex px-2 items-center h-full bg-amber-50 rounded-xl">
        <div className="transition-transform duration-200 hover:scale-110">
          <HoverCard openDelay={10} closeDelay={10}>
            <HoverCardTrigger>
              <Building
                size={88}
                stroke="black"
                className=""
                onClick={() => {
                  if (phase !== "settlement_placement") setPhase("settlement_placement");
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
      </div>
      <div className=" flex px-2 items-center h-full bg-amber-50 rounded-xl">
        <BuyDevelopmentCardButton />
      </div>
      <div className="flex px-2 items-center h-full bg-amber-50 rounded-xl hover:cursor-pointer" onClick={() => diceRoll()}>
        {(() => {
          const DieLeft = diceComponentMap[lastRoll?.die1 ?? 1] ?? Dice1;
          const DieRight = diceComponentMap[lastRoll?.die2 ?? 1] ?? Dice1;
          return (
            <>
              <DieLeft size={88} stroke="black" className="" />
              <DieRight size={88} stroke="black" className="" />
            </>
          );
        })()}
      </div>
      <div className=" flex px-2 items-center h-full bg-amber-50 rounded-xl">
        <div className="transition-transform duration-200 hover:scale-110">
          <Check size={88} stroke="black" className="" />
        </div>
      </div>
    </div>
  );
}
