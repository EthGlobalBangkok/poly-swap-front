import { MarketSummary } from "@/types/polymarket";
import { useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { parseUnits } from "viem";
import SwapOrderFactoryABI  from "../../src/SwapOrderFactoryABI.json";
import crypto from "crypto";

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
function Action({ tokens, selectAction, selectFromAsset, selectToAsset, selectAmount }: ActionProps) {
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
          {tokens.map((token) => (
              <option key={token} value={token}>
              {token}
            </option>
          ))}
        </select>
      </div>

      {/* From Asset */}
      <div className="flex justify-between items-center">
        <label className="text-sm text-gray-700 font-medium">From asset</label>
        <select className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500">
          <option value="USDC">USDC</option>
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
  const [toAsset, setToAsset] = useState("ETH");
  const [amount, setAmount] = useState(0);

  const WETH = "0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1";
  const USDT = "0x4ecaba5870353805a9f068101a40e0f32ed605c6";
  const ORDER_FACTORY = "0xF1D37c91cfE1C3bF137898CF89B96D196d02acCb";

  const { primaryWallet } = useDynamicContext();

  if (!primaryWallet || !isEthereumWallet(primaryWallet)) return null;

  const sendTransaction = async (sellToken:string, buyToken:string, sellAmount:string, buyAmount:string) => {
    try {
      const walletClient = await primaryWallet.getWalletClient();
      if (!walletClient) {
        console.error("Wallet client not found");
        return;
      }
      const mappToken: { [key: string]: string } = {
        "USDC": "0x4ecaba5870353805a9f068101a40e0f32ed605c6",
        "SOL": "0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1",
        "BTC": "0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1",
        "ETH": "0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1",
      }; 
      const salt = "0x" + crypto.randomBytes(32).toString("hex");
      const publicClient = await primaryWallet.getPublicClient();
      const order = {
        sellToken:mappToken[sellToken],
        buyToken: mappToken[buyToken],
        receiver: primaryWallet.address, // Replace with your wallet address
        sellAmount: parseUnits("0.000001", 18),
        buyAmount: parseUnits("0.0002", 6),
        validTo: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 1 week
        marketId: BigInt(1),
        marketWantedResult: BigInt(1),
        feeAmount: parseUnits("0.0005", 18),
        meta: "0x",
      };
      const order2 ={
        "data": "0x4666fc807cecb04ef5ab02da9dd85febb16be48e4de397d53eddf289033d7a3d9264ac4600000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000dcdd79bf63c1e8e2d54ad2abbb4342b152640b440000000000000000000000000000000000000000000000000000000000007a8e000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000086c6966692d617069000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a307830303030303030303030303030303030303030303030303030303030303030303030303030303030000000000000000000000000000000000000000000000000000000000000000000006352a56caadc4f1e25cd6c75970fa768a3304e640000000000000000000000006352a56caadc4f1e25cd6c75970fa768a3304e640000000000000000000000006a023ccd1ff6f2045c3309768ead9e68f978f6e10000000000000000000000004ecaba5870353805a9f068101a40e0f32ed605c6000000000000000000000000000000000000000000000000000009184e72a00000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000bc490411a320000000000000000000000008d2b7e5501eb6d92f8e349f2febe785dd070be74000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000006a023ccd1ff6f2045c3309768ead9e68f978f6e10000000000000000000000004ecaba5870353805a9f068101a40e0f32ed605c60000000000000000000000008d2b7e5501eb6d92f8e349f2febe785dd070be740000000000000000000000001231deb6f5749ef6ce6943a275a1d3e7486f4eae000000000000000000000000000000000000000000000000000009184e72a0000000000000000000000000000000000000000000000000000000000000007a8e0000000000000000000000000000000000000000000000000000000000007b2c0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000933a06c631ed8b5e4f3848c91a1cfc45e5c7eab3000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000660000000000000000000000000000000000000000000000000000000000000078000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000064eb5625d90000000000000000000000006a023ccd1ff6f2045c3309768ead9e68f978f6e1000000000000000000000000ba12222222228d8ba445958a75a0704d566bf2c8000000000000000000000000000000000000000000000000000009184e72a00000000000000000000000000000000000000000000000000000000000000000000000000000000000ba12222222228d8ba445958a75a0704d566bf2c80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000404945bcec90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000003000000000000000000000000008d2b7e5501eb6d92f8e349f2febe785dd070be7400000000000000000000000000000000000000000000000000000000000000000000000000000000000000008d2b7e5501eb6d92f8e349f2febe785dd070be740000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000ffffffff00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000010066888e4f35063ad8bb11506a6fde5024fb4f1db000010000000000000000005300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000009184e72a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000002086f52651837600180de173b09470f54ef7491000000000000000000000004f00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000006a023ccd1ff6f2045c3309768ead9e68f978f6e10000000000000000000000002086f52651837600180de173b09470f54ef749100000000000000000000000004ecaba5870353805a9f068101a40e0f32ed605c600000000000000000000000000000000000000000000000000000000000000037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000648a6a1e850000000000000000000000004ecaba5870353805a9f068101a40e0f32ed605c6000000000000000000000000d9686d2834349e3fd507919a8fba420b2f40004e0000000000000000000000000000000000000000000000000000000000007b2c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000001a49f8654220000000000000000000000004ecaba5870353805a9f068101a40e0f32ed605c600000000000000000000000000000001000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000004400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000064d1660f990000000000000000000000004ecaba5870353805a9f068101a40e0f32ed605c60000000000000000000000001231deb6f5749ef6ce6943a275a1d3e7486f4eae0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "to": "0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE",
        "value": "0x0",
        "gasPrice": "0x81579280",
        "gasLimit": "0x5a3a6",
        "from": "0xdcdd79bf63c1e8e2d54ad2abbb4342b152640b44",
        "chainId": 100
    }
      let pl;
      let inst;
      let receipt


      console.log("Transaction sent:", order);
      const { result, request } = await publicClient.simulateContract({
        address: ORDER_FACTORY,
        abi: SwapOrderFactoryABI,
        functionName: "placeWaitingSwap",
        args: [order, salt],
      });
      console.log("Simulation Result:", result);
      pl = result[0];
      inst = result[1];
      request.gas = BigInt(3000000)
      const tx = await walletClient.writeContract(request);
      console.log("Transaction Hash:", tx);

      // Wait for the transaction receipt
      receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
      console.log("Transaction Receipt:", receipt);





 const envPvKey = process.env.PRIVATE_KEY;
    if (!envPvKey) {
        console.error("Private key not found");
        return;
    }
    const wallert2 = 
      const tx2Crafted = await walletClient.craftTransaction(order2);
        const tx2 = await walletClient.signTransaction(tx2Crafted);
        console.log("Transaction Hash:", tx2.hash);
        const receipt2 = await publicClient.waitForTransactionReceipt({ hash: tx2.hash });



    } catch (error) {
      console.error("Error sending transaction:", error);
    }
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
        selectAmount={setAmount}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        onClick={()=>sendTransaction(fromAsset, toAsset, amount!.toString(), "0.0002")}
      >
        Save automation
      </button>
    </div>
  );
}
