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

export const fetchGameRooms = async (): Promise<GameRoom[]> => {
  try {
    const response = await fetch(`http://${HOST}:${PORT}/games`);
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
