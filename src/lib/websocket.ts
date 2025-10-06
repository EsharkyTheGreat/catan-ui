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

export type RoadPlacedEvent = {
  type: "ROAD_PLACED";
  q1: number;
  q2: number;
  r1: number;
  r2: number;
  s1: number;
  s2: number;
  username: string;
};

export type SettlementPlacedEvent = {
  type: "SETTLEMENT_PLACED";
  q1: number;
  q2: number;
  q3: number;
  r1: number;
  r2: number;
  r3: number;
  s1: number;
  s2: number;
  s3: number;
  username: string;
};

export type HousePlacedEvent = {
  type: "HOUSE_PLACED";
  q1: number;
  q2: number;
  q3: number;
  r1: number;
  r2: number;
  r3: number;
  s1: number;
  s2: number;
  s3: number;
  username: string;
};


export type ServerMessage =
  | ChatMessageEvent
  | ConnectedEvent
  | DisconnectedEvent
  | GameStartedEvent
  | GenericErrorEvent
  | JoinedEvent
  | RoadPlacedEvent
  | SettlementPlacedEvent
  | HousePlacedEvent;
