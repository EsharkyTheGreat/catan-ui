import { Hammer, Play } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DevelopmentCardType } from "@/lib/types";
import Image from "next/image";
import { useGameStore } from "@/store/GameState";

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

export default function DevelopmentCardShop() {
    const { playerDevelopmentCards, setPlayerDevelopmentCards } = useGameStore()

    const handlePlayCard = (cardId: DevelopmentCardType) => {
        const newDevelopmentCards = playerDevelopmentCards
        newDevelopmentCards[cardId] -= 1
        setPlayerDevelopmentCards(newDevelopmentCards)
    };

    return (
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
    )
}