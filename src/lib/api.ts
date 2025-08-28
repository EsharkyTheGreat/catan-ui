import toast from "react-hot-toast";

export interface GameRoom {
  id: number;
  host: string;
  name: string;
  players: string[];
  status: string;
  createdAt: number;
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
