import { Building2, Handshake, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useGameStore } from "@/store/GameState";
import ResourceCount from "./ResourceCount";
import { useState } from "react";
import TradeModeSelector from "./TradeModeSelector";
import BankTrade from "./BankTrade";
import PlayerTradeCreator from "./PlayerTradeCreator";

export default function TradePopup() {
    const [tradeMode, setTradeMode] = useState<'bank' | 'player'>('bank');

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Handshake size={88} stroke="black" className="" />
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Trade</DialogTitle>
                <DialogContent>
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h1 className="text-3xl font-bold text-amber-900 text-center">Catan Trade Center</h1>
                        {/* <p className="text-amber-700 text-center">Exchange resources to build your settlement</p> */}
                    </div>
                    {/* My Resources */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold text-amber-900">Your Resources</h2>
                        <ResourceCount />
                    </div>
                    {/* Trade Mode Selector */}
                    <TradeModeSelector tradeMode={tradeMode} setTradeMode={setTradeMode} />
                    {/* Bank Trade */}
                    {tradeMode === 'bank' && <BankTrade />}
                    {/* Player Trade */}
                    {tradeMode === 'player' && <PlayerTradeCreator />}
                </DialogContent>
            </DialogContent>
        </Dialog>
    )
}