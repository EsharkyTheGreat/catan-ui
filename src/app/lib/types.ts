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

export type Player = {
  id: string;
  name: string;
  resources: Record<Resource, number>;
  settlements: string[];
  roads: string[];
  points: number;
};

export type Tile = {
  id: string;
  type: Resource | "desert";
  number: number;
  hasRobber: boolean;
};

export type GameSnapshot = {
  players: Player[];
  faces: CatanTilePosition[];
  edges: CatanEdgePosition[];
  currentPlayer: string | null;
  phase: "dice" | "build" | "trade" | "robber";
  lastRoll: number | null;
};

export type GameState = GameSnapshot & {
  //   setInitialState: (snapshot: GameSnapshot) => void;
  //   updateState: (partial: Partial<GameSnapshot>) => void;
};
