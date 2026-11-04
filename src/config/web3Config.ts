/**
 * Web3 & MetaMask Configuration for Gamegrafity Farm Sovereign Mode
 * Direct Owner MetaMask Integration (Zero 3rd-party intermediaries)
 */

export const OWNER_METAMASK_ADDRESS =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OWNER_METAMASK_ADDRESS) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_OWNER_METAMASK_ADDRESS) ||
  '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359';

export const PROTOCOL_TREASURY_CONTRACT = '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359';

export const SUPPORTED_CHAINS = {
  ETHEREUM_MAINNET: {
    chainId: 1,
    hexChainId: '0x1',
    name: 'Ethereum Mainnet',
    currency: 'ETH',
    rpcUrl: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io'
  },
  SEPOLIA_TESTNET: {
    chainId: 11155111,
    hexChainId: '0xaa36a7',
    name: 'Sepolia Testnet',
    currency: 'SepoliaETH',
    rpcUrl: 'https://rpc.sepolia.org',
    explorer: 'https://sepolia.etherscan.io'
  },
  ARBITRUM_ONE: {
    chainId: 42161,
    hexChainId: '0xa4b1',
    name: 'Arbitrum One L2',
    currency: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io'
  }
} as const;

export const DEFAULT_CHAIN_ID = 1;
