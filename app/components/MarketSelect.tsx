import { useState } from "react";
import PolymarketList, { QueryType } from "./ui/PolymktList";
import { MarketSummary, PolySwap } from "@/types/polymarket";

type Props = {
  userAddress: string;
  keyWords: string[];
  changeDisplay: (page: string) => void;
  SelectMarket: (market: MarketSummary) => void;
  pendingSwaps: PolySwap[]; // Add pending swaps prop
};

export default function MarketSelect({
  userAddress,
  keyWords,
  changeDisplay,
  SelectMarket,
  pendingSwaps,
}: Props) {
  const [value, setValue] = useState<string>(userAddress);
  const [queryType, setQueryType] = useState<QueryType>(QueryType.Address);
    pendingSwaps = [
    {
      id: "1",
      name: "PolySwap",
      tokenFrom: "USDC",
      tokenTo: "ETH",
      amount: 1000,
      price: 5,
    },
    {
      id: "2",
      name: "PolySwap",
      tokenFrom: "USDC",
      tokenTo: "ETH",
      amount: 1000,
      price: 5,
    },
    ];
  return (
    <div className="p-4 bg-gray-100 rounded shadow-lg">
      {/* Pending PolySwap Section */}
      {pendingSwaps.length > 0 && (
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">Pending PolySwap</h1>
          <p className="text-gray-600 mb-4">
            Planned automation pending activation
          </p>
          <div className="space-y-4">
            {pendingSwaps.map((swap) => (
              <div
                key={swap.id}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div>
                  <h2 className="text-sm font-semibold">
                    {swap.name} Action &gt;= {swap.price}% YES
                  </h2>
                  <p className="text-sm text-gray-600">
                    Buy {swap.tokenTo} from {swap.amount} {swap.tokenFrom}
                  </p>
                </div>
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2"
                  title="Activate"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25M15.75 3.75v1.5m0-1.5h-1.5M15.75 3.75h1.5m0 15.75H9m6.75 0h-6.75m0 0v1.5m0-1.5v-1.5m0 0h-1.5m0 1.5h1.5m-4.5-3V9m0 9v1.5m9-9v1.5M9 12h6m0 0H9"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured PolyMarkets Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {queryType === QueryType.Address
            ? "Featured PolyMarkets"
            : "Markets for " + value}
        </h1>
        <h2 className="text-gray-600">
          Automated swap trigger from featured markets
        </h2>
      </div>

      {/* Keyword Selector */}
      <div className="flex gap-4 mb-4">
        {keyWords.map((keyWord, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-sm font-semibold rounded-md ${
              value === keyWord
                ? "bg-white text-gray-900 shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            } border ${
              value === keyWord ? "border-gray-300" : "border-gray-200"
            } transition-all`}
            onClick={(e) => {
              e.preventDefault();
              setValue(keyWord);
              setQueryType(
                queryType === QueryType.Address
                  ? QueryType.Keyword
                  : QueryType.Address
              );
            }}
          >
            {keyWord}
          </button>
        ))}
      </div>

      {/* Polymarket List Component */}
      <PolymarketList
        value={value}
        queryType={queryType}
        changeDisplay={changeDisplay}
        selectMarket={SelectMarket}
      />
    </div>
  );
}
