import "./globals.css";
import type { Metadata } from "next";
import { Syne } from "next/font/google";
import {
  DynamicContextProvider,
  EthereumWalletConnectors,
  ZeroDevSmartWalletConnectors,
} from "../lib/dynamic";

const syne = Syne({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MiniSafe",
  description: "MiniSafe allows easier access to your Safe Wallet funds.",
};
const dynamicEnvId = process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!dynamicEnvId) {
    const errMsg =
      "Please add your Dynamic Environment to this project's .env file";
    console.error(errMsg);
    throw new Error(errMsg);
  }
  return (
    <html lang="en">
      <DynamicContextProvider
        settings={{
          environmentId: dynamicEnvId,
          walletConnectors: [EthereumWalletConnectors,ZeroDevSmartWalletConnectors],
        }}
      >
        <body className={syne.className}>{children}</body>
      </DynamicContextProvider>
    </html>
  );
}
