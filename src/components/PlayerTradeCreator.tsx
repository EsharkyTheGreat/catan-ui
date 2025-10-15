import { CatanResource } from "@/lib/types";
import { TradeCreateEvent } from "@/lib/websocket";
import { useGameStore } from "@/store/GameState";
import { Send, X } from "lucide-react";
import { useState } from "react";

const RESOURCES: {id: string, name: CatanResource, color: string, icon: string}[] = [
    { id: 'wood', name: 'TREE', color: 'bg-amber-700', icon: '🌲' },
    { id: 'brick', name: "BRICK", color: 'bg-red-700', icon: '🧱' },
    { id: 'sheep', name: 'SHEEP', color: 'bg-green-600', icon: "🐑" },
    { id: 'wheat', name: 'WHEAT', color: 'bg-yellow-600', icon: '🌾' },
    { id: 'ore', name: 'STONE', color: 'bg-gray-600', icon: '⛰️' }
];

export default function PlayerTradeCreator() {
    const [offering, setOffering] = useState<Record<CatanResource,number>>({BRICK:0,SHEEP:0,STONE:0,TREE:0,WHEAT:0});
    const [requesting, setRequesting] = useState<Record<CatanResource,number>>({BRICK:0,SHEEP:0,STONE:0,TREE:0,WHEAT:0});
    const { playerResources, socket, currentPlayer } = useGameStore();

    const clearPlayerTrade = () => {
        setOffering({BRICK:0,SHEEP:0,STONE:0,TREE:0,WHEAT:0});
        setRequesting({BRICK:0,SHEEP:0,STONE:0,TREE:0,WHEAT:0});
    };

    const updateOffering = (resource: CatanResource, delta: number) => {
        const newAmount = (offering[resource] || 0) + delta;
        if (newAmount < 0 || newAmount > playerResources[resource]) return;
        
        setOffering(prev => ({
          ...prev,
          [resource]: newAmount === 0 ? undefined : newAmount
        }));
    };

    const updateRequesting = (resource: CatanResource, delta: number) => {
        const newAmount = (requesting[resource] || 0) + delta;
        if (newAmount < 0) return;
        
        setRequesting(prev => ({
          ...prev,
          [resource]: newAmount === 0 ? undefined : newAmount
        }));
    };

    const canSendTrade = () => {
        const hasOffering = Object.values(offering).some(v => v > 0);
        const hasRequesting = Object.values(requesting).some(v => v > 0);
        return hasOffering && hasRequesting;
    };

    const sendTradeOffer = () => {
        if (!currentPlayer) return;
        if (!canSendTrade()) return;
        // alert('Trade offer sent to all players!');
        const data: TradeCreateEvent = {
            type: "TRADE_CREATE",
            offering: offering,
            receiving: requesting,
            username: currentPlayer
        }
        socket?.send(JSON.stringify(data))
        setOffering({BRICK:0,SHEEP:0,STONE:0,TREE:0,WHEAT:0});
        setRequesting({BRICK:0,SHEEP:0,STONE:0,TREE:0,WHEAT:0});
    };

    return (
        (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-amber-900">Trade with Players</h2>
                    <button
                        onClick={clearPlayerTrade}
                        className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                    >
                        <X size={20} />
                        Clear
                    </button>
                </div>

                {/* Offering */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-amber-900 mb-3">You Offer</h3>
                    <div className="grid grid-cols-5 gap-3">
                        {RESOURCES.map(res => (
                            <div key={res.id} className="text-center">
                                <div className={`${res.color} text-white rounded-lg p-3 mb-2`}>
                                    <div className="text-2xl mb-1">{res.icon}</div>
                                    <div className="text-xs uppercase">{res.name}</div>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => updateOffering(res.name, -1)}
                                        className="bg-red-500 text-white w-8 h-8 rounded-lg font-bold hover:bg-red-600"
                                    >
                                        -
                                    </button>
                                    <span className="font-bold text-lg w-8">{offering[res.name] || 0}</span>
                                    <button
                                        onClick={() => updateOffering(res.name, 1)}
                                        className="bg-green-500 text-white w-8 h-8 rounded-lg font-bold hover:bg-green-600"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Requesting */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-amber-900 mb-3">You Request</h3>
                    <div className="grid grid-cols-5 gap-3">
                        {RESOURCES.map(res => (
                            <div key={res.id} className="text-center">
                                <div className={`${res.color} text-white rounded-lg p-3 mb-2`}>
                                    <div className="text-2xl mb-1">{res.icon}</div>
                                    <div className="text-xs uppercase">{res.name}</div>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => updateRequesting(res.name, -1)}
                                        className="bg-red-500 text-white w-8 h-8 rounded-lg font-bold hover:bg-red-600"
                                    >
                                        -
                                    </button>
                                    <span className="font-bold text-lg w-8">{requesting[res.name] || 0}</span>
                                    <button
                                        onClick={() => updateRequesting(res.name, 1)}
                                        className="bg-green-500 text-white w-8 h-8 rounded-lg font-bold hover:bg-green-600"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={sendTradeOffer}
                    disabled={!canSendTrade()}
                    className={`w-full py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${canSendTrade()
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    <Send size={20} />
                    Send Trade Offer
                </button>
            </div>
        )
    )
}