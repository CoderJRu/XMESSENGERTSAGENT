import React, { useState } from 'react';
import { PrivyProvider } from './components/PrivyProvider';
import { CreateWalletButton } from './components/CreateWalletButton';
import { PrivyModal } from './components/PrivyModal';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;

console.log("VITE_SUPABASE_URL:", supabaseUrl);
console.log("VITE_SUPABASE_KEY:", supabaseKey ? "✓ Present" : "✗ Missing");
console.log("VITE_PRIVY_APP_ID:", privyAppId ? "✓ Present" : "✗ Missing");

function WalletDemo() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1>Privy Wallet Integration Demo</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <CreateWalletButton 
          onSuccess={(wallet) => {
            console.log('Wallet created successfully:', wallet);
            alert('Wallet created successfully!');
          }}
          onError={(error) => {
            console.error('Wallet creation error:', error);
            alert('Wallet creation failed: ' + error.message);
          }}
        />
      </div>

      <button 
        onClick={() => setShowModal(true)}
        style={{
          padding: '12px 24px',
          backgroundColor: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Open Authentication Modal
      </button>

      <PrivyModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={(wallet) => {
          console.log('Authentication successful:', wallet);
          alert('Authentication successful!');
          setShowModal(false);
        }}
      />
    </div>
  );
}

export default function App() {
  if (!privyAppId) {
    return (
      <main style={{ padding: '20px', color: 'red' }}>
        Error: VITE_PRIVY_APP_ID environment variable is missing
      </main>
    );
  }

  return (
    <PrivyProvider appId={privyAppId}>
      <WalletDemo />
    </PrivyProvider>
  );
}
