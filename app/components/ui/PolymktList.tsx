import { EventSearchResponse, MarketSummary, PlmSubject } from "@/types/polymarket";
import { useState, useEffect } from "react";

export enum QueryType {
  Keyword = "keyword",
  Address = "address",
}

type Props = {
  queryType: QueryType;
  value: string;
  changeDisplay: (page: string) => void;
  selectMarket: (market: MarketSummary) => void;
};

export default function PolymarketList({
  value,
  queryType,
  changeDisplay,
  selectMarket,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [markets, setMarkets] = useState<PlmSubject[]>([]);

  useEffect(() => {
    const url =
      queryType === QueryType.Address
        ? `https://fyp.polymarket.com/markets?address=${value}`
        : `https://polymarket.com/api/events/search?_s=volume_24hr:desc&_sts=active&_l=12&_q=${value}&_p=1`;

    const fetchMarkets = async () => {
      try {
        setIsLoading(true);
        setMarkets([]);
        const response = await fetch(url);
        const data = await response.json();
        const mkts = ParseEventSearchResponse(data);
        setMarkets(mkts.data || []);
      } catch (error) {
        console.error("Error fetching markets:", error);
        setMarkets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkets();
  }, [value, queryType]);

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="w-full h-[100px] bg-gradient-to-b from-[#DB4E66] via-[#A24688] to-[#4E3ABA] rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : markets.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {markets.map((event) => (
            <div
              key={event.id}
              className="flex items-center bg-white shadow-md rounded-lg p-4 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                const market: MarketSummary = {
                  id: event.id,
                  name: event.title,
                  image: event.image,
                  price: event.volume24hr,
                  volume: event.liquidity,
                };
                selectMarket(market);
                changeDisplay("order");
              }}
            >
              {/* Image or Placeholder */}
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-md bg-gradient-to-b from-[#DB4E66] via-[#A24688] to-[#4E3ABA]"
                ></div>
              )}

              {/* Event Information */}
              <div>
                <h2 className="text-md font-semibold">{event.title}</h2>
                <p className="text-sm text-gray-500">Yes currently at {event.markets[0].outcomePrices[0]}$</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p>No markets found for {value}.</p>
        </div>
      )}
    </div>
  );
}


//https://fyp.polymarket.com/markets?address=0x84212847694332095BC8e3B963EcBF87673e954e
function ParseEventSearchResponse(response: any): EventSearchResponse {
  try {
    if (Array.isArray(response)) {
      // Filter and map the events
      const filteredData: PlmSubject[] = response
        .filter(
          (event) =>
            event.markets &&
            event.markets.length === 1 && // Ensure only events with exactly one market
            event.markets.some((market: any) => market.groupItemTitle === "")
        )
        .map((event) => {
          const market = event.markets[0]; // Single market assumption
          return {
            id: event.id || "",
            ticker: event.ticker || "",
            slug: event.slug || "",
            title: event.title || "",
            description: event.description || "",
            startDate: event.startDate || null,
            creationDate: event.creationDate || null,
            endDate: event.endDate || null,
            image: event.image || "",
            icon: event.icon || "",
            active: event.active || false,
            closed: event.closed || false,
            archived: event.archived || false,
            new: event.new || false,
            featured: event.featured || false,
            restricted: event.restricted || false,
            liquidity: Number(event.liquidity) || 0,
            volume: Number(event.volume) || 0,
            openInterest: Number(event.openInterest) || 0,
            createdAt: event.createdAt || null,
            updatedAt: event.updatedAt || null,
            competitive: Number(event.competitive) || 0,
            volume24hr: Number(event.volume24hr) || 0,
            enableOrderBook: event.enableOrderBook || false,
            liquidityClob: Number(event.liquidityClob) || 0,
            _sync: event._sync || false,
            commentCount: Number(event.commentCount) || 0,
            // Include outcomes and outcomePrices from the market
            outcomes: market.outcomes || [],
            outcomePrices: market.outcomePrices || [],
            // Include the single market data
            markets: [
              {
                id: market.id || "",
                question: market.question || "",
                conditionId: market.conditionId || "",
                slug: market.slug || "",
                resolutionSource: market.resolutionSource || "",
                endDate: market.endDate || null,
                liquidity: market.liquidity || "0",
                startDate: market.startDate || null,
                image: market.image || "",
                icon: market.icon || "",
                description: market.description || "",
                outcomes: market.outcomes || [],
                outcomePrices: market.outcomePrices || [],
                volume: market.volume || "0",
                active: market.active || false,
                closed: market.closed || false,
              },
            ],
          };
        });

      // Return the parsed response
      return {
        data: filteredData,
        meta: {
          total: filteredData.length,
          limit: filteredData.length,
          offset: 0,
        },
      };
    }

    // If response is not an array, throw an error
    throw new Error("Invalid API response structure: Expected an array.");
  } catch (error: any) {
    throw new Error(`Error parsing API response: ${error.message}`);
  }
}
