import { MarketSummary } from "@/types/polymarket";
import { useState } from "react";
import { getSigner } from "@dynamic-labs/ethers-v6";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
// export type MarketSummary = {
//     id: string;
//     name: string;
//     image: string;
//     price: number;
//     volume: number;
//   };
type MarketProps = {
  market: MarketSummary;
};
type Props = {
  market: MarketSummary;
};
function SelectedMarket({ market }: MarketProps) {
  return (
    // img on the left - the rest up to down
    <div className="flex flex-row items-center space-x-4">
      <img
        src={market.image}
        alt={market.name}
        className="w-24 h-24 object-cover rounded-lg"
      />
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">{market.name}</h2>
        <p className="text-lg">Yes currently at: {market.price}</p>
        <p className="text-lg">Volume: {market.volume}</p>
      </div>
    </div>
  );
}

type TriggerProps = {
  selectCondition: (condition: string) => void;
  selectThreshold: (threshold: number) => void;
};
function Trigger({ selectCondition, selectThreshold }: TriggerProps) {
  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-100 rounded shadow-md">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800">Trigger</h2>
      <p className="text-lg text-gray-600">
        Select the condition and set the threshold for this PolyMarket.
      </p>

      {/* Condition Selector */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700">Condition</label>
        <select
          className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => selectCondition(e.target.value)}
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      {/* Threshold Input */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Threshold (%)
        </label>
        <input
          type="number"
          min="10"
          max="100"
          className="border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter a value between 10 and 100"
        />
      </div>
    </div>
  );
}
type ActionProps = {
  tokens: string[];
  selectAction: (action: string) => void;
  selectFromAsset: (asset: string) => void;
  selectToAsset: (asset: string) => void;
  selectAmount: (amount: number) => void;
};
function Action({ tokens }: ActionProps) {
  return (
    <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md max-w-md space-y-4">
      {/* Title and Description */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Action</h2>
        <p className="text-sm text-gray-500">
          Select the action you want to automate if the previous trigger is
          activated
        </p>
      </div>

      {/* Condition */}
      <div className="flex justify-between items-center">
        <label className="text-sm text-gray-700 font-medium">Condition</label>
        <select className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500">
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>

      {/* Buy Asset */}
      <div className="flex justify-between items-center">
        <label className="text-sm text-gray-700 font-medium">Buy asset</label>
        <select className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500">
          <option value="USDC">USDC</option>
        </select>
      </div>

      {/* From Asset */}
      <div className="flex justify-between items-center">
        <label className="text-sm text-gray-700 font-medium">From asset</label>
        <select className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500">
          {tokens.map((token) => (
            <option key={token} value={token}>
              {token}
            </option>
          ))}
        </select>
      </div>

      {/* Amount */}
      <div className="flex justify-between items-center">
        <label className="text-sm text-gray-700 font-medium">Amount</label>
        <input
          type="number"
          placeholder="Enter amount"
          className="border border-gray-300 rounded-lg p-2 w-2/3 text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}

export default function Order({ market }: Props) {
  const [isCondYes, setIsCondYes] = useState(true);
  const [threshold, setThreshold] = useState(50);
  const [action, setAction] = useState("buy");
  const [fromAsset, setFromAsset] = useState("USDC");
  const [toAsset, setToAsset] = useState("SOL");

  const { primaryWallet } = useDynamicContext();
  if (!primaryWallet) {
    return <div>Connect your wallet to start automating</div>;
  }
  const sendTransaction = async () => {
    const signer = await getSigner(primaryWallet);

    // Now you can use the signer to write data to the blockchain
    const tx = await signer?.sendTransaction({
      to: signer.address,
      value: "1000",
    });
    return tx;
  };
  return (
    <div className="p-4">
      <SelectedMarket market={market} />
      <Trigger
        selectCondition={(condition) => setIsCondYes(condition === "yes")}
        selectThreshold={setThreshold}
      />
      <Action
        tokens={["SOL", "BTC", "ETH"]}
        selectAction={setAction}
        selectFromAsset={setFromAsset}
        selectToAsset={setToAsset}
        selectAmount={(amount) => console.log(amount)}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        onClick={sendTransaction}
      >
        Save automation
      </button>
    </div>
  );
}