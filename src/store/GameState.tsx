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
  CatanResource,
  DevelopmentCardType,
} from "@/lib/types";
import { devtools } from "zustand/middleware";
import {
  BankTradeResponseEvent,
  ChatMessageEvent,
  ConnectedEvent,
  DiceRollResponseEvent,
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
import { fetchGameRoomSummary, fetchPlayerSummary } from "@/lib/api";

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
    lastRoll: {die1: 1, die2: 1},
    playerResources: {"WHEAT":0,"BRICK":0,"SHEEP":0,"STONE":0,"TREE":0},
    playerDevelopmentCards: {"Road Building":0,"Victory Point":0,"Year of Plenty":0,"Knight":0,"Monopoly":0},
    gameLog: Array.from({ length: 12 }, () => ({
      player: "Esharky",
      message: "Hello",
    })),
    chat: [],
    socket: null,
    status: "lobby",
    bankResources: {"WHEAT":0,"BRICK":0,"SHEEP":0,"STONE":0,"TREE":0},
    setUsername: (username: string) => set({ username }),
    setId: (gameId: string) => set({ id: gameId }),
    refreshGameMetadata: async () => {
      const username = get().username
      if (!username) return;
      const gameSummary = await fetchGameRoomSummary(get().id);
      const playerSummary = await fetchPlayerSummary(get().id,username);
      if (!playerSummary) return
      set({
        status: gameSummary.status,
        players: gameSummary.players,
        currentPlayer: get().username,
        faces: gameSummary.board.faces,
        edges: gameSummary.board.edges,
        vertices: gameSummary.board.vertices,
        gameLog: gameSummary.game_log,
        chat: gameSummary.chats,
        playerResources: playerSummary.resourceCount,
        bankResources: gameSummary.bank_resources,
        playerDevelopmentCards: playerSummary.developmentCards
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
    onBankTradeResponse: (event: BankTradeResponseEvent) => {
      if (!event.success) {
        toast.error(`Invalid Bank Trade sent by ${event.username}`)
        return
      }
      toast.success(`Bank Trade Made Successfully by ${event.username} and got ${event.resource_taking_count}x${event.resource_taking}`)
      if (get().currentPlayer == event.username) {
        set((state)=> {
          const playerResources = get().playerResources
          playerResources[event.resource_giving] -= event.resource_giving_count
          playerResources[event.resource_taking] += event.resource_taking_count
          return {
            ...state,
            playerResources: playerResources,
          }
        })
      }
      set((state)=>{
        const playerMetadata = get().players
        const targetPlayer = playerMetadata.find(p => p.name === event.username)
        if (!targetPlayer) return {...state}
        targetPlayer.cardCount += event.resource_taking_count - event.resource_giving_count
        const bankResources = get().bankResources
        bankResources[event.resource_giving] += event.resource_giving_count
        bankResources[event.resource_taking] -= event.resource_taking_count
        return {
          ...state,
          players: playerMetadata,
          bankResources: bankResources,
          gameLog: [...state.gameLog, {player: event.username,message: `Got ${event.resource_taking_count}x${event.resource_taking} from the bank`}]
        }
      })
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
    onDiceRoll: (event: DiceRollResponseEvent) => {
      const roll = { die1: event.die1, die2: event.die2}
      get().setLastRoll(roll)
      set((state)=>{
        return {
          ...state,
          gameLog: [
            ...state.gameLog,
            {player: event.username, message: `${event.username} rolled a ${event.die1} and ${event.die2}`}
          ]
        }
      })
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
          if (data.type === "DICE_ROLL_RESPONSE") get().onDiceRoll(data as DiceRollResponseEvent)
          if (data.type === "BANK_TRADE_RESPONSE") get().onBankTradeResponse(data as BankTradeResponseEvent)
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
    setLastRoll: (roll: {die1: number, die2: number}) => set({lastRoll: roll}),
    setPlayerResources: (newResources: Record<CatanResource,number>) => set({playerResources: newResources}),
    addPlayerResource: (resourceType: CatanResource, resourceCount: number) => {
      set((state)=>{
        const newPlayerResources = get().playerResources
        newPlayerResources[resourceType] += resourceCount
        return {
          ...state,
          playerResources: newPlayerResources
        }
      })
    },
    setBankResources: (newResources: Record<CatanResource,number>) => set({bankResources: newResources}),
    setPlayerDevelopmentCards: (newCards: Record<DevelopmentCardType,number>) => set({playerDevelopmentCards:newCards}),
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
