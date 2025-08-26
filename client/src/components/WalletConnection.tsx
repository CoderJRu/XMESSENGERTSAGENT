import React, { useState, useEffect } from 'react';
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth';
import * as XmComponents from '../js/components/request';
import { showLoading, hideLoading } from '../js/loading';

interface WalletData {
  username: string;
  publicKey: string;
  [key: string]: any;
}

interface EthereumWalletData {
  address: string;
  isConnected: boolean;
}

// Success popup component
const SuccessPopup: React.FC<{
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}> = ({ isVisible, title, message, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-green-100 rounded-full">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

// Token balance component
const TokenBalances: React.FC<{ ethereumAddress: string }> = ({ ethereumAddress }) => {
  const [balances, setBalances] = useState<{ xToken: string; xnft: string } | null>(null);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!ethereumAddress) return;
      
      try {
        // Fetch token balances from contract "0xa2D65c475c4378d6bD955FE21EF219F0199e6bA2"
        const response = await fetch('/api/token-balances', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            address: ethereumAddress,
            contract: "0xa2D65c475c4378d6bD955FE21EF219F0199e6bA2"
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          setBalances(data);
        }
      } catch (error) {
        console.error('Failed to fetch token balances:', error);
      }
    };

    fetchBalances();
  }, [ethereumAddress]);

  if (!balances) return null;

  return (
    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-medium mb-2">Token Balances</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>X Token:</span>
          <span className="font-mono">{balances.xToken}</span>
        </div>
        <div className="flex justify-between">
          <span>XNFT:</span>
          <span className="font-mono">{balances.xnft}</span>
        </div>
      </div>
    </div>
  );
};

// Main wallet connection component
const WalletConnectionContent: React.FC = () => {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();
  
  const [demosWallet, setDemosWallet] = useState<WalletData | null>(null);
  const [demosConnected, setDemosConnected] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });
  const [phraseList, setPhraseList] = useState<string[]>([]);

  // Connect Demos wallet
  const connectDemosWallet = async (phrase: string) => {
    try {
      showLoading();
      const results: any = await XmComponents.loginPhrase(phrase);

      if (results.status === "success") {
        setDemosWallet(results.data);
        setDemosConnected(true);
        setPhraseList(phrase.split(" "));
        
        setSuccessMessage({
          title: "Demos Wallet Connected!",
          message: "Your Demos account has been successfully connected. Now connect your Ethereum wallet for token balances."
        });
        setShowSuccess(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to connect Demos wallet:', error);
      return false;
    } finally {
      hideLoading();
    }
  };

  // Create new Demos wallet
  const createDemosWallet = async () => {
    try {
      showLoading();
      const generateJson = await XmComponents.generatePhrases();

      if (generateJson._status === "error") {
        return false;
      }

      const phrases = generateJson._mnemonics.split(" ");
      setPhraseList(phrases);

      const response = await XmComponents.createAccount(
        generateJson._keypair,
        generateJson._publicKey,
        phrases
      );

      if (response.status === "success") {
        setDemosWallet(response.data);
        setDemosConnected(true);
        
        setSuccessMessage({
          title: "Demos Wallet Created!",
          message: "Your new Demos wallet account has been created successfully. Now connect your Ethereum wallet for token balances."
        });
        setShowSuccess(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create Demos wallet:', error);
      return false;
    } finally {
      hideLoading();
    }
  };

  // Handle Ethereum wallet connection via Privy
  const connectEthereumWallet = async () => {
    if (!ready) return;
    
    try {
      showLoading();
      await login();
    } catch (error) {
      console.error('Failed to connect Ethereum wallet:', error);
    } finally {
      hideLoading();
    }
  };

  // Get connected Ethereum wallet
  const ethereumWallet = wallets.find(wallet => wallet.walletClientType === 'metamask' || wallet.walletClientType === 'coinbase_wallet' || wallet.connectorType === 'injected');

  const handleDemosConnect = async () => {
    const phraseInput = document.querySelector<HTMLInputElement>('.modern-phrase-input');
    const phrase = phraseInput?.value.trim() || '';
    
    if (phrase.length > 0) {
      await connectDemosWallet(phrase);
      if (phraseInput) phraseInput.value = '';
    }
  };

  return (
    <div className="wallet-connection-container">
      <div className="flex flex-col space-y-6 p-6">
        
        {/* Demos Wallet Section */}
        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-medium mb-4">Step 1: Demos Wallet</h3>
          
          {!demosConnected ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Connect existing wallet</label>
                <input
                  type="text"
                  className="modern-phrase-input w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter your 12-word seed phrase..."
                />
                <button
                  onClick={handleDemosConnect}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Connect Wallet
                </button>
              </div>
              
              <div className="text-center">
                <span className="text-gray-500">or</span>
              </div>
              
              <div>
                <button
                  onClick={createDemosWallet}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create New Wallet
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-800 dark:text-green-200">
                  Demos wallet connected: {demosWallet?.username || 'Unknown'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Ethereum Wallet Section */}
        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-medium mb-4">Step 2: Ethereum Wallet</h3>
          
          {!ready ? (
            <div className="text-gray-500">Loading Privy...</div>
          ) : !authenticated ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Connect your Ethereum wallet to view token balances and interact with DeFi protocols.
              </p>
              <button
                onClick={connectEthereumWallet}
                disabled={!demosConnected}
                className={`w-full px-4 py-2 rounded-lg transition-colors ${
                  demosConnected
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Connect Ethereum Wallet with Privy
              </button>
              {!demosConnected && (
                <p className="text-sm text-orange-600">
                  Please connect your Demos wallet first
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-purple-800 dark:text-purple-200">
                      Ethereum wallet connected
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Disconnect
                  </button>
                </div>
                {ethereumWallet && (
                  <div className="mt-2 text-sm font-mono text-purple-700 dark:text-purple-300">
                    {ethereumWallet.address}
                  </div>
                )}
              </div>

              {/* Token Balances */}
              {ethereumWallet && (
                <TokenBalances ethereumAddress={ethereumWallet.address} />
              )}
            </div>
          )}
        </div>

        {/* Status Summary */}
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
          <h3 className="text-lg font-medium mb-2">Connection Status</h3>
          <div className="flex items-center justify-between">
            <span>Demos Wallet:</span>
            <span className={demosConnected ? 'text-green-600' : 'text-gray-500'}>
              {demosConnected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span>Ethereum Wallet:</span>
            <span className={authenticated ? 'text-green-600' : 'text-gray-500'}>
              {authenticated ? 'Connected' : 'Not Connected'}
            </span>
          </div>
        </div>
      </div>

      <SuccessPopup
        isVisible={showSuccess}
        title={successMessage.title}
        message={successMessage.message}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
};

// Main component with Privy provider
const WalletConnection: React.FC = () => {
  // Get Privy App ID from environment
  const privyAppId = import.meta.env.VITE_PRIVY_APP_ID || 'clpispdty00lu11pf5keb17hj'; // fallback for testing

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        loginMethods: ['wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#6A82FB',
          logo: undefined
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        }
      }}
    >
      <WalletConnectionContent />
    </PrivyProvider>
  );
};

export default WalletConnection;