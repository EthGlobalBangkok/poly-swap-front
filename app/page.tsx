"use client";

import { useEffect, useState } from "react";
import {
  DynamicWidget,
  useTelegramLogin,
  useDynamicContext,
} from "../lib/dynamic";
import WebApp from "@twa-dev/sdk";

import {  CircularProgress, NextUIProvider } from "@nextui-org/react";
import { NavBar } from "./components/ui/NavBar";
import { WelcomeDisplay } from "./components/WelcomeDisplay";
import SetupDisplay from "./components/setup/SetupDisplay";
import { Token } from "@/types/token";
import PolymarketList from "./components/ui/PolymktList";


export default function Main() {
  // Dynamic
  const { sdkHasLoaded, user } = useDynamicContext();

  // Telegram
  const { telegramSignIn } = useTelegramLogin();

  // Data
  const [username, setUsername] = useState<string>();

  // App management
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState("welcome");

  // Front-end
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Active token and market data
  const [tokens, setTokens] = useState<Token[]>([
    {
      chainId: 1,
      name: "Ethereum",
      ticker: "ETH",
      balance: 0,
      logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    },
    {
      chainId: 2,
      name: "Binance Smart Chain",
      ticker: "BNB",
      balance: 0,
      logo: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615",
    },
    {
      chainId: 3,
      name: "Solana",
      ticker: "SOL",
      balance: 0,
      logo: "https://assets.coingecko.com/coins/images/4128/large/coinmarketcap-solana-200.png?1616489452",
    },
    {
      chainId: 4,
      name: "Avalanche",
      ticker: "AVAX",
      balance: 0,
      logo: "https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png?1604021818",
    },
  ]);

  const [activeToken, setActiveToken] = useState<Token | null>(null);
  const [market, setMarket] = useState<PlmSubject | null>(null);
  console.log("user", user);
  function changeDisplay(page: string) {
    setCurrentPage(page);
    setIsMenuOpen(false);
  }

  function toggleToken(token: Token | null) {
    setActiveToken(token);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get("page");

    if (page) {
      setCurrentPage(page);
    }

    if (WebApp.initDataUnsafe.user) {
      setUsername(WebApp.initDataUnsafe.user.username);
      setIsMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!sdkHasLoaded) return;

    const signIn = async () => {
      if (!user) {
        await telegramSignIn({ forceCreateUser: true });
      }
      setIsLoading(false);
    };

    signIn();
  }, [sdkHasLoaded]);

  return (
    <NextUIProvider>
      {currentPage.toLowerCase() !== "send" && (
        <NavBar
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          windowName={currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
          changeDisplay={changeDisplay}
          currentPage={currentPage}
        />
      )}
      <main
        className={`flex min-h-screen items-center justify-center py-4 ${
          currentPage.toLowerCase() === "send" || currentPage.toLowerCase() === "apps"
            ? "bg-lightGreen"
            : "bg-darkGreen"
        }`}
      >
        {isLoading ? (
          <CircularProgress color="default" />
        ) : currentPage.toLowerCase() === "welcome" ? (
          <WelcomeDisplay
            title={
              username
                ? `Hey ${username} 👋, welcome to MiniSafe.`
                : `Welcome to MiniSafe.`
            }
            changeDisplay={changeDisplay}
          />
        ) : (
          <>
            <DynamicWidget />
            {/* TO UNCOMMENT */}
            {/* {user !== undefined && ( */}
              <>
                <SetupDisplay click={toggleToken} tokens={tokens} />
                {activeToken && (
                  <div className="w-full p-4">
                    <h2 className="text-xl font-semibold mb-2">
                      Markets for {activeToken.name}
                    </h2>
                    <PolymarketList query={activeToken.ticker} />
                  </div>
                )}
              </>
            {/* )} */}
          </>
        )}
      </main>
    </NextUIProvider>
  );
}
