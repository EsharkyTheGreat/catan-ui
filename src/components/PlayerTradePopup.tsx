import { Trade } from "@/lib/types"
import { TradeAcceptEvent, TradeAcceptOfferEvent, TradeDeclineEvent } from "@/lib/websocket"
import { useGameStore } from "@/store/GameState"
import { ArrowRight, Check, X } from "lucide-react"
import toast from "react-hot-toast"

type Props = {
    trade: Trade
    toast_id: string;
}

export default function PlayerTradePopup(props: Props) {
    const { currentPlayer, players, socket } = useGameStore()
    const isMyTrade = props.trade.username === currentPlayer;
    const hasResponded = Object.entries(props.trade.player_sentiment).find(p => p[0] === currentPlayer)?.[1] !== "NO_RESPONSE";
    const someoneAcceptedMyTrade = isMyTrade && Object.entries(props.trade.player_sentiment).some(
        ([name, resp]) => name !== currentPlayer && resp === "ACCEPT"
    );

    const acceptTrade = (trade: Trade) => {
        if (!currentPlayer) return;
        if (!socket) return;
        const data: TradeAcceptEvent = {
            type: "TRADE_ACCEPTED",
            id: trade.trade_id,
            username: currentPlayer
        }
        socket.send(JSON.stringify(data))
    }

    const declineTrade = (trade: Trade) => {
        if (!currentPlayer) return;
        if (!socket) return;
        const data: TradeDeclineEvent = {
            type: "TRADE_DECLINED",
            id: trade.trade_id,
            username: currentPlayer
        }
        socket.send(JSON.stringify(data))
    }

    const confirmTrade = (accepting_offer_of: string, trade: Trade) => {
        if (!currentPlayer) return;
        if (!socket) return;
        const data: TradeAcceptOfferEvent = {
            type: "TRADE_ACCEPT_OFFER",
            accepting_offer_of: accepting_offer_of,
            id: trade.trade_id,
            username: trade.username
        }
        socket.send(JSON.stringify(data))
    }

    return (
        <div className="bg-white max-w-md rounded-lg shadow-lg p-4 border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="font-semibold text-gray-900">
                        {isMyTrade ? 'Your Trade Offer' : 'Incoming Trade'}
                    </h3>
                    {isMyTrade && (
                        <p className="text-xs text-blue-600">Waiting for responses</p>
                    )}
                </div>
                <button
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={()=>{
                        declineTrade(props.trade)
                        toast.dismiss(props.toast_id)
                    }}
                >
                    <X size={18} />
                </button>
            </div>
            {/* Trade Info */}
            <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">
                    {isMyTrade ? (
                        <>Offered to <span className="font-medium text-gray-900">{players.filter(p => p.name != currentPlayer).map(p => p.name).join(',')}</span></>
                    ) : (
                        <>From <span className="font-medium text-gray-900">{props.trade.username}</span></>
                    )}
                </p>
            </div>
            {/* Resources Exchange */}
            <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-lg">
                {/* Offered Resources */}
                <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1.5 font-medium">
                        {isMyTrade ? 'You Offer' : 'They Offer'}
                    </p>
                    <div className="space-y-1">
                        {Object.entries(props.trade.giving).filter(p => p[1] > 0).map(([resource, count], idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                <span className="text-sm font-medium text-gray-700">
                                    {count}x {resource}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Arrow */}
                <div className="flex-shrink-0">
                    <ArrowRight size={20} className="text-gray-400" />
                </div>

                {/* Received Resources */}
                <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1.5 font-medium">
                        {isMyTrade ? 'You Get' : 'You Give'}
                    </p>
                    <div className="space-y-1">
                        {Object.entries(props.trade.taking).filter(p => p[1] > 0).map(([resource, count], idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                <span className="text-sm font-medium text-gray-700">
                                    {count}x {resource}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Participants Status */}
            <div className="space-y-2 mb-4">
                <p className="text-xs text-gray-500 font-medium mb-2">Trade Status</p>
                {Object.entries(props.trade.player_sentiment).map(([participant, response], idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded bg-gray-50"
                    >
                        <span className="text-sm text-gray-700">
                            {participant === currentPlayer ? 'You' : participant}
                        </span>
                        <div className="flex items-center gap-1">
                            {response === "ACCEPT" ? (
                                <div className="flex items-center gap-1.5 text-green-600">
                                    <Check size={16} />
                                    <span className="text-xs font-medium">Accepted</span>
                                </div>
                            ) : response === "DECLINE" ? (
                                <div className="flex items-center gap-1.5 text-red-600">
                                    <X size={16} />
                                    <span className="text-xs font-medium">Declined</span>
                                </div>
                            ) : (
                                <span className="text-xs text-gray-400 font-medium">Pending</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {/* Action Buttons */}
            {!isMyTrade && !hasResponded && (
                <div className="flex gap-2">
                    <button
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                        onClick={() => acceptTrade(props.trade)}
                    >
                        Accept Trade
                    </button>
                    <button
                        onClick={() => declineTrade(props.trade)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
                    >
                        Decline Trade
                    </button>
                </div>
            )}

            {/* Confirm Accept Button for Trade Initiator */}
            {isMyTrade && someoneAcceptedMyTrade && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs text-green-700 mb-2 font-medium">
                        Choose who to trade with:
                    </p>
                    <div className="space-y-2">
                        {Object.entries(props.trade.player_sentiment)
                            .filter(([name, resp]) => name !== currentPlayer && resp === "ACCEPT")
                            .map(([name, resp], idx) => (
                                <button
                                    key={idx}
                                    onClick={() => confirmTrade(name, props.trade)}
                                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm flex items-center justify-between"
                                >
                                    <span>Complete trade with {name}</span>
                                    <Check size={16} />
                                </button>
                            ))}
                    </div>
                </div>
            )}

            {!isMyTrade && hasResponded && (
                <div className="text-center text-sm text-gray-500">
                    You've already responded to this trade
                </div>
            )}
        </div>
    )
}