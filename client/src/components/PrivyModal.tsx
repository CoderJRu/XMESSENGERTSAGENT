import React, { useState } from 'react';
import { usePrivy } from './PrivyProvider';

interface PrivyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (wallet: any) => void;
}

export function PrivyModal({ isOpen, onClose, onSuccess }: PrivyModalProps) {
  const { createWallet, loading, error } = usePrivy();
  const [activeTab, setActiveTab] = useState<'email' | 'phone' | 'wallet'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');

  const handleSubmit = async (method: 'email' | 'phone' | 'wallet') => {
    try {
      let identifier = '';
      
      if (method === 'email') {
        if (!email.trim()) {
          alert('Please enter a valid email address');
          return;
        }
        identifier = email.trim();
      } else if (method === 'phone') {
        if (!phone.trim()) {
          alert('Please enter a valid phone number');
          return;
        }
        identifier = `${countryCode}${phone.trim()}`;
      } else {
        identifier = 'wallet_connection';
      }

      await createWallet(method, identifier);
      
      if (onSuccess) {
        onSuccess({ 
          address: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          type: method,
          identifier 
        });
      }
      
      onClose();
    } catch (err) {
      console.error('Authentication failed:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modern-wallet-overlay" data-testid="modal-privy-auth">
      <div className="privy-auth-modal">
        <button 
          className="modal-close-btn" 
          onClick={onClose}
          data-testid="button-close-modal"
        >
          ×
        </button>
        
        <div className="privy-modal-header">
          <div className="privy-logo-container">
            <div className="privy-logo">P</div>
          </div>
          <h2 className="privy-modal-title">Complete Authentication</h2>
        </div>

        <div className="privy-auth-options">
          <button
            className={`privy-auth-button ${activeTab === 'email' ? 'active' : ''}`}
            onClick={() => setActiveTab('email')}
            data-testid="button-auth-email"
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="auth-icon">📧</div>
              <span>Continue with Email</span>
            </div>
            <div className="arrow-icon">→</div>
          </button>

          <button
            className={`privy-auth-button ${activeTab === 'phone' ? 'active' : ''}`}
            onClick={() => setActiveTab('phone')}
            data-testid="button-auth-phone"
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="auth-icon">📱</div>
              <span>Continue with Phone</span>
            </div>
            <div className="arrow-icon">→</div>
          </button>

          <button
            className={`privy-auth-button ${activeTab === 'wallet' ? 'active' : ''}`}
            onClick={() => setActiveTab('wallet')}
            data-testid="button-auth-wallet"
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="auth-icon">👛</div>
              <span>Connect External Wallet</span>
            </div>
            <div className="arrow-icon">→</div>
          </button>
        </div>

        {activeTab === 'email' && (
          <div className="email-input-container">
            <div className="email-input-wrapper">
              <input
                type="email"
                className="email-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit('email')}
                data-testid="input-email"
              />
              <button
                className="email-submit-btn"
                onClick={() => handleSubmit('email')}
                disabled={loading}
                data-testid="button-submit-email"
              >
                {loading ? 'Connecting...' : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'phone' && (
          <div className="phone-input-container">
            <div className="phone-number-input">
              <select
                className="country-select"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                data-testid="select-country-code"
              >
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+33">🇫🇷 +33</option>
                <option value="+49">🇩🇪 +49</option>
                <option value="+81">🇯🇵 +81</option>
                <option value="+86">🇨🇳 +86</option>
              </select>
              <input
                type="tel"
                className="phone-input"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit('phone')}
                data-testid="input-phone"
              />
              <button
                className="phone-submit-btn"
                onClick={() => handleSubmit('phone')}
                disabled={loading}
                data-testid="button-submit-phone"
              >
                {loading ? 'Connecting...' : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="wallet-connect-container">
            <button
              className="wallet-connect-btn"
              onClick={() => handleSubmit('wallet')}
              disabled={loading}
              data-testid="button-connect-wallet"
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          </div>
        )}

        {error && (
          <div className="auth-error" data-testid="text-auth-error">
            {error}
          </div>
        )}

        <div className="privy-footer">
          <span>Secured by</span>
          <div className="privy-brand">
            <span>🔒 Privy</span>
          </div>
        </div>
      </div>
    </div>
  );
}