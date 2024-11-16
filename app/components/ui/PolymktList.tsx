import { useState, useEffect } from "react";

type Props = {
  query: string;
};

export default function PolymarketList({ query }: Props) {
    const [isLoading, setIsLoading] = useState(true);
    const [markets, setMarkets] = useState<PlmSubject[]>([]);
  
    useEffect(() => {
      const fetchMarkets = async () => {
        try {
          const response = await fetch(
            `https://polymarket.com/api/events/search?_s=volume_24hr:desc&_sts=active&_l=12&_q=${query}&_p=1`
          );
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
    }, [query]);
  
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Polymarket Events</h1>
        {isLoading ? (
          <div className="text-center">
            <p>Loading markets...</p>
          </div>
        ) : markets.length > 0 ? (
          <div className="space-y-4">
            {markets.map((event) => (
              <div
                key={event.id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-lg font-semibold mb-2">{event.title}</h2>
                <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <strong>Start:</strong>{" "}
                    {new Date(event.startDate).toLocaleString()}
                  </p>
                  <p>
                    <strong>End:</strong>{" "}
                    {new Date(event.endDate).toLocaleString()}
                  </p>
                  <p>
                    <strong>24hr Volume:</strong> ${event.volume24hr.toLocaleString()}
                  </p>
                  <p>
                    <strong>Liquidity:</strong> ${event.liquidity.toLocaleString()}
                  </p>
                </div>
                {/* Display Markets */}
                <div className="mt-4">
                  <h3 className="text-md font-semibold">Markets</h3>
                  <div className="space-y-2">
                    {event.markets.map((market) => (
                      <div
                        key={market.id}
                        className="bg-gray-100 p-3 rounded-lg border border-gray-300"
                      >
                        <p>
                          <strong>Question:</strong> {market.question}
                        </p>
                        <p>
                          <strong>Outcomes:</strong>{" "}
                          {market.outcomes.join(", ")}
                        </p>
                        <p>
                          <strong>Prices:</strong>{" "}
                          {market.outcomePrices.map(
                            (price, idx) => `${market.outcomes[idx]}: ${price}`
                          ).join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p>No markets found for "{query}".</p>
          </div>
        )}
      </div>
    );
  }
  

function ParseEventSearchResponse(response: any): EventSearchResponse {
    try {
        if (Array.isArray(response)) {
            // Filter and map the events
            const filteredData: PlmSubject[] = response
                .filter(
                    event =>
                        event.markets &&
                        event.markets.length === 1 && // Ensure only events with exactly one market
                        event.markets.some((market: any) => market.groupItemTitle === "")
                )
                .map(event => {
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
