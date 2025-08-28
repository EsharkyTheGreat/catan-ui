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

export type ServerMessage =
  | ChatMessageEvent
  | ConnectedEvent
  | DisconnectedEvent;
