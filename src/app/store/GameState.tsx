import { create } from "zustand";
import { GameState } from "../lib/types";

export const useGameStore = create<GameState>((set) => ({
  players: [],
  board: { tiles: [] },
  currentPlayer: null,
  phase: "dice",
  lastRoll: null,

  setInitialState: (snapshot) => set(snapshot),

  updateState: (partial) => set((state) => ({ ...state, ...partial })),
}));
