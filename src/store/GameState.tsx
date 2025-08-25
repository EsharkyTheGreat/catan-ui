import { create } from "zustand";
import {
  CatanEdgePosition,
  CatanTilePosition,
  CatanVertexPosition,
  ChatMessage,
  GamePhases,
  GameState,
} from "@/lib/types";
import { devtools } from "zustand/middleware";

export const useGameStore = create<GameState>()(
  devtools((set) => ({
    players: [],
    edges: [],
    faces: [],
    vertices: [],
    currentPlayer: "1",
    phase: "dice",
    lastRoll: null,
    gameLog: [{ player: "Esharky", message: "Joined the lobby" }],
    chat: [{ player: "Esharky", message: "Game Chat" }],

    setChat: (messages: ChatMessage[]) => set({ chat: messages }),
    addChat: (message: ChatMessage) => {
      set((state) => {
        const newMessages = [...state.chat, message];
        return {
          ...state,
          chat: newMessages,
        };
      });
    },
    setPhase: (phase: GamePhases) => set({ phase }),
    buildRoad: (roadIndex: number) => {
      set((state) => {
        // Check if there's a current player
        if (!state.currentPlayer) {
          console.warn("No current player to build road");
          return state;
        }

        // Check if the road index is valid
        if (roadIndex < 0 || roadIndex >= state.edges.length) {
          console.warn("Invalid road index:", roadIndex);
          return state;
        }

        // Check if the road is already owned
        if (state.edges[roadIndex].data.owner !== null) {
          console.warn("Road is already owned");
          return state;
        }

        // Create a new edges array with the updated road
        const newEdges = [...state.edges];
        newEdges[roadIndex] = {
          ...newEdges[roadIndex],
          data: {
            ...newEdges[roadIndex].data,
            owner: state.currentPlayer,
          },
        };

        return {
          ...state,
          edges: newEdges,
        };
      });
    },
    setFaces: (faces: CatanTilePosition[]) => set({ faces }),
    setVertices: (vertices: CatanVertexPosition[]) => set({ vertices }),
    setEdges: (edges: CatanEdgePosition[]) => set({ edges }),
  }))
);
