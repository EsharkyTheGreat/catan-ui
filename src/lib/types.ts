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
  SettlementPlacedEvent,
} from "./websocket";

export interface CatanEdgePosition {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  data: CatanEdge;
}

export interface CatanEdge {
  q1: number;
  r1: number;
  s1: number;
  q2: number;
  r2: number;
  s2: number;
  owner: string | null;
}

export interface CatanVertex {
  q1: number;
  r1: number;
  s1: number;
  q2: number;
  r2: number;
  s2: number;
  q3: number;
  r3: number;
  s3: number;
  hasHouse: boolean;
  hasSettlement: boolean;
  owner: string | null;
}

export interface CatanVertexPosition {
  x: number;
  y: number;
  data: CatanVertex;
}

// CatanTile interface
export interface CatanTilePosition {
  x: number;
  y: number;
  data: CatanTile;
}

export interface CatanTile {
  q: number;
  r: number;
  s: number;
  resource: CatanResource | "DESERT";
  number: number;
}

export type CatanBoardSummary = {
  n: number;
  faces: CatanTile[];
  edges: CatanEdge[];
  vertices: CatanVertex[];
};

export type CatanResource = "TREE" | "BRICK" | "SHEEP" | "WHEAT" | "STONE";
export type DevelopmentCardType = "Knight" | "Victory Point" | "Road Building" | "Year of Plenty" | "Monopoly";

export type ChatMessage = {
  player: string;
  message: string;
};

export type Player = {
  id: number;
  name: string;
  color: "RED" | "YELLOW" | "BLUE" | "GREEN";
  longestRoad: number;
  longestArmy: number;
  developmentCards: number;
  cardCount: number;
  victoryPoints: number;
};

export type Tile = {
  id: string;
  type: CatanResource | "desert";
  number: number;
  hasRobber: boolean;
};

export type GamePhases =
  | "dice"
  | "road_placement"
  | "house_placement"
  | "settlement_placement"
  | "robber";

export type GameStatuses = "active" | "lobby" | "finished";

export type GameSnapshot = {
  id: string;
  username: string;
  chat: ChatMessage[];
  dimensions: { width: number; height: number };
  gameLog: ChatMessage[];
  players: Player[];
  faces: CatanTile[];
  edges: CatanEdge[];
  vertices: CatanVertex[];
  currentPlayer: string | null;
  phase: GamePhases;
  status: GameStatuses;
  lastRoll: {die1: number, die2: number};
  socket: WebSocket | null;
  playerResources: Record<CatanResource,number>;
  bankResources: Record<CatanResource,number>;
  playerDevelopmentCards: Record<DevelopmentCardType,number>;
};

export type GameState = GameSnapshot & {
  setId: (gameId: string) => void;
  setUsername: (name: string) => void;
  refreshGameMetadata: () => Promise<void>;

  setPhase: (phase: GamePhases) => void;
  setGameStatus: (gameStatus: GameStatuses) => void;

  setFaces: (faces: CatanTile[]) => void;
  setVertices: (vertices: CatanVertex[]) => void;
  setEdges: (edges: CatanEdge[]) => void;
  setDimensions: (dimensions: { width: number; height: number }) => void;

  setChat: (messages: ChatMessage[]) => void;
  addChat: (message: string) => void;

  setGameLog: (gameLog: ChatMessage[]) => void;
  addGameLog: (gameLog: ChatMessage) => void;

  setCurrentPlayer: (name: string) => void;
  setPlayers: (players: Player[]) => void;
  setLastRoll: (roll: {die1: number, die2: number}) => void;
  setPlayerResources: (newResources: Record<CatanResource,number>) => void;
  addPlayerResource: (resourceType: CatanResource, resourceCount: number) => void;
  setBankResources: (newResources: Record<CatanResource,number>) => void;
  setPlayerDevelopmentCards: (newCards: Record<DevelopmentCardType,number>) => void;

  connect: (ws: WebSocket) => void;
  onChatMessage: (event: ChatMessageEvent) => void;
  onWsConnected: (event: ConnectedEvent) => void;
  onWsDisconnected: (event: DisconnectedEvent) => void;
  onGameStart: (event: GameStartedEvent) => void;
  onWsError: (event: GenericErrorEvent) => void;
  onPlayerJoined: (event: JoinedEvent) => Promise<void>;
  onRoadPlaced: (event: RoadPlacedEvent) => void;
  onHousePlaced: (event: HousePlacedEvent) => Promise<void>;
  onSettlementPlaced: (event: SettlementPlacedEvent) => Promise<void>;
  onDiceRoll: (event: DiceRollResponseEvent) => void;
  onBankTradeResponse: (event: BankTradeResponseEvent) => void;
};
