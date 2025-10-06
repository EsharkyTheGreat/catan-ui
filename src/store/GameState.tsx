import { create } from "zustand";
import {
  CatanEdge,
  CatanEdgePosition,
  CatanTile,
  CatanTilePosition,
  CatanVertex,
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
  HousePlacedEvent,
  JoinedEvent,
  RoadPlacedEvent,
  ServerMessage,
  SettlementPlacedEvent,
} from "@/lib/websocket";
import toast from "react-hot-toast";
import { fetchGameRoomSummary } from "@/lib/api";

export const useGameStore = create<GameState>()(
  devtools((set, get) => ({
    id: "",
    username: "",
    players: [],
    dimensions: { width: 0, height: 0 },
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
        faces: gameSummary.board.faces,
        edges: gameSummary.board.edges,
        vertices: gameSummary.board.vertices,
        gameLog: gameSummary.game_log,
        chat: gameSummary.chats,
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
      await get().refreshGameMetadata();
    },
    onHousePlaced: async (e: HousePlacedEvent) => {
      toast.success(`${e.username} has placed a house`)
      await get().refreshGameMetadata()
      //TODO Write Logic to just update state in memory instead of refetching everything
    },
    onSettlementPlaced: async (e: SettlementPlacedEvent) => {
      toast.success(`${e.username} has placed a settlement`)
      await get().refreshGameMetadata()
      //TODO Write Logic to just update state in memory instead of refetching everything
    },
    onRoadPlaced: (e: RoadPlacedEvent) => {
      toast.success(`${e.username} has placed a road`);
      set((state) => {
        // Find the edge that matches the road placement coordinates
        // Check both orientations since q1/q2 can be interchanged
        const updatedEdges = state.edges.map((edge) => {
          if (
            (edge.q1 === e.q1 &&
              edge.r1 === e.r1 &&
              edge.s1 === e.s1 &&
              edge.q2 === e.q2 &&
              edge.r2 === e.r2 &&
              edge.s2 === e.s2) ||
            (edge.q1 === e.q2 &&
              edge.r1 === e.r2 &&
              edge.s1 === e.s2 &&
              edge.q2 === e.q1 &&
              edge.r2 === e.r1 &&
              edge.s2 === e.s1)
          ) {
            return { ...edge, owner: e.username };
          }
          return edge;
        });

        return {
          ...state,
          edges: updatedEdges,
          gameLog: [
            ...state.gameLog,
            { player: e.username, message: `${e.username} has placed a road` },
          ],
        };
      });
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
          if (data.type === "ROAD_PLACED")
            get().onRoadPlaced(data as RoadPlacedEvent);
          if (data.type === "HOUSE_PLACED") get().onHousePlaced(data as HousePlacedEvent)
          if (data.type === "SETTLEMENT_PLACED") get().onSettlementPlaced(data as SettlementPlacedEvent)
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
    setFaces: (faces: CatanTile[]) => set({ faces }),
    setVertices: (vertices: CatanVertex[]) => set({ vertices }),
    setEdges: (edges: CatanEdge[]) => set({ edges }),
    setDimensions: (dimensions: { width: number; height: number }) =>
      set({ dimensions }),
  }))
);
