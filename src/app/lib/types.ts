export interface CatanEdge {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
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
  board: { tiles: Tile[] };
  currentPlayer: string | null;
  phase: "dice" | "build" | "trade" | "robber";
  lastRoll: number | null;
};

export type GameState = GameSnapshot & {
  setInitialState: (snapshot: GameSnapshot) => void;
  updateState: (partial: Partial<GameSnapshot>) => void;
};
