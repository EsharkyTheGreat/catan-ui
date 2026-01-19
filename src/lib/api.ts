import toast from "react-hot-toast";
import { CatanBoardSummary, ChatMessage, GameStatuses, Player, CatanResource, DevelopmentCardType, Trade, CatanVertex, CatanEdge } from "./types";
import { UUID } from "crypto";

export interface GameRoom {
  id: string;
  host: string;
  name: string;
  players: Player[];
  status: GameStatuses;
  createdAt: number;
  current_turn?: string;
  chats: ChatMessage[];
  game_log: ChatMessage[];
  turn_order: string[];
  turn_index: number;
  player_turn_count: Record<string, number>;
  phase:
  | "FIRST_FREE_HOUSE_PLACEMENT"
  | "SECOND_FREE_HOUSE_PLACEMENT"
  | "DICE_ROLL"
  | "ACTION"
  | "DISCARD_TIMER";
  board: CatanBoardSummary;
  bank_resources: Record<CatanResource, number>
  active_open_trades: Record<UUID, Trade>
  die_rolled_this_turn: boolean;
  houses_placed_this_turn: number;
  roads_placed_this_turn: number;
  discard_counter?: number;
}

export interface PlayerDetailedSummary {
  id: number;
  name: string;
  longestRoad: number;
  longestArmy: number;
  developmentCards: Record<DevelopmentCardType, number>;
  color: "RED" | "YELLOW" | "BLUE" | "GREEN";
  resourceCount: Record<"WHEAT" | "BRICK" | "TREE" | "SHEEP" | "STONE", number>;
  free_road_count: number;
  houses_placed: number;
  settlements_placed: number;
  roads_placed: number;
  victory_points: number;
}

export interface ValidHousePlacementPositions {
  vertices: CatanVertex[]
}

export interface ValidRoadPlacementPositions {
  edges: CatanEdge[]
}

const HOST: string = "localhost";
const PORT: number = 8000;
const BASE_PATH = `http://${HOST}:${PORT}`;

export const fetchGameRooms = async (): Promise<GameRoom[]> => {
  try {
    const response = await fetch(`${BASE_PATH}/games`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as GameRoom[];
    return data;
  } catch (error) {
    console.error("Failed to fetch game rooms:", error);
    return [];
  }
};

export const joinGameRoom = async (
  gameId: string,
  player_name: string
): Promise<null> => {
  try {
    const resp = await fetch(
      `${BASE_PATH}/game/join?game_id=${gameId}&player_name=${player_name}`,
      {
        method: "POST",
      }
    );
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Failed to call Join Game Room API", error);
    toast.error("Failed to call Join Game Room API");
    return null;
  }
};

export const createGameRoom = async (host: string): Promise<string | null> => {
  try {
    const resp = await fetch(`${BASE_PATH}/game?host=${host}`, {
      method: "POST",
    });
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Failed to call Create Game Room API", error);
    toast.error("Failed to call Create Game Room API");
    return null;
  }
};

export const fetchGameRoomSummary = async (
  game_id: string
): Promise<GameRoom> => {
  const response = await fetch(`${BASE_PATH}/game?game_id=${game_id}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = (await response.json()) as GameRoom;
  console.log("Game Room: ", data);
  return data;
};

export const fetchPlayerSummary = async (
  game_id: string,
  player_name: string
): Promise<PlayerDetailedSummary | null> => {
  try {
    const response = await fetch(
      `${BASE_PATH}/game/player?game_id=${encodeURIComponent(game_id)}&player_name=${encodeURIComponent(player_name)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as PlayerDetailedSummary;
    return data;
  } catch (error) {
    console.error("Failed to fetch player summary:", error);
    toast.error("Failed to fetch player summary");
    return null;
  }
};

export const fetchValidHousePlacementPositions = async (game_id: string, player_name: string): Promise<ValidHousePlacementPositions | null> => {
  try {
    const response = await fetch(
      `${BASE_PATH}/game/player/valid-house-positions?game_id=${encodeURIComponent(game_id)}&player_name=${encodeURIComponent(player_name)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as ValidHousePlacementPositions;
    return data;
  } catch (error) {
    console.error("Failed to fetch valid house placement positions:", error);
    toast.error("Failed to fetch valid house placement positions:");
    return null;
  }
}

export const fetchValidRoadPlacementPositions = async (game_id: string, player_name: string): Promise<ValidRoadPlacementPositions | null> => {
  try {
    const response = await fetch(
      `${BASE_PATH}/game/player/valid-road-positions?game_id=${encodeURIComponent(game_id)}&player_name=${encodeURIComponent(player_name)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as ValidRoadPlacementPositions;
    return data;
  } catch (error) {
    console.error("Failed to fetch valid road placement positions:", error);
    toast.error("Failed to fetch valid road placement positions:");
    return null;
  }
}