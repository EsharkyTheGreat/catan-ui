import { UUID } from "crypto";
import { CatanResource, DevelopmentCardType, TradeResponse, TradeStatus } from "./types";

export type ChatMessageEvent = {
  type: "CHAT_MESSAGE";
  message: string;
  player: string;
};

export type DiceRollRequestEvent = {
  type: "DICE_ROLL_REQUEST";
  username: string;
}

export type DiceRollResponseEvent = {
  type: "DICE_ROLL_RESPONSE";
  username: string;
  die1: number;
  die2: number;
}

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

export type BankTradeRequestEvent = {
  type: "BANK_TRADE_REQUEST"
  username: string;
  resource_giving: CatanResource
  resource_giving_count: number
  resource_taking: CatanResource
  resource_taking_count: number
}

export type BankTradeResponseEvent = {
  type: "BANK_TRADE_RESPONSE";
  success: boolean;
  username: string;
  resource_giving: CatanResource
  resource_giving_count: number
  resource_taking: CatanResource
  resource_taking_count: number
}

export type TradeCreateEvent = {
    type: "TRADE_CREATE";
    username: string;
    offering: Record<CatanResource, number>;
    receiving: Record<CatanResource, number>;
} 

export type TradeBroadcastEvent = {
  type: "TRADE_BROADCAST";
  username: string;
  id: UUID;
  offering: Record<CatanResource, number>;
  receiving: Record<CatanResource, number>;
  player_sentiment: Record<string, TradeResponse>;
  accepter: string|null;
  status: TradeStatus
}

export type TradeAcceptEvent = {
    type: "TRADE_ACCEPTED";
    id: UUID
    username: string;
}

export type TradeDeclineEvent = {
    type: "TRADE_DECLINED";
    id: UUID
    username: string;
}

export type TradeAcceptOfferEvent = {
    type: "TRADE_ACCEPT_OFFER";
    id: UUID
    username: string;
    accepting_offer_of: string;
}

export type BuyDevelopmentCardEvent = {
  type: "DEVELOPMENT_CARD_BUY_REQUEST";
  username: string;
}

export type BuyDevelopmentCardResponseEvent = {
    type: "DEVELOPMENT_CARD_BUY_RESPONSE";
    success: boolean;
    username: string;
    card: DevelopmentCardType;
}

export type UseTwoFreeRoadsEvent = {
  type: "PLACE_TWO_FREE_ROADS"
  username: string;
}

export type UseMonopolyEvent = {
  type: "USE_MONOPOLY_CARD"
  username: string;
  resource: CatanResource;
}

export type UseYearOfPlentyEvent = {
  type: "USE_YEAR_OF_PLENTY_CARD"
  username: string;
  resource1: CatanResource;
  resource2: CatanResource;
}

export type ServerMessage =
  | ChatMessageEvent
  | ConnectedEvent
  | DisconnectedEvent
  | GameStartedEvent
  | GenericErrorEvent
  | JoinedEvent
  | RoadPlacedEvent
  | SettlementPlacedEvent
  | HousePlacedEvent
  | DiceRollRequestEvent
  | DiceRollResponseEvent
  | BankTradeRequestEvent
  | BankTradeResponseEvent
  | TradeCreateEvent
  | TradeAcceptEvent
  | TradeAcceptOfferEvent
  | TradeBroadcastEvent
  | TradeDeclineEvent
  | BuyDevelopmentCardEvent
  | BuyDevelopmentCardResponseEvent
  | UseTwoFreeRoadsEvent
  | UseMonopolyEvent
  | UseYearOfPlentyEvent;