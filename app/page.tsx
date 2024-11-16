"use client";

import { useEffect, useState } from "react";
import {
  useTelegramLogin,
  useDynamicContext,
  DynamicWidget,
} from "../lib/dynamic";
import WebApp from "@twa-dev/sdk";

import { CircularProgress, NextUIProvider } from "@nextui-org/react";

import { WelcomeDisplay } from "./components/WelcomeDisplay";

import MarketSelect from "./components/MarketSelect";
import { MarketSummary } from "@/types/polymarket";
import Order from "./components/Order";

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
  const [selectedWallet, setSelectedWallet] = useState<MarketSummary>();
  // Front-end
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  console.log("user", user);
  function changeDisplay(page: string) {
    setCurrentPage(page);
    setIsMenuOpen(false);
  }

  function selectWallet(wallet: MarketSummary) {
   setSelectedWallet(wallet);
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

    // const signIn = async () => {
    //   if (!user) {
    //     await telegramSignIn({ forceCreateUser: true });
    //   }
    //   setIsLoading(false);
    // };

    // signIn();
    setIsLoading(false);
    changeDisplay("market");

  }, [sdkHasLoaded]);
  console.log("current page", currentPage);
  return (
    <NextUIProvider>
      <main
        className={`flex min-h-screen items-center justify-center py-4 ${
          currentPage.toLowerCase() === "send" ||
          currentPage.toLowerCase() === "apps"
            ? "bg-whitos"
            : "bg-whitos"
        }`}
      >
        {isLoading ? (
          <CircularProgress color="default" />
        ) : user == undefined ? (
          <WelcomeDisplay />
        ) : (
          <>
            <div>
              <DynamicWidget />
              <>
                {(currentPage === "market" && selectWallet !==undefined) ? (
                  <MarketSelect
                    userAddress="0x84212847694332095BC8e3B963EcBF87673e954e"
                    keyWords={["sec", "eth", "btc"]}
                    changeDisplay={changeDisplay}
                    SelectMarket={selectWallet}

                  />
                ) : (
                  currentPage === "order" && <Order market={selectedWallet!} />
                )}
              </>
            </div>
          </>
        )}
      </main>
    </NextUIProvider>
  );
}
