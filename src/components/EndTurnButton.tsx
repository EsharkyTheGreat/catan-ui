import { Check } from "lucide-react";
import { useGameStore } from "@/store/GameState";
import { TurnEndEvent } from "@/lib/websocket";

export default function EndTurnButton() {
    const { username, currentPlayer, socket, discardInProgress, playerTurnCount, housesPlacedThisTurn, dieRolledThisTurn, roadsPlacedThisTurn, setPhase, phase } = useGameStore();
    const myTurn = username === currentPlayer;

    const canEndTurn: boolean = (phase !== "place_robber") && myTurn && !discardInProgress && (playerTurnCount[username] in [0, 1] ? housesPlacedThisTurn === 1 && roadsPlacedThisTurn === 1 : dieRolledThisTurn);

    const endTurn = () => {
        if (!username) return;
        if (!socket) return;
        if (!canEndTurn) return;
        const data: TurnEndEvent = {
            type: "TURN_END",
            username: username
        }
        setPhase(null)
        socket.send(JSON.stringify(data))
    }

    return (
        <div className="transition-transform duration-200 hover:scale-110">
            <Check size={88}
                stroke="black"
                className={canEndTurn ? "hover:cursor-pointer" : "hover:cursor-not-allowed opacity-50"}
                onClick={endTurn}
            />
        </div>
    )
}