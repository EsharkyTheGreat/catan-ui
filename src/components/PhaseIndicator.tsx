import { useGameStore } from "@/store/GameState"

export default function PhaseIndicator() {
    const { phase, freeRoadCount, currentPlayer, dieRolledThisTurn, username, myHouseCounts, playerTurnCount, housesPlacedThisTurn, roadsPlacedThisTurn } = useGameStore()

    const myTurn: boolean = username === currentPlayer
    const myTurnCount: number = playerTurnCount[username]

    if (!myTurn) return <div>Waiting for {currentPlayer} to play</div>

    if (myTurnCount in [0, 1] && housesPlacedThisTurn == 0) return <div>Setup Phase: Place a House</div>
    if (myTurnCount in [0, 1] && roadsPlacedThisTurn == 0 && housesPlacedThisTurn > 0) return <div>Setup Phase: Place a Road</div>
    if (myTurnCount in [0, 1] && housesPlacedThisTurn > 0 && roadsPlacedThisTurn > 0) return <div>Setup Phase: End Turn</div>

    if (myTurn && !dieRolledThisTurn) return <div>Roll the dice</div>

    if (phase == "road_placement") {
        if (freeRoadCount > 0) return <div>{`You have ${freeRoadCount} free roads available`}</div>
        return <div>Place a Road</div>
    }

    if (phase == "settlement_placement") {
        return <div>Place a Settlement</div>
    }

    if (phase == "house_placement") {
        return <div>Place a House</div>
    }

    if (phase == "place_robber") {
        return <div>Move the Robber</div>
    }

    return (
        <div>Perform an action or end turn</div>
    )
}