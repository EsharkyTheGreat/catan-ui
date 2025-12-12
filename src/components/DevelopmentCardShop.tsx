import { Hammer, Play } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DevelopmentCardType, CatanResource } from "@/lib/types";
import Image from "next/image";
import { useGameStore } from "@/store/GameState";
import { UseMonopolyEvent, UseTwoFreeRoadsEvent, UseYearOfPlentyEvent } from "@/lib/websocket";
import { useState } from "react";

const getCardColor = (name: DevelopmentCardType) => {
    const colors = {
        "Knight": 'from-red-500 to-red-600',
        "Victory Point": 'from-yellow-500 to-yellow-600',
        "Road Building": 'from-blue-500 to-blue-600',
        "Year of Plenty": 'from-green-500 to-green-600',
        "Monopoly": 'from-purple-500 to-purple-600',
    };
    return colors[name] || 'from-gray-500 to-gray-600';
};

const developmentCardsDescriptions: Record<DevelopmentCardType,string> = {
    "Road Building": 'Place 2 free roads',
    "Victory Point": 'Gain 1 victory point',
    "Knight": 'Move the robber and steal a resource',
    "Monopoly": 'Take all resources of one type',
    "Year of Plenty": 'Take 2 resources from the bank',
}

const allDevelopmentCards: DevelopmentCardType[] = ["Road Building","Victory Point","Knight","Monopoly","Year of Plenty"]

const RESOURCES: {id: string, name: CatanResource, color: string, icon: string}[] = [
    { id: 'wood', name: 'TREE', color: 'bg-amber-700', icon: '🌲' },
    { id: 'brick', name: "BRICK", color: 'bg-red-700', icon: '🧱' },
    { id: 'sheep', name: 'SHEEP', color: 'bg-green-600', icon: "🐑" },
    { id: 'wheat', name: 'WHEAT', color: 'bg-yellow-600', icon: '🌾' },
    { id: 'ore', name: 'STONE', color: 'bg-gray-600', icon: '⛰️' }
];

