import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  STUDIONET_CHAIN_ID,
  STUDIONET_CHAIN_ID_HEX,
  STUDIONET_NAME,
  STUDIONET_RPC_URL,
  STUDIONET_EXPLORER_URL,
} from '../config/chain';
import { getWriteClient } from '../services/contractService';

export interface EIP6963ProviderDetail {
  info: {
    uuid: string;
    name: string;
    icon: string;
    rdns: string;
  };
  provider: any;
}

interface WalletContextType {
  account: string | null;
  chainId: number | null;
  isConnecting: boolean;
  discoveredWallets: EIP6963ProviderDetail[];
  connectWallet: (providerDetail?: EIP6963ProviderDetail) => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<void>;
  writeClient: any | null;
  isCorrectNetwork: boolean;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  chainId: null,
  isConnecting: false,
  discoveredWallets: [],
  connectWallet: async () => {},
  disconnectWallet: () => {},
  switchNetwork: async () => {},
  writeClient: null,
  isCorrectNetwork: false,
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [activeProvider, setActiveProvider] = useState<any | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [discoveredWallets, setDiscoveredWallets] = useState<EIP6963ProviderDetail[]>([]);

  // EIP-6963 provider announcement listener
  useEffect(() => {
    const handleAnnouncement = (event: any) => {
      const detail: EIP6963ProviderDetail = event.detail;
      setDiscoveredWallets((prev) => {
        if (prev.some((w) => w.info.uuid === detail.info.uuid)) return prev;
        return [...prev, detail];
      });
    };

    window.addEventListener('eip6963:announceProvider', handleAnnouncement);
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    return () => {
      window.removeEventListener('eip6963:announceProvider', handleAnnouncement);
    };
  }, []);

  // Update chainId and accounts when provider is active
  const setupListeners = useCallback((provider: any) => {
    if (!provider?.on) return;

    provider.on('accountsChanged', (accounts: string[]) => {
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount(null);
        setActiveProvider(null);
      }
    });

    provider.on('chainChanged', (hexChain: string) => {
      const parsed = parseInt(hexChain, 16);
      setChainId(parsed);
    });
  }, []);

  const switchNetwork = async () => {
    const provider = activeProvider || (window as any).ethereum;
    if (!provider?.request) return;

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: STUDIONET_CHAIN_ID_HEX }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: STUDIONET_CHAIN_ID_HEX,
                chainName: STUDIONET_NAME,
                nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
                rpcUrls: [STUDIONET_RPC_URL],
                blockExplorerUrls: [STUDIONET_EXPLORER_URL],
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      } else {
        console.error('Failed to switch network:', switchError);
      }
    }
  };

  const connectWallet = async (walletDetail?: EIP6963ProviderDetail) => {
    setIsConnecting(true);
    try {
      const provider = walletDetail?.provider || (window as any).ethereum;
      if (!provider?.request) {
        alert('No web3 provider found. Please install MetaMask or Rabby.');
        setIsConnecting(false);
        return;
      }

      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setActiveProvider(provider);
        setupListeners(provider);

        const currentChainHex = await provider.request({ method: 'eth_chainId' });
        const currentChain = parseInt(currentChainHex, 16);
        setChainId(currentChain);

        if (currentChain !== STUDIONET_CHAIN_ID) {
          await switchNetwork();
        }
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setActiveProvider(null);
  };

  const writeClient = account && activeProvider ? getWriteClient(account, activeProvider) : null;
  const isCorrectNetwork = chainId === STUDIONET_CHAIN_ID;

  return (
    <WalletContext.Provider
      value={{
        account,
        chainId,
        isConnecting,
        discoveredWallets,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        writeClient,
        isCorrectNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
