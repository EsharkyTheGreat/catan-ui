import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { useGameStore } from "@/store/GameState";
import { CatanResource } from "@/lib/types";
import ResourceCard from "./ResourceCard";
import { Trash2 } from "lucide-react";
import { DiscardCardsEvent } from "@/lib/websocket";

const RESOURCES: { id: string, name: CatanResource, color: string, icon: string }[] = [
    { id: 'wood', name: 'TREE', color: 'bg-amber-700', icon: '🌲' },
    { id: 'brick', name: "BRICK", color: 'bg-red-700', icon: '🧱' },
    { id: 'sheep', name: 'SHEEP', color: 'bg-green-600', icon: "🐑" },
    { id: 'wheat', name: 'WHEAT', color: 'bg-yellow-600', icon: '🌾' },
    { id: 'ore', name: 'STONE', color: 'bg-gray-600', icon: '⛰️' }
];

export default function DiscardCardsDialog() {
    const { 
        mustDiscardCards, 
        playerResources,
        setMustDiscardCards,
        socket,
        username,
        discardInProgress
    } = useGameStore();

    const [cardsToDiscard, setCardsToDiscard] = useState<Record<CatanResource, number>>({
        BRICK: 0,
        SHEEP: 0,
        STONE: 0,
        TREE: 0,
        WHEAT: 0
    });
    const [hasSentDiscard, setHasSentDiscard] = useState(false);

    // Reset discard counts when dialog opens
    useEffect(() => {
        if (mustDiscardCards) {
            setCardsToDiscard({
                BRICK: 0,
                SHEEP: 0,
                STONE: 0,
                TREE: 0,
                WHEAT: 0
            });
            setHasSentDiscard(false);
        }
    }, [mustDiscardCards]);

    // Calculate current total cards
    const currentTotalCards = Object.values(playerResources).reduce((sum, count) => sum + count, 0);
    const totalCardsToDiscard = Object.values(cardsToDiscard).reduce((sum, count) => sum + count, 0);
    const minimumDiscardRequired = currentTotalCards > 0 
        ? Math.ceil(currentTotalCards / 2) 
        : 0;
    const cardsRemainingAfterDiscard = currentTotalCards - totalCardsToDiscard;
    const isValidDiscard = totalCardsToDiscard >= minimumDiscardRequired;

    const updateDiscard = (resource: CatanResource, delta: number) => {
        const newAmount = (cardsToDiscard[resource] || 0) + delta;
        const available = playerResources[resource] || 0;
        
        // Can't go below 0 or above available
        if (newAmount < 0 || newAmount > available) return;
        
        setCardsToDiscard(prev => ({
            ...prev,
            [resource]: newAmount
        }));
    };

    const handleDiscard = () => {
        if (!isValidDiscard) return;
        if (!username) return;
        if (!socket) return;
        
        // Send DISCARD_CARDS event to server
        const data: DiscardCardsEvent = {
            type: "DISCARD_CARDS",
            username: username,
            resources: cardsToDiscard
        };
        
        socket.send(JSON.stringify(data));
        
        // Keep discardInProgress flag set (it's already set by onDiscard handler)
        // Dialog will remain open until DISCARD_END is received
        setHasSentDiscard(true);
    };

    if (!mustDiscardCards) return null;

    return (
        <Dialog open={mustDiscardCards} onOpenChange={(open) => {
            // Prevent closing - dialog should only close when DISCARD_END is received
            // (which will set mustDiscardCards to false)
            if (!open && discardInProgress) return;
            setMustDiscardCards(open);
        }}>
            <DialogContent 
                className="max-w-2xl" 
                showCloseButton={false}
                onInteractOutside={(e) => {
                    // Prevent closing by clicking outside
                    if (!isValidDiscard) {
                        e.preventDefault();
                    }
                }}
                onEscapeKeyDown={(e) => {
                    // Prevent closing with Escape key
                    if (!isValidDiscard) {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-amber-900">
                        Discard Cards
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        You currently have {currentTotalCards} cards. 
                        You must discard {minimumDiscardRequired} cards (half of {currentTotalCards} rounded up).
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Current Status */}
                    <div className="bg-amber-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-amber-900">Cards to discard:</span>
                            <span className={`font-bold text-lg ${
                                totalCardsToDiscard >= minimumDiscardRequired 
                                    ? 'text-green-600' 
                                    : 'text-red-600'
                            }`}>
                                {totalCardsToDiscard} / {minimumDiscardRequired} minimum
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-amber-900">Cards remaining after discard:</span>
                            <span className="font-bold text-lg text-amber-900">
                                {cardsRemainingAfterDiscard}
                            </span>
                        </div>
                    </div>

                    {/* Resource Selection */}
                    <div>
                        <h3 className="text-lg font-bold text-amber-900 mb-3">Select Cards to Discard</h3>
                        <div className="grid grid-cols-5 gap-3">
                            {RESOURCES.map(res => {
                                const available = playerResources[res.name] || 0;
                                const selected = cardsToDiscard[res.name] || 0;
                                const canIncrement = selected < available;
                                
                                return (
                                    <div key={res.id} className="text-center">
                                        {/* Resource Card Display */}
                                        <div className="mb-2 flex justify-center">
                                            <div className="relative">
                                                <ResourceCard 
                                                    resourceType={res.name} 
                                                    count={available} 
                                                    size={80} 
                                                    hidden={available === 0}
                                                />
                                                {selected > 0 && (
                                                    <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                                        -{selected}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Resource Name */}
                                        <div className={`${res.color} text-white rounded-lg p-2 mb-2`}>
                                            <div className="text-xl mb-1">{res.icon}</div>
                                            <div className="text-xs uppercase font-semibold">{res.name}</div>
                                        </div>
                                        
                                        {/* Increment/Decrement Controls */}
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => updateDiscard(res.name, -1)}
                                                disabled={selected === 0 || hasSentDiscard}
                                                className="bg-red-500 text-white w-8 h-8 rounded-lg font-bold hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="font-bold text-lg w-8 text-center">
                                                {selected}
                                            </span>
                                            <button
                                                onClick={() => updateDiscard(res.name, 1)}
                                                disabled={!canIncrement || hasSentDiscard}
                                                className="bg-green-500 text-white w-8 h-8 rounded-lg font-bold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Validation Message */}
                    {!isValidDiscard && totalCardsToDiscard > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-700 text-sm">
                                You must discard at least {minimumDiscardRequired} cards (half of {currentTotalCards} rounded up).
                            </p>
                        </div>
                    )}

                    {/* Waiting Message or Discard Button */}
                    {hasSentDiscard ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                            <p className="text-blue-700 font-semibold">
                                Discard request sent! Waiting for other players to finish discarding...
                            </p>
                        </div>
                    ) : (
                        <button
                            onClick={handleDiscard}
                            disabled={!isValidDiscard}
                            className={`w-full py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                                isValidDiscard
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <Trash2 size={20} />
                            Discard {totalCardsToDiscard} Cards
                        </button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
