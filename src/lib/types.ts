import {
  ChatMessageEvent,
  ConnectedEvent,
  GameStartedEvent,
  GenericErrorEvent,
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
  settlement: string | null;
  city: string | null;
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
  type: Resource | "desert";
  number: number;
}

export type Resource = "forest" | "brick" | "sheep" | "wheat" | "stone";

export type ChatMessage = {
  player: string;
  message: string;
};

export type Player = {
  id: number;
  name: string;
  longestRoad: number;
  longestArmy: number;
  developmentCards: number;
  cardCount: number;
  victoryPoints: number;
};

export type Tile = {
  id: string;
  type: Resource | "desert";
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
  chat: ChatMessage[];
  gameLog: ChatMessage[];
  players: Player[];
  faces: CatanTilePosition[];
  edges: CatanEdgePosition[];
  vertices: CatanVertexPosition[];
  currentPlayer: string | null;
  phase: GamePhases;
  status: GameStatuses;
  lastRoll: number | null;
  socket: WebSocket | null;
};

export type GameState = GameSnapshot & {
  //   setInitialState: (snapshot: GameSnapshot) => void;
  //   updateState: (partial: Partial<GameSnapshot>) => void;
  setPhase: (phase: GamePhases) => void;
  setGameStatus: (gameStatus: GameStatuses) => void;

  buildRoad: (roadIndex: number) => void;

  setFaces: (faces: CatanTilePosition[]) => void;
  setVertices: (vertices: CatanVertexPosition[]) => void;
  setEdges: (edges: CatanEdgePosition[]) => void;

  setChat: (messages: ChatMessage[]) => void;
  addChat: (message: string) => void;

  setGameLog: (gameLog: ChatMessage[]) => void;
  addGameLog: (gameLog: ChatMessage) => void;

  setCurrentPlayer: (name: string) => void;
  setPlayers: (players: Player[]) => void;

  connect: (ws: WebSocket) => void;
  onChatMessage: (event: ChatMessageEvent) => void;
  onWsConnected: (event: ConnectedEvent) => void;
  onGameStart: (event: GameStartedEvent) => void;
  onWsError: (event: GenericErrorEvent) => void;
};
