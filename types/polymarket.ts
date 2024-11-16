type EventSearchResponse = {
  data: PlmSubject[];
  meta: Meta;
};

type PlmSubject = {
  id: string;
  ticker: string;
  slug: string;
  title: string;
  description: string;
  startDate: string;
  creationDate: string;
  endDate: string;
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  liquidity: number;
  volume: number;
  openInterest: number;
  createdAt: string;
  updatedAt: string;
  competitive: number;
  volume24hr: number;
  enableOrderBook: boolean;
  liquidityClob: number;
  _sync: boolean;
  commentCount: number;
  markets: Market[];
};

type Market = {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  resolutionSource: string;
  endDate: string;
  liquidity: string;
  startDate: string;
  image: string;
  icon: string;
  description: string;
  outcomes: string[];
  outcomePrices: string[];
  volume: string;
  active: boolean;
  closed: boolean;
};

type Meta = {
  total: number;
  limit: number;
  offset: number;
};

type MarketSummary = {
  id: string;
  name: string;
  image: string;
  price: number;
  volume: number;
};

