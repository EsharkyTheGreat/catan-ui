import { useGameStore } from "@/store/GameState"

export default function PhaseIndicator() {
    const { phase, freeRoadCount, currentPlayer } = useGameStore()

    return (
        <div>
            <div>{phase ? `Current Phase is : ${phase}` : "Waiting..."}</div>
            <div>{phase === "road_placement" ? `You have ${freeRoadCount} free roads available` : ""}</div>
            <div>{`Current Player is: ${currentPlayer}`}</div>
        </div>
    )
}