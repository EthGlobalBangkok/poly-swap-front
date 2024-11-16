import { useState } from "react";
import PolymarketList, { QueryType } from "./ui/PolymktList";
import { MarketSummary } from "@/types/polymarket";

type Props = {
  userAddress: string;
  keyWords: string[];
  changeDisplay: (page: string) => void;
  SelectMarket: (market: MarketSummary) => void;
};

export default function MarketSelect({
  userAddress,
  keyWords,
  changeDisplay,
  SelectMarket,
}: Props) {
  const [value, setValue] = useState<string>(userAddress);
  const [queryType, setQueryType] = useState<QueryType>(QueryType.Address);

  return (
    <div className="p-4 bg-gray-100 rounded shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {queryType == QueryType.Address
            ? "Featured PolyMarkets"
            : "Markets for " + value}
        </h1>
        <h2 className="text-gray-600">
          Automated swap trigger from featured markets
        </h2>
      </div>
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
