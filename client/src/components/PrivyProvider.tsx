import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types for Privy-style implementation
interface Wallet {
  address: string;
  type: 'email' | 'phone' | 'wallet';
  identifier: string;
}

interface PrivyContextType {
  wallet: Wallet | null;
  isConnected: boolean;
  loading: boolean;
  error: string | null;
  createWallet: (method: 'email' | 'phone' | 'wallet', identifier: string) => Promise<void>;
  disconnect: () => void;
}

const PrivyContext = createContext<PrivyContextType | undefined>(undefined);

interface PrivyProviderProps {
  children: ReactNode;
  appId: string;
}

export function PrivyProvider({ children, appId }: PrivyProviderProps) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createWallet = useCallback(async (method: 'email' | 'phone' | 'wallet', identifier: string) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate wallet creation process
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate a mock wallet address for demo purposes
      const address = `0x${Array.from({ length: 40 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;

      const newWallet: Wallet = {
        address,
        type: method,
        identifier
      };

      setWallet(newWallet);
      
      // Store in localStorage for persistence
      localStorage.setItem('privy_wallet', JSON.stringify(newWallet));

      console.log("Wallet created:", newWallet);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Wallet creation failed';
      setError(errorMessage);
      console.error("Wallet creation failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet(null);
    setError(null);
    localStorage.removeItem('privy_wallet');
  }, []);

  // Load wallet from localStorage on mount
  React.useEffect(() => {
    const savedWallet = localStorage.getItem('privy_wallet');
    if (savedWallet) {
      try {
        setWallet(JSON.parse(savedWallet));
      } catch (err) {
        console.error('Failed to load saved wallet:', err);
        localStorage.removeItem('privy_wallet');
      }
    }
  }, []);

  const value: PrivyContextType = {
    wallet,
    isConnected: !!wallet,
    loading,
    error,
    createWallet,
    disconnect
  };

  return (
    <PrivyContext.Provider value={value}>
      {children}
    </PrivyContext.Provider>
  );
}

export function usePrivy() {
  const context = useContext(PrivyContext);
  if (context === undefined) {
    throw new Error('usePrivy must be used within a PrivyProvider');
  }
  return context;
}

export function useCreateWallet() {
  const { createWallet, loading, error } = usePrivy();
  
  return {
    createWallet: useCallback(async (options?: { 
      onSuccess?: (result: { wallet: Wallet }) => void;
      onError?: (error: Error) => void;
    }) => {
      try {
        // For demo purposes, we'll use email as default
        await createWallet('email', 'user@example.com');
        const { wallet } = usePrivy();
        if (wallet && options?.onSuccess) {
          options.onSuccess({ wallet });
        }
      } catch (err) {
        if (options?.onError) {
          options.onError(err instanceof Error ? err : new Error('Unknown error'));
        }
      }
    }, [createWallet]),
    loading,
    error
  };
}