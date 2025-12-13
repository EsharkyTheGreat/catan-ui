import { Check } from "lucide-react";
import { useGameStore } from "@/store/GameState";
import { TurnEndEvent } from "@/lib/websocket";

export default function EndTurnButton() {
    const { username, currentPlayer, socket, discardInProgress } = useGameStore();
    const myTurn = username === currentPlayer;

    const endTurn = () => {
        if (!username) return;
        if (!socket) return;
        if (discardInProgress) return;
        const data: TurnEndEvent= {
            type: "TURN_END",
            username: username
        }
        socket.send(JSON.stringify(data))
    }
    return (
        <div className="transition-transform duration-200 hover:scale-110">
            <Check size={88} 
                stroke="black" 
                className={myTurn && !discardInProgress ? "hover:cursor-pointer" : "hover:cursor-not-allowed"} 
                onClick={endTurn}
             />
        </div>
    )
}