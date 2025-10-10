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

export default function BottomNavbar() {
  const { setPhase, socket, currentPlayer, lastRoll } = useGameStore();

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
      <div className="flex gap-1 px-2 items-center h-full bg-amber-50 rounded-xl">
        <div className="transition-transform duration-200 hover:scale-110">
          <TradePopup />
        </div>
      </div>
      <div className="flex gap-1 px-2 items-center h-full bg-amber-50 rounded-xl">
        <div className="transition-transform duration-200 hover:scale-110">
          <DevelopmentCardShop />
        </div>
      </div>
      <div className="flex px-2 items-center h-full bg-amber-50 rounded-xl">
        <div className="transition-transform duration-200 hover:scale-110">
          <Minus
            size={88}
            stroke="black"
            className=""
            onClick={() => {
              setPhase("road_placement");
            }}
          />
        </div>
      </div>
      <div className="flex px-2 items-center h-full bg-amber-50 rounded-xl">
        <div className="transition-transform duration-200 hover:scale-110">
          <House
            size={88}
            stroke="black"
            className=""
            onClick={() => {
              setPhase("house_placement");
            }}
          />
        </div>
      </div>
      <div className="flex px-2 items-center h-full bg-amber-50 rounded-xl">
        <div className="transition-transform duration-200 hover:scale-110">
          <Building
            size={88}
            stroke="black"
            className=""
            onClick={() => {
              setPhase("settlement_placement");
            }}
          />
        </div>
      </div>
      <div className=" flex px-2 items-center h-full bg-amber-50 rounded-xl">
        <div className="transition-transform duration-200 hover:scale-110">
          <Spade size={88} stroke="black" className="" />
        </div>
      </div>
      <div className="flex px-2 items-center h-full bg-amber-50 rounded-xl hover:cursor-pointer" onClick={()=>diceRoll()}>
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
