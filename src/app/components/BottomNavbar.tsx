import { Building, Check, Dice1, Hammer, Handshake, House, Minus, Play, Spade } from "lucide-react";
import Image from "next/image";
import { useGameStore } from "../store/GameState";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";

export default function BottomNavbar() {

    const { setPhase } = useGameStore()

    return (
        <div className="flex h-full gap-1">
            <div className="flex gap-1 px-2 items-center h-full bg-amber-50 rounded-xl">
                <div className="transition-transform duration-200 hover:scale-110">
                    <Image className="" src={"/ForestResourceCard.png"} width={90} height={90} alt="ForestResourceCard" />
                </div>
                <div className="transition-transform duration-200 hover:scale-110">
                    <Image className="" src={"/BrickResourceCard.png"} width={90} height={90} alt="BrickResourceCard" /> 
                </div>
                <div className="transition-transform duration-200 hover:scale-110">
                    <Image className="" src={"/WheatResourceCard.png"} width={90} height={90} alt="WheatResourceCard" /> 
                </div>
                <div className="transition-transform duration-200 hover:scale-110">
                    <Image className="" src={"/SheepResourceCard.png"} width={90} height={90} alt="SheepResourceCard" /> 
                </div>
                <div className="transition-transform duration-200 hover:scale-110">
                    <Image className="" src={"/StoneResourceCard.png"} width={90} height={90} alt="StoneResourceCard" /> 
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
                            <Hammer size={88} stroke="black" className=""/>
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
                    <Minus size={88} stroke="black" className="" onClick={()=>{setPhase("road_placement")}} />
                </div>
            </div>
            <div className="flex px-2 items-center h-full bg-amber-50 rounded-xl">
                <div className="transition-transform duration-200 hover:scale-110">
                    <House size={88} stroke="black" className="" onClick={()=>{setPhase("house_placement")}} />
                </div>
            </div>
            <div className="flex px-2 items-center h-full bg-amber-50 rounded-xl">
                <div className="transition-transform duration-200 hover:scale-110">
                    <Building size={88} stroke="black" className="" onClick={()=>{setPhase("settlement_placement")}} />
                </div>
            </div>
            <div className=" flex px-2 items-center h-full bg-amber-50 rounded-xl">
                <div className="transition-transform duration-200 hover:scale-110">
                    <Spade size={88} stroke="black" className="" />
                </div>
            </div>
            <div className="flex px-2 items-center h-full bg-amber-50 rounded-xl hover:cursor-pointer">
                <Dice1 size={88} stroke="black" className="" />
                <Dice1 size={88} stroke="black" className="" />
            </div>
            <div className=" flex px-2 items-center h-full bg-amber-50 rounded-xl">
                <div className="transition-transform duration-200 hover:scale-110">
                    <Check size={88} stroke="black" className="" />
                </div>
            </div>
        </div>
        
    )
}