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
import PlaceRoadButton from "./PlaceRoadButton";
import PlaceHouseButton from "./PlaceHouseButton";
import PlaceSettlementButton from "./PlaceSettlementButton";
import DieButton from "./DieButton";
import EndTurnButton from "./EndTurnButton";

export default function BottomNavbar() {
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
      <div className=" flex px-2 items-center h-full bg-amber-50 rounded-xl">
        <PlaceRoadButton />
      </div>
      <div className="flex px-2 items-center h-full bg-amber-50 rounded-xl">
        <PlaceHouseButton />
      </div>
      <div className="flex px-2 items-center h-full bg-amber-50 rounded-xl">
        <PlaceSettlementButton />
      </div>
      <div className=" flex px-2 items-center h-full bg-amber-50 rounded-xl">
        <BuyDevelopmentCardButton />
      </div>
      <DieButton />
      <div className=" flex px-2 items-center h-full bg-amber-50 rounded-xl">
        <EndTurnButton />
      </div>
    </div>
  );
}
