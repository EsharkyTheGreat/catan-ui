import { DiceRollRequestEvent } from "@/lib/websocket";
import { useGameStore } from "@/store/GameState";
import {
    Dice1,
    Dice2,
    Dice3,
    Dice4,
    Dice5,
    Dice6,
  } from "lucide-react";

export default function DieButton() {
    const { socket, username, lastRoll, currentPlayer } = useGameStore();
    const myTurn = username === currentPlayer;

    const diceComponentMap: Record<number, any> = {
        1: Dice1,
        2: Dice2,
        3: Dice3,
        4: Dice4,
        5: Dice5,
        6: Dice6,
    };
    
    const diceRoll = () => {
        if (!username) return;
        if (!socket) return;
        if (!myTurn) return;
        const data: DiceRollRequestEvent = {
            type: "DICE_ROLL_REQUEST",
            username: username,
        }
        socket.send(JSON.stringify(data))
    }

    return (
        <div className={"flex px-2 items-center h-full bg-amber-50 rounded-xl" + (myTurn ? " hover:cursor-pointer" : " hover:cursor-not-allowed")} onClick={() => diceRoll()}>
            {(() => {
            const DieLeft = diceComponentMap[lastRoll?.die1 ?? 1] ?? Dice1;
            const DieRight = diceComponentMap[lastRoll?.die2 ?? 1] ?? Dice1;
            return (
                <>
                <DieLeft size={88} stroke="black" className="" />
                <DieRight size={88} stroke="black" className="" />
                </>
            );
            })()}
      </div>
    )
}