export default function DevelopmentCardShop() {
    const { playerDevelopmentCards, socket, currentPlayer } = useGameStore()
    const [monopolyDialogOpen, setMonopolyDialogOpen] = useState(false);
    const [yearOfPlentyDialogOpen, setYearOfPlentyDialogOpen] = useState(false);
    const [selectedMonopolyResource, setSelectedMonopolyResource] = useState<CatanResource | null>(null);
    const [selectedYearOfPlentyResources, setSelectedYearOfPlentyResources] = useState<Record<CatanResource, number>>({
        BRICK: 0, SHEEP: 0, STONE: 0, TREE: 0, WHEAT: 0
    });

    const playRoadBuildingCard = () => {
        if (!socket) return;
        if (!currentPlayer) return;
        const data: UseTwoFreeRoadsEvent = {
            type : "PLACE_TWO_FREE_ROADS",
            username: currentPlayer
        }
        socket.send(JSON.stringify(data))
    }

    const handlePlayCard = (cardId: DevelopmentCardType) => {
        if (cardId === "Road Building") {
            playRoadBuildingCard()
        } else if (cardId === "Monopoly") {
            setMonopolyDialogOpen(true);
        } else if (cardId === "Year of Plenty") {
            setYearOfPlentyDialogOpen(true);
        }
    };

    const handleMonopolyConfirm = () => {
        if (!selectedMonopolyResource || !socket || !currentPlayer) return;
        const data: UseMonopolyEvent = {
            type: "USE_MONOPOLY_CARD",
            username: currentPlayer,
            resource: selectedMonopolyResource
        };
        socket.send(JSON.stringify(data));
        setMonopolyDialogOpen(false);
        setSelectedMonopolyResource(null);
    };

    const handleYearOfPlentyConfirm = () => {
        const selectedResources = {...selectedYearOfPlentyResources};
        const totalSelected = Object.values(selectedYearOfPlentyResources).reduce((sum, count) => sum + count, 0);
        if (totalSelected !== 2 || !socket || !currentPlayer) return;
        const resource1 = Object.keys(selectedResources).find(key => selectedResources[key as CatanResource] >= 1);
        selectedResources[resource1 as CatanResource] -= 1;
        const resource2 = Object.keys(selectedResources).find(key => selectedResources[key as CatanResource] === 1);
        selectedResources[resource2 as CatanResource] -= 1;
        const data: UseYearOfPlentyEvent = {
            type: "USE_YEAR_OF_PLENTY_CARD",
            username: currentPlayer,
            resource1: resource1 as CatanResource,
            resource2: resource2 as CatanResource
        };
        socket.send(JSON.stringify(data));
        setYearOfPlentyDialogOpen(false);
        setSelectedYearOfPlentyResources({ BRICK: 0, SHEEP: 0, STONE: 0, TREE: 0, WHEAT: 0 });
    };

    const updateYearOfPlentyResource = (resource: CatanResource, delta: number) => {
        const currentTotal = Object.values(selectedYearOfPlentyResources).reduce((sum, count) => sum + count, 0);
        const newAmount = (selectedYearOfPlentyResources[resource] || 0) + delta;
        if (newAmount < 0) return;
        if (delta > 0 && currentTotal >= 2) return; // Can't select more than 2 total
        
        setSelectedYearOfPlentyResources(prev => ({
            ...prev,
            [resource]: newAmount
        }));
    };

    return (
        <>
        <Dialog>
            <DialogTrigger asChild>
                <Hammer size={88} stroke="black" className="" />
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle className="text-4xl font-bold text-gray-800 mb-2 text-center">Development Cards</DialogTitle>
                    <DialogDescription className="text-gray-600 mb-8 text-center">Play your cards when available</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4">
                    {allDevelopmentCards.map((card,idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                        >
                            <div className={`h-2 bg-gradient-to-r ${getCardColor(card)}`} />

                            <div className="p-6 flex gap-4">
                                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                    {card === "Knight" && <Image alt="CatanRobber" src={"/CatanRobberCard.png"} height={72} width={72} />}
                                    {card === "Victory Point" && <Image alt="VictoryPoint" src={"/VictoryPoint.png"} height={72} width={72} />}
                                    {card === "Road Building" && <Image alt="RoadBuildingCard" src={"/RoadBuildingCard.png"} height={72} width={72} /> }
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-xl font-bold text-gray-800">{card}</h3>
                                                {playerDevelopmentCards[card]>0 && (
                                                    <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                                        {playerDevelopmentCards[card]}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">{developmentCardsDescriptions[card]}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded ${playerDevelopmentCards[card]>0
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            { playerDevelopmentCards[card]>0 ? 'Available' : 'Unavailable'}
                                        </span>
                                        {card !== "Victory Point" &&
                                            <button
                                                onClick={() => handlePlayCard(card)}
                                                disabled={playerDevelopmentCards[card]==0}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${playerDevelopmentCards[card]>0 
                                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg'
                                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    }`}
                                            >
                                                <Play className="w-4 h-4" />
                                                Play
                                            </button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">Card Summary</h2>
                    <div className="flex gap-6 text-sm">
                        <div>
                            <span className="font-semibold text-gray-700">Total Type of Cards: </span>
                            <span className="text-gray-600">{Object.keys(playerDevelopmentCards).length}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-700">Available: </span>
                            <span className="text-blue-600">{Object.values(playerDevelopmentCards).reduce((acc,val)=>acc+val,0)}</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        {/* Monopoly Dialog */}
        <Dialog open={monopolyDialogOpen} onOpenChange={setMonopolyDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-purple-800">Monopoly Card</DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Select a resource type. You will take all resources of that type from all other players.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-5 gap-3 mt-4">
                    {RESOURCES.map(res => (
                        <button
                            key={res.id}
                            onClick={() => setSelectedMonopolyResource(res.name)}
                            className={`${res.color} text-white rounded-lg p-4 transition-all ${
                                selectedMonopolyResource === res.name
                                    ? 'ring-4 ring-purple-400 scale-105'
                                    : 'hover:scale-105 hover:opacity-90'
                            }`}
                        >
                            <div className="text-3xl mb-2">{res.icon}</div>
                            <div className="text-xs uppercase font-semibold">{res.name}</div>
                        </button>
                    ))}
                </div>
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => {
                            setMonopolyDialogOpen(false);
                            setSelectedMonopolyResource(null);
                        }}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleMonopolyConfirm}
                        disabled={!selectedMonopolyResource}
                        className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                            selectedMonopolyResource
                                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Confirm
                    </button>
                </div>
            </DialogContent>
        </Dialog>

        {/* Year of Plenty Dialog */}
        <Dialog open={yearOfPlentyDialogOpen} onOpenChange={setYearOfPlentyDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-green-800">Year of Plenty Card</DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Select 2 resources from the bank to add to your hand.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-5 gap-3 mt-4">
                    {RESOURCES.map(res => (
                        <div key={res.id} className="text-center">
                            <div className={`${res.color} text-white rounded-lg p-3 mb-2`}>
                                <div className="text-2xl mb-1">{res.icon}</div>
                                <div className="text-xs uppercase">{res.name}</div>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <button
                                    onClick={() => updateYearOfPlentyResource(res.name, -1)}
                                    className="bg-red-500 text-white w-8 h-8 rounded-lg font-bold hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    disabled={selectedYearOfPlentyResources[res.name] === 0}
                                >
                                    -
                                </button>
                                <span className="font-bold text-lg w-8">{selectedYearOfPlentyResources[res.name] || 0}</span>
                                <button
                                    onClick={() => updateYearOfPlentyResource(res.name, 1)}
                                    className="bg-green-500 text-white w-8 h-8 rounded-lg font-bold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    disabled={Object.values(selectedYearOfPlentyResources).reduce((sum, count) => sum + count, 0) >= 2}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 text-center text-sm text-gray-600">
                    Selected: {Object.values(selectedYearOfPlentyResources).reduce((sum, count) => sum + count, 0)} / 2
                </div>
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => {
                            setYearOfPlentyDialogOpen(false);
                            setSelectedYearOfPlentyResources({ BRICK: 0, SHEEP: 0, STONE: 0, TREE: 0, WHEAT: 0 });
                        }}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleYearOfPlentyConfirm}
                        disabled={Object.values(selectedYearOfPlentyResources).reduce((sum, count) => sum + count, 0) !== 2}
                        className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                            Object.values(selectedYearOfPlentyResources).reduce((sum, count) => sum + count, 0) === 2
                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Confirm
                    </button>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}