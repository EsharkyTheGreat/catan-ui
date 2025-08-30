export type ChatMessageEvent = {
  type: "CHAT_MESSAGE";
  message: string;
  player: string;
};

export type ConnectedEvent = {
  type: "CONNECTED";
  username: string;
};

export type DisconnectedEvent = {
  type: "DISCONNECTED";
  username: number;
};

export type GameStartedEvent = {
  type: "GAME_STARTED";
};

export type GenericErrorEvent = {
  type: "ERROR";
  message: string;
};

export type JoinedEvent = {
  type: "JOINED";
  username: string;
};

export type ServerMessage =
  | ChatMessageEvent
  | ConnectedEvent
  | DisconnectedEvent
  | GameStartedEvent
  | GenericErrorEvent
  | JoinedEvent;
