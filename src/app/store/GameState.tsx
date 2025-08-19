import { create } from "zustand";
import { GameState } from "../lib/types";

export const useGameStore = create<GameState>((set) => ({
  players: [],
  edges: [],
  faces: [],
  currentPlayer: null,
  phase: "dice",
  lastRoll: null,
}));
