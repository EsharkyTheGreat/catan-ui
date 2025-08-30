import { create } from "zustand";
import {
  CatanEdgePosition,
  CatanTilePosition,
  CatanVertexPosition,
  ChatMessage,
  GamePhases,
  GameState,
  GameStatuses,
  Player,
} from "@/lib/types";
import { devtools } from "zustand/middleware";
import {
  ChatMessageEvent,
  ConnectedEvent,
  DisconnectedEvent,
  GameStartedEvent,
  GenericErrorEvent,
  JoinedEvent,
  ServerMessage,
} from "@/lib/websocket";
import toast from "react-hot-toast";
import { fetchGameRoomSummary } from "@/lib/api";

export const useGameStore = create<GameState>()(
  devtools((set, get) => ({
    id: "",
    username: "",
    players: [],
    edges: [],
    faces: [],
    vertices: [],
    currentPlayer: null,
    phase: "dice",
    lastRoll: null,
    gameLog: Array.from({ length: 12 }, () => ({
      player: "Esharky",
      message: "Hello",
    })),
    chat: [],
    socket: null,
    status: "lobby",
    setUsername: (username: string) => set({ username }),
    setId: (gameId: string) => set({ id: gameId }),
    refreshGameMetadata: async () => {
      const gameSummary = await fetchGameRoomSummary(get().id);
      set({
        status: gameSummary.status,
        players: gameSummary.players,
        currentPlayer: get().username,
      });
    },
    setGameStatus: (status: GameStatuses) => set({ status }),
    setPlayers: (players: Player[]) => set({ players }),
    setCurrentPlayer: (name: string) => set({ currentPlayer: name }),
    onChatMessage: (event: ChatMessageEvent) => {
      console.log("ChatMessageEvent Received", event);
      set((state) => {
        const newMessages = [
          ...state.chat,
          { player: event.player, message: event.message },
        ];
        return {
          ...state,
          chat: newMessages,
        };
      });
    },
    onWsConnected: (event: ConnectedEvent) => {
      toast.success(`${event.username} has joined the lobby`);
    },
    onWsDisconnected: (event: DisconnectedEvent) => {
      toast.error(`${event.username} has disconnected`);
    },
    onGameStart: (data: GameStartedEvent) => {
      set({ status: "active" });
    },
    onWsError: (e: GenericErrorEvent) => {
      toast.error(e.message);
    },
    onPlayerJoined: async (e: JoinedEvent) => {
      toast.success(`${e.username} has joined the game`);
      get().refreshGameMetadata();
    },
    connect: (ws: WebSocket) => {
      set({ socket: ws });
      ws.onopen = () => console.log("Websocket Connection established");
      ws.onclose = () => console.log("Websocket Connection Closed");
      ws.onmessage = (e) => {
        try {
          const data: ServerMessage = JSON.parse(e.data);
          console.log("WS Data", data);
          if (!data.type) return;
          if (data.type === "CHAT_MESSAGE")
            get().onChatMessage(data as ChatMessageEvent);
          if (data.type === "CONNECTED")
            get().onWsConnected(data as ConnectedEvent);
          if (data.type === "DISCONNECTED")
            get().onWsDisconnected(data as DisconnectedEvent);
          if (data.type === "GAME_STARTED")
            get().onGameStart(data as GameStartedEvent);
          if (data.type === "ERROR") get().onWsError(data as GenericErrorEvent);
          if (data.type === "JOINED") get().onPlayerJoined(data as JoinedEvent);
        } catch (err) {
          console.error("Invalid JSON Data: ", e.data, err);
        }
      };
    },
    setGameLog: (gameLog: ChatMessage[]) => set({ gameLog }),
    addGameLog: (log: ChatMessage) => {
      set((state) => {
        const newLogs = [...state.gameLog, log];
        return {
          ...state,
          gameLog: newLogs,
        };
      });
    },
    setChat: (messages: ChatMessage[]) => set({ chat: messages }),
    addChat: (message: string) => {
      set((state) => {
        if (!state.currentPlayer) return state;
        const newMessages = [
          ...state.chat,
          { player: state.currentPlayer, message: message },
        ];
        const event: ChatMessageEvent = {
          type: "CHAT_MESSAGE",
          message: message,
          player: state.currentPlayer,
        };
        get().socket?.send(JSON.stringify(event));
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
