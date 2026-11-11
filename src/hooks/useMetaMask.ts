import { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { OWNER_METAMASK_ADDRESS, DEFAULT_CHAIN_ID, SUPPORTED_CHAINS } from '../config/web3Config';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface UseMetaMaskReturn {
  account: string | null;
  chainId: number | null;
  balanceEth: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  isMetaMask: boolean;
  isOwnerWallet: boolean;
  error: string | null;
  connect: () => Promise<string | null>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  switchNetwork: (targetChainId?: number) => Promise<boolean>;
  openMetaMaskMobileDeepLink: () => void;
}

export function useMetaMask(): UseMetaMaskReturn {
  const [account, setAccount] = useState<string | null>(() => {
    try {
      return localStorage.getItem('gamegrafity_profile_wallet') || null;
    } catch {
      return null;
    }
  });
  const [chainId, setChainId] = useState<number | null>(null);
  const [balanceEth, setBalanceEth] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [providerAvailable, setProviderAvailable] = useState<boolean>(() => {
    return typeof window !== 'undefined' && Boolean(window.ethereum);
  });

  const checkCountRef = useRef(0);

  // Fetch ETH balance for an account
  const fetchBalance = useCallback(async (addr: string) => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceBigInt = await provider.getBalance(addr);
      const formatted = ethers.formatEther(balanceBigInt);
      setBalanceEth(Number(formatted).toFixed(4));
    } catch (err) {
      console.warn('Failed to fetch balance from MetaMask provider:', err);
    }
  }, []);

  // Silent account check & read
  const checkConnectedAccounts = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    setProviderAvailable(true);

    try {
      // eth_accounts returns the authorized accounts without triggering a popup
      const accounts: string[] = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        const activeAddr = accounts[0];
        setAccount(activeAddr);
        fetchBalance(activeAddr);
        localStorage.setItem('gamegrafity_wallet_connected', 'true');
        localStorage.setItem('gamegrafity_profile_wallet', activeAddr);
      } else {
        // If localStorage thought we were connected but MetaMask revoked permissions
        if (localStorage.getItem('gamegrafity_wallet_connected') === 'true') {
          // Keep address in profile if saved, but mark session unlinked
        }
      }

      // Fetch Chain ID
      const hexChainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (hexChainId) {
        setChainId(parseInt(hexChainId, 16));
      }
    } catch (err) {
      console.warn('Error reading eth_accounts:', err);
    }
  }, [fetchBalance]);

  // Handle provider detection (immediate + asynchronous injection from browser extension)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Immediate check if already injected
    if (window.ethereum) {
      checkConnectedAccounts();
    }

    // 2. Standard MetaMask injection event
    const handleInitialized = () => {
      setProviderAvailable(true);
      checkConnectedAccounts();
    };
    window.addEventListener('ethereum#initialized', handleInitialized, { once: true });

    // 3. Fallback interval polling for late asynchronous extension injection (up to 3 seconds)
    const interval = setInterval(() => {
      checkCountRef.current += 1;
      if (window.ethereum) {
        setProviderAvailable(true);
        checkConnectedAccounts();
        clearInterval(interval);
      } else if (checkCountRef.current > 10) {
        clearInterval(interval);
      }
    }, 300);

    // 4. Attach EIP-1193 Event Listeners
    const handleAccountsChanged = (accounts: string[]) => {
      if (!accounts || accounts.length === 0) {
        // User disconnected wallet in MetaMask
        setAccount(null);
        setBalanceEth(null);
        localStorage.removeItem('gamegrafity_wallet_connected');
      } else {
        const nextAddr = accounts[0];
        setAccount(nextAddr);
        fetchBalance(nextAddr);
        setError(null);
        localStorage.setItem('gamegrafity_wallet_connected', 'true');
        localStorage.setItem('gamegrafity_profile_wallet', nextAddr);
      }
    };

    const handleChainChanged = (hexChainId: string) => {
      setChainId(parseInt(hexChainId, 16));
      if (account) {
        fetchBalance(account);
      }
    };

    const handleDisconnect = () => {
      setAccount(null);
      setBalanceEth(null);
      localStorage.removeItem('gamegrafity_wallet_connected');
    };

    if (window.ethereum?.on) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('ethereum#initialized', handleInitialized);
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [checkConnectedAccounts, fetchBalance, account]);

  // Connect wallet handler with eth_requestAccounts
  const connect = useCallback(async (): Promise<string | null> => {
    if (typeof window === 'undefined') return null;

    if (!window.ethereum) {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        const cleanUrl = window.location.href.replace(/^https?:\/\//, '');
        window.location.href = `https://metamask.app.link/dapp/${cleanUrl}`;
        return null;
      }

      setError('MetaMask tidak terdeteksi. Silakan pasang ekstensi browser MetaMask dari https://metamask.io');
      return null;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Triggers the MetaMask extension popup requesting permission
      const accounts: string[] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        const connectedAddr = accounts[0];
        setAccount(connectedAddr);
        await fetchBalance(connectedAddr);

        // Fetch chain ID as well
        const hexChainId = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(parseInt(hexChainId, 16));

        localStorage.setItem('gamegrafity_wallet_connected', 'true');
        localStorage.setItem('gamegrafity_profile_wallet', connectedAddr);

        setIsConnecting(false);
        return connectedAddr;
      }

      setIsConnecting(false);
      return null;
    } catch (err: any) {
      setIsConnecting(false);
      if (err.code === 4001) {
        setError('Koneksi MetaMask dibatalkan oleh pengguna.');
      } else {
        setError(err.message || 'Gagal menghubungkan MetaMask.');
      }
      return null;
    }
  }, [fetchBalance]);

  // Disconnect handler
  const disconnect = useCallback(() => {
    setAccount(null);
    setBalanceEth(null);
    setError(null);
    localStorage.removeItem('gamegrafity_wallet_connected');
    localStorage.removeItem('gamegrafity_profile_wallet');
  }, []);

  // Refresh balance on demand
  const refreshBalance = useCallback(async () => {
    if (account) {
      await fetchBalance(account);
    }
  }, [account, fetchBalance]);

  // Switch network helper (Supports auto-adding Polygon and Arbitrum One to MetaMask)
  const switchNetwork = useCallback(async (targetChainId = DEFAULT_CHAIN_ID): Promise<boolean> => {
    if (typeof window === 'undefined' || !window.ethereum) return false;
    const hex = '0x' + targetChainId.toString(16);
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hex }],
      });
      return true;
    } catch (err: any) {
      // Error code 4902 indicates that the chain has not been added to MetaMask
      if (err.code === 4902 || err?.data?.originalError?.code === 4902 || err.message?.includes('Unrecognized chain ID')) {
        const chainConfig = Object.values(SUPPORTED_CHAINS).find((c) => c.chainId === targetChainId);
        if (chainConfig) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: hex,
                  chainName: chainConfig.name,
                  nativeCurrency: {
                    name: chainConfig.currency,
                    symbol: chainConfig.currency,
                    decimals: 18,
                  },
                  rpcUrls: [chainConfig.rpcUrl],
                  blockExplorerUrls: [chainConfig.explorer],
                },
              ],
            });
            return true;
          } catch (addErr) {
            console.warn('Failed to add chain to MetaMask:', addErr);
          }
        }
      }
      console.warn('Network switch failed or rejected:', err);
      return false;
    }
  }, []);

  const openMetaMaskMobileDeepLink = useCallback(() => {
    if (typeof window === 'undefined') return;
    const cleanUrl = window.location.href.replace(/^https?:\/\//, '');
    window.location.href = `https://metamask.app.link/dapp/${cleanUrl}`;
  }, []);

  const isConnected = Boolean(account);
  const isMetaMask = providerAvailable || Boolean(typeof window !== 'undefined' && window.ethereum?.isMetaMask);
  const isOwnerWallet = Boolean(
    account && account.toLowerCase() === OWNER_METAMASK_ADDRESS.toLowerCase()
  );

  return {
    account,
    chainId,
    balanceEth,
    isConnecting,
    isConnected,
    isMetaMask,
    isOwnerWallet,
    error,
    connect,
    disconnect,
    refreshBalance,
    switchNetwork,
    openMetaMaskMobileDeepLink,
  };
}
