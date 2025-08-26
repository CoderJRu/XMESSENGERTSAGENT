import React from 'react';
import WalletConnection from './components/WalletConnection';

export default function App() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Multi-Wallet Connection
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Connect your Demos wallet and Ethereum wallet to access token balances
          </p>
        </header>
        
        <div className="max-w-2xl mx-auto">
          <WalletConnection />
        </div>
      </div>
    </main>
  );
}
