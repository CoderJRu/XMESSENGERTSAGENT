import { useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import ProfileSettings from "./js/profile.tsx";
import { setConnectedEthAddress } from "./walletstore";

export default function App() {
  const { user, login, logout, ready, authenticated } = usePrivy();
  const { wallets } = useWallets();

  const address = wallets.length > 0 ? wallets[0].address : undefined;

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
