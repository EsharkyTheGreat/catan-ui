import { Building2, Users } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type Props = {
    setTradeMode: Dispatch<SetStateAction<"bank" | "player">>
    tradeMode: "bank" | "player"
}

export default function TradeModeSelector({ tradeMode, setTradeMode }: Props) {
    return (
        <div className="flex gap-4">
            <button
                onClick={() => setTradeMode('bank')}
                className={`flex-1 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${tradeMode === 'bank'
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'bg-white text-amber-900 hover:bg-amber-50'
                    }`}
            >
                <Building2 size={24} />
                Bank Trade
            </button>
            <button
                onClick={() => setTradeMode('player')}
                className={`flex-1 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${tradeMode === 'player'
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'bg-white text-amber-900 hover:bg-amber-50'
                    }`}
            >
                <Users size={24} />
                Player Trade
            </button>
        </div>
    )
}