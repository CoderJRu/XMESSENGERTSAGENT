import React, { createContext, useContext, useState, ReactNode } from 'react';

// Mock Privy interfaces
interface MockPrivyUser {
  id: string;
  email?: string;
  wallet?: {
    address: string;
  };
}

interface MockPrivyContextValue {
  ready: boolean;
  authenticated: boolean;
  user: MockPrivyUser | null;
  login: () => void;
  logout: () => void;
}

interface MockWallet {
  address: string;
  chainId: string;
  walletClientType: string;
}

interface MockWalletsContextValue {
  wallets: MockWallet[];
}

// Create contexts
const MockPrivyContext = createContext<MockPrivyContextValue | undefined>(undefined);
const MockWalletsContext = createContext<MockWalletsContextValue | undefined>(undefined);

// Mock Provider component
interface MockPrivyProviderProps {
  appId: string;
  config?: any;
  children: ReactNode;
}

export function PrivyProvider({ children }: MockPrivyProviderProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<MockPrivyUser | null>(null);

  const login = () => {
    console.log("🔄 Mock Privy login called");
    setAuthenticated(true);
    setUser({
      id: 'mock-user-123',
      email: 'mock@example.com',
      wallet: {
        address: '0x1234567890123456789012345678901234567890'
      }
    });
  };

  const logout = () => {
    console.log("🔄 Mock Privy logout called");
    setAuthenticated(false);
    setUser(null);
  };

  const contextValue: MockPrivyContextValue = {
    ready: true,
    authenticated,
    user,
    login,
    logout
  };

  const walletsContextValue: MockWalletsContextValue = {
    wallets: authenticated ? [{
      address: '0x1234567890123456789012345678901234567890',
      chainId: '1',
      walletClientType: 'privy'
    }] : []
  };

  return (
    <MockPrivyContext.Provider value={contextValue}>
      <MockWalletsContext.Provider value={walletsContextValue}>
        {children}
      </MockWalletsContext.Provider>
    </MockPrivyContext.Provider>
  );
}

// Mock hooks
export function usePrivy(): MockPrivyContextValue {
  const context = useContext(MockPrivyContext);
  if (!context) {
    throw new Error('usePrivy must be used within a PrivyProvider');
  }
  return context;
}

export function useWallets(): MockWalletsContextValue {
  const context = useContext(MockWalletsContext);
  if (!context) {
    throw new Error('useWallets must be used within a PrivyProvider');
  }
  return context;
}