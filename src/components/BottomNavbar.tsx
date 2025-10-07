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

export default function BottomNavbar() {
  const { setPhase, socket, currentPlayer, lastRoll, playerResources } = useGameStore();

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
      <div className="flex gap-1 px-2 items-center h-full bg-amber-50 rounded-xl">
        <div className="transition-transform duration-200 hover:scale-110 relative">
          <Image
            className=""
            src={"/ForestResourceCard.png"}
            width={90}
            height={90}
            alt="ForestResourceCard"
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[75%] text-white text-[12px] font-bold drop-shadow-sm select-none">
            {playerResources.TREE}
          </div>
        </div>
        <div className="transition-transform duration-200 hover:scale-110 relative">
          <Image
            className=""
            src={"/BrickResourceCard.png"}
            width={90}
            height={90}
            alt="BrickResourceCard"
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[75%] text-white text-[12px] font-bold drop-shadow-sm select-none">
            {playerResources.BRICK}
          </div>
        </div>
        <div className="transition-transform duration-200 hover:scale-110 relative">
          <Image
            className=""
            src={"/WheatResourceCard.png"}
            width={90}
            height={90}
            alt="WheatResourceCard"
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[75%] text-white text-[12px] font-bold drop-shadow-sm select-none">
            {playerResources.WHEAT}
          </div>
        </div>
        <div className="transition-transform duration-200 hover:scale-110 relative">
          <Image
            className=""
            src={"/SheepResourceCard.png"}
            width={90}
            height={90}
            alt="SheepResourceCard"
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[75%] text-white text-[12px] font-bold drop-shadow-sm select-none">
            {playerResources.SHEEP}
          </div>
        </div>
        <div className="transition-transform duration-200 hover:scale-110 relative">
          <Image
            className=""
            src={"/StoneResourceCard.png"}
            width={90}
            height={90}
            alt="StoneResourceCard"
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[75%] text-white text-[12px] font-bold drop-shadow-sm select-none">
            {playerResources.STONE}
          </div>
        </div>
      </div>
      <div className="flex gap-1 px-2 items-center h-full bg-amber-50 rounded-xl">
        <div className="transition-transform duration-200 hover:scale-110">
          <Dialog>
            <DialogTrigger asChild>
              <Handshake size={88} stroke="black" className="" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Trade</DialogTitle>
                <DialogDescription>Trade</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex gap-1 px-2 items-center h-full bg-amber-50 rounded-xl">
        <div className="transition-transform duration-200 hover:scale-110">
          <Dialog>
            <DialogTrigger asChild>
              <Hammer size={88} stroke="black" className="" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buy Development Card</DialogTitle>
                <DialogDescription>Buy Development Card</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
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
