import { useState } from "react";
import PolymarketList, { QueryType } from "./ui/PolymktList";

type Props = {
    userAddress: string;
    keyWords: string[];
};

export default function MarketSelect({ userAddress, keyWords }: Props) {
    const [value, setValue] = useState<string>(userAddress);
    const [queryType, setQueryType] = useState<QueryType>(QueryType.Address);

    return (
        <div className="p-4 bg-gray-100 rounded shadow-lg">
            {/* Keyword Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
                {keyWords.map((keyWord) => (
                    <button
                        key={keyWord}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        onClick={(e) => {
                            e.preventDefault();
                            setValue(keyWord);
                            setQueryType(QueryType.Keyword);
                        }}
                    >
                        {keyWord}
                    </button>
                ))}
            </div>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Featured PolyMarkets
                </h1>
                <h2 className="text-gray-600">
                    Automated swap trigger from featured markets
                </h2>
            </div>

            {/* Polymarket List Component */}
            <PolymarketList value={value} queryType={queryType} />
        </div>
    );
}
