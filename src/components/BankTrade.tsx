import { CatanResource } from "@/lib/types"
import { BankTradeRequestEvent } from "@/lib/websocket";
import { useGameStore } from "@/store/GameState";
import { ArrowRightLeft } from "lucide-react";
import { useState } from "react"

const RESOURCES: { id: string, name: CatanResource, color: string, icon: string }[] = [
    { id: 'wood', name: 'TREE', color: 'bg-amber-700', icon: '🌲' },
    { id: 'brick', name: "BRICK", color: 'bg-red-700', icon: '🧱' },
    { id: 'sheep', name: 'SHEEP', color: 'bg-green-600', icon: "🐑" },
    { id: 'wheat', name: 'WHEAT', color: 'bg-yellow-600', icon: '🌾' },
    { id: 'ore', name: 'STONE', color: 'bg-gray-600', icon: '⛰️' }
];

export default function BankTrade() {
    const { playerResources, socket, username, players } = useGameStore()

    const myPlayer = players.find(player => player.name === username)
    if (!myPlayer) return null;

    const [bankGiving, setBankGiving] = useState<CatanResource | "">("")
    const [bankGetting, setBankGetting] = useState<CatanResource | "">("")

    const getBankRate = (resource: CatanResource | "") => {
        if (!resource) return 4;
        return myPlayer.tradeRatio[resource];
    };

    const canExecuteBankTrade = () => {
        if (!bankGiving || !bankGetting) return false;
        const rate = getBankRate(bankGiving);
        return bankGiving &&
            bankGetting &&
            playerResources[bankGiving] >= rate &&
            bankGiving !== bankGetting;
    };

    const executeBankTrade = () => {
        if (!username) return;
        if (!canExecuteBankTrade()) return;
        setBankGiving('');
        setBankGetting('');
        const data: BankTradeRequestEvent = {
            type: "BANK_TRADE_REQUEST",
            resource_giving: bankGiving as CatanResource,
            resource_taking: bankGetting as CatanResource,
            username: username
        }
        socket?.send(JSON.stringify(data))
    };


    return (
        (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-amber-900">Trade with Bank</h2>

                <div className="flex items-center gap-6">
                    {/* Give */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-amber-900 mb-2">
                            You Give ({getBankRate(bankGiving)})
                        </label>
                        <select
                            value={bankGiving}
                            onChange={(e) => setBankGiving(e.target.value as CatanResource)}
                            className="w-full p-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-600"
                        >
                            <option value="">Select resource</option>
                            {RESOURCES.map(res => (
                                <option key={res.id} value={res.name} disabled={playerResources[res.name] < getBankRate(res.name)}>
                                    {res.icon} {res.id} ({playerResources[res.name]} available)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-shrink-0 pt-6">
                        <ArrowRightLeft className="text-amber-600" size={32} />
                    </div>

                    {/* Get */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-amber-900 mb-2">You Get (1)</label>
                        <select
                            value={bankGetting}
                            onChange={(e) => setBankGetting(e.target.value as CatanResource)}
                            className="w-full p-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-600"
                        >
                            <option value="">Select resource</option>
                            {RESOURCES.map(res => (
                                <option key={res.id} value={res.name} disabled={res.id === bankGiving}>
                                    {res.icon} {res.id}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={executeBankTrade}
                    disabled={!canExecuteBankTrade()}
                    className={`w-full mt-6 py-3 rounded-lg font-bold text-lg transition-all ${canExecuteBankTrade()
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Execute Trade
                </button>
            </div>
        )
    )
}