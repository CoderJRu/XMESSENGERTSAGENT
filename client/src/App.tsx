import { useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import ProfileSettings from "./js/profile.tsx";
import { setConnectedEthAddress } from "./walletstore";

export default function App() {
  const { user, login, logout, ready, authenticated } = usePrivy();
  const { wallets } = useWallets();

  // Find the correct wallet - prioritize linked account over embedded wallet
  const getCorrectWallet = () => {
    console.log("🔍 All wallets in App:", wallets);
    console.log("🔍 Wallet details:", wallets.map(w => ({ 
      address: w.address, 
      walletClientType: w.walletClientType,
      connectorType: w.connectorType
    })));
    
    // Find the linked account wallet (usually the external wallet like MetaMask)
    const linkedWallet = wallets.find(wallet => 
      wallet.connectorType === 'injected' || 
      wallet.walletClientType === 'metamask' ||
      wallet.walletClientType === 'injected'
    );
    
    // Fallback to embedded wallet if no linked wallet found
    const activeWallet = linkedWallet || wallets.find(wallet => 
      wallet.walletClientType === 'privy'
    ) || wallets[0];
    
    console.log("🔑 Selected wallet in App:", activeWallet);
    return activeWallet;
  };

  const address = getCorrectWallet()?.address;

  useEffect(() => {
    if (ready && authenticated) {
      setConnectedEthAddress(address); // ✅ update global store
      console.log("Connected address:", address);
    } else {
      setConnectedEthAddress(undefined); // clear if logged out
    }
  }, [ready, authenticated, address]);

  // Listen for login/logout events from profile component
  useEffect(() => {
    const handleProfileLogin = () => {
      console.log("🟢 Profile login event received, calling login()");
      login();
    };
    
    const handleProfileLogout = () => {
      console.log("🔴 Profile logout event received, calling logout()");
      logout();
    };

    window.addEventListener("privy-login", handleProfileLogin);
    window.addEventListener("privy-logout", handleProfileLogout);
    
    return () => {
      window.removeEventListener("privy-login", handleProfileLogin);
      window.removeEventListener("privy-logout", handleProfileLogout);
    };
  }, [login, logout]);

  return (
    <>
      {console.log("connected global address: ", address)}
    </>
  );
}
