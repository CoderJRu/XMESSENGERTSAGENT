import React from 'react';
import { useCreateWallet, usePrivy } from './PrivyProvider';

interface CreateWalletButtonProps {
  onSuccess?: (wallet: any) => void;
  onError?: (error: Error) => void;
  className?: string;
  children?: React.ReactNode;
}

export function CreateWalletButton({ 
  onSuccess, 
  onError, 
  className = '',
  children = 'Create Wallet'
}: CreateWalletButtonProps) {
  const { createWallet, loading, error } = useCreateWallet();
  
  const handleCreateWallet = async () => {
    try {
      await createWallet({
        onSuccess: ({ wallet }: { wallet: any }) => {
          console.log("Wallet created:", wallet);
          onSuccess?.(wallet);
        },
        onError: (err: Error) => {
          console.error("Wallet creation failed:", err);
          onError?.(err);
        },
      });
    } catch (err) {
      console.error("Wallet creation failed:", err);
      onError?.(err instanceof Error ? err : new Error('Unknown error'));
    }
  };

  return (
    <div className="create-wallet-container">
      <button 
        onClick={handleCreateWallet}
        disabled={loading}
        className={`create-wallet-btn ${className} ${loading ? 'loading' : ''}`}
        data-testid="button-create-wallet"
      >
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            Creating...
          </div>
        ) : (
          children
        )}
      </button>
      
      {error && (
        <div className="wallet-error" data-testid="text-wallet-error">
          {error}
        </div>
      )}
    </div>
  );
}