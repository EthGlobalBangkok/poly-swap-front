export const supportedChainId = {
    ethereum: 0x1,
    ethsepolia: 0xaa36a7,
    arbitrum: 0xa4b1,
    arbsepolia: 421614,
    base: 0x2105,
    basesepolia: 0x14a34,
    scroll: 0x82750,
    linea: 0xe708,
  };
  
  export type SupportedChainID =
    | 0x1 // Ethereum
    | 0xaa36a7 // Ethereum Sepolia
    | 0xa4b1 // Arbitrum
    | 421614 // Arbitrum Sepolia
    | 0x2105 // Base
    | 0x14a34 // Base Sepolia
    | 0x82750 // Scroll
    | 0xe708; // Linea
  