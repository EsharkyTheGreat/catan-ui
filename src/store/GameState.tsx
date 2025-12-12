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
  Trade,
} from "@/lib/types";
import { devtools } from "zustand/middleware";
import {
  BankTradeResponseEvent,
  BuyDevelopmentCardResponseEvent,
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
  TradeBroadcastEvent,
  TurnEndEvent,
  UseMonopolyEvent,
  UseTwoFreeRoadsEvent,
  UseYearOfPlentyEvent,
} from "@/lib/websocket";
import toast from "react-hot-toast";
import { fetchGameRoomSummary, fetchPlayerSummary } from "@/lib/api";
import { UUID } from "crypto";
import PlayerTradePopup from "@/components/PlayerTradePopup";

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
    activeOpenTrade: {},
    freeRoadCount: 0,
    myHouseCounts: 0,
    mySettlementCounts: 0,
    myRoadCounts: 0,

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
        currentPlayer: gameSummary.current_turn ?? null,
        faces: gameSummary.board.faces,
        edges: gameSummary.board.edges,
        vertices: gameSummary.board.vertices,
        gameLog: gameSummary.game_log,
        chat: gameSummary.chats,
        playerResources: playerSummary.resourceCount,
        bankResources: gameSummary.bank_resources,
        playerDevelopmentCards: playerSummary.developmentCards,
        activeOpenTrade: gameSummary.active_open_trades,
        freeRoadCount: playerSummary.free_road_count,
        myHouseCounts: playerSummary.houses_placed,
        mySettlementCounts: playerSummary.settlements_placed,
        myRoadCounts: playerSummary.roads_placed,
      });
    },
    setFreeRoadCount: (count: number) => set({freeRoadCount: count}),
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
    onDevelopmentCardBuyEvent: (event: BuyDevelopmentCardResponseEvent) => {
      set((state)=> {
        const me = get().username
        if (event.username === me) {
          const myDevelopmentCards = get().playerDevelopmentCards
          myDevelopmentCards[event.card] += 1
          const myCards = get().playerResources
          myCards.SHEEP -= 1
          myCards.WHEAT -= 1
          myCards.STONE -= 1
          toast.success(`You have received a ${event.card} - Development Card`)
          return {
            ...state,
            playerResources: myCards,
            playerDevelopmentCards: myDevelopmentCards
          }
        } else {
          const allPlayers = get().players
          const otherPlayer = get().players.find(p=>p.name === event.username)
          if (!otherPlayer) return {...state}
          otherPlayer.developmentCards += 1
          otherPlayer.cardCount -= 3
          toast.success(`Player: ${event.username} has bought a Development Card`)
          return {
            ...state,
            players: allPlayers
          }
        }
      })
    },
    onBankTradeResponse: (event: BankTradeResponseEvent) => {
      if (!event.success) {
        toast.error(`Invalid Bank Trade sent by ${event.username}`)
        return
      }
      toast.success(`Bank Trade Made Successfully by ${event.username} and got ${event.resource_taking_count}x${event.resource_taking}`)
      if (get().username == event.username) {
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
    onFreeTwoRoadsPlayed: async (event: UseTwoFreeRoadsEvent) => {
      const me = get().username
      if (event.username === me) {
        toast.success("You have played the Place Two Free Roads Development Card")
      } else {
        toast.success(`${event.username} has played the Place Two Free Roads Development Card"`)
      }
      await get().refreshGameMetadata()
    },
    onUseMonopolyCard: async (event: UseMonopolyEvent) => {
      const me = get().username
      if (event.username === me) {
        toast.success(`You have played the Monopoly Development Card and taken all resources of the ${event.resource} type`)
      } else {
        toast.success(`${event.username} has played the Monopoly Development Card and taken all resources of the ${event.resource} type`)
      }
      await get().refreshGameMetadata()
    },
    onUseYearOfPlentyCard: async (event: UseYearOfPlentyEvent) => {
      const me = get().username
      if (event.username === me) {
        toast.success(`You have played the Year of Plenty Development Card and taken ${event.resource1} and ${event.resource2} from the bank`)
      } else {
        toast.success(`${event.username} has played the Year of Plenty Development Card and taken ${event.resource1} and ${event.resource2} from the bank`)
      }
      await get().refreshGameMetadata()
    },
    onRoadPlaced: async (e: RoadPlacedEvent) => {
      toast.success(`${e.username} has placed a road`);
      await get().refreshGameMetadata()
    },
    onDiceRoll: async (event: DiceRollResponseEvent) => {
      const roll = { die1: event.die1, die2: event.die2}
      get().setLastRoll(roll)
      await get().refreshGameMetadata()
    },
    onTradeBroadcast: (event: TradeBroadcastEvent) => {
      if (event.status == "CREATED") {
        get().onTradeCreated(event)
      } else if (event.status == "IN_PROGRESS") {
        get().onTradeUpdate(event)
      } else if (event.status == "COMPLETED") {
        get().onTradeCompletion(event)
      } else if (event.status == "EXPIRED") {
        get().onTradeExpire(event)
      }
    },
    onTradeCreated: (event: TradeBroadcastEvent) => {
      set((state)=>{
        const newTrades = state.activeOpenTrade
        const newTrade: Trade = {
          trade_id: event.id,
          giving: event.offering,
          player_sentiment: event.player_sentiment,
          taking: event.receiving,
          username: event.username,
          toast_id: "",
        }
        newTrade.toast_id = toast.custom((t)=>
          <PlayerTradePopup trade={newTrade} toast_id={t.id} />
        ,{duration: 35*1000,position: "top-left"})
        newTrades[event.id] = newTrade
        return {
          activeOpenTrades: newTrades,
          ...state,
        }
      })
    },
    onTradeUpdate: (event: TradeBroadcastEvent) => {
      set((state)=> {
        const newTrades = state.activeOpenTrade
        const newTrade = newTrades[event.id]
        newTrade.player_sentiment = event.player_sentiment
        newTrades[event.id] = newTrade
        return {
          activeOpenTrades: newTrades,
          ...state
        }
      })
    },
    onTradeExpire: (event: TradeBroadcastEvent) => {
      const trades = get().activeOpenTrade
      const trade = trades[event.id]
      toast.dismiss(trade.toast_id)
      set((state)=>{
        const {[event.id]: _, ...filteredTrades } = trades
        return {
          ...state,
          activeOpenTrade: filteredTrades
        }
      })
    },
    onTradeCompletion: (event: TradeBroadcastEvent) => {
      const trade = get().activeOpenTrade[event.id]
      if (!event.accepter) return;
      const players = get().players
      const offeringPlayer = players.find(p => p.name === event.username)
      if (!offeringPlayer) return
      const acceptingPlayer = players.find(p => p.name === event.accepter)
      if (!acceptingPlayer) return;
      const me = get().currentPlayer
      const myResources = get().playerResources
      if (!me) return;
      //Giver Part
      if (event.username == me) {
        for (const [resource, count] of Object.entries(event.offering)) {
          myResources[resource as CatanResource] -= count
        }
        for (const [resource, count] of Object.entries(event.receiving)) {
          myResources[resource as CatanResource] += count
        }
      } else {
        for (const [resource, count] of Object.entries(event.offering)) {
          offeringPlayer.cardCount -= count
        }
        for (const [resource, count] of Object.entries(event.receiving)) {
          offeringPlayer.cardCount += count
        }
      }
      // Accepter Part
      if (event.accepter == me) {
        for (const [resource, count] of Object.entries(event.offering)) {
          myResources[resource as CatanResource] += count
        }
        for (const [resource, count] of Object.entries(event.receiving)) {
          myResources[resource as CatanResource] -= count
        }
      } else {
        for (const [resource, count] of Object.entries(event.offering)) {
          acceptingPlayer.cardCount += count
        }
        for (const [resource, count] of Object.entries(event.receiving)) {
          acceptingPlayer.cardCount -= count
        }
      }
      toast.dismiss(trade.toast_id)
      set((state)=>{
        const {[event.id]: _, ...filteredTrades } = get().activeOpenTrade
        return {
          ...state,
          activeOpenTrade: filteredTrades
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
          if (data.type === "TRADE_BROADCAST") get().onTradeBroadcast(data as TradeBroadcastEvent) 
          if (data.type == "DEVELOPMENT_CARD_BUY_RESPONSE") get().onDevelopmentCardBuyEvent(data as BuyDevelopmentCardResponseEvent)
          if (data.type == "PLACE_TWO_FREE_ROADS") get().onFreeTwoRoadsPlayed(data as UseTwoFreeRoadsEvent)
          if (data.type == "USE_MONOPOLY_CARD") get().onUseMonopolyCard(data as UseMonopolyEvent)
          if (data.type == "USE_YEAR_OF_PLENTY_CARD") get().onUseYearOfPlentyCard(data as UseYearOfPlentyEvent)
          if (data.type == "TURN_END") get().onTurnEnd(data as TurnEndEvent)
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
    setActiveOpenTrades: (newTrades: Record<UUID,Trade>) => set({activeOpenTrade: newTrades}),
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
    onTurnEnd: async (event: TurnEndEvent) => {
      const me = get().username
      if (event.username === me) {
        toast.success("You have ended your turn")
      } else {
        toast.success(`${event.username} has ended their turn and it is now your turn`)
      }
      await get().refreshGameMetadata()
    },
    setPhase: (phase: GamePhases) => set({ phase }),
    setFaces: (faces: CatanTile[]) => set({ faces }),
    setVertices: (vertices: CatanVertex[]) => set({ vertices }),
    setEdges: (edges: CatanEdge[]) => set({ edges }),
    setDimensions: (dimensions: { width: number; height: number }) =>
      set({ dimensions }),
  }))
);
