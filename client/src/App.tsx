const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
/*
console.log("VITE_SUPABASE_URL:", supabaseUrl);
console.log("VITE_SUPABASE_KEY:", supabaseKey ? "✓ Present" : "✗ Missing");*/
import { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import ProfileSettings from "./js/profile.tsx";

var ConnectedEthAddress: string = "Not Connected";

export const getConnectedEthAddress = () => {
  return ConnectedEthAddress;
};

export default function App() {
  const { user, login, ready, authenticated } = usePrivy();
  const { wallets } = useWallets();

  useEffect(() => {
    const handler = () => {
      console.log("🟢 Privy login event received, calling login()");
      login();
    };
    window.addEventListener("privy-login", handler);
    return () => window.removeEventListener("privy-login", handler);
  }, [login]);
  // grab the connected wallet address (if any)
  const address = wallets.length > 0 ? wallets[0].address : undefined; // safer
  
  useEffect(() => {
    if (ready && authenticated && address) {
      console.log("✅ User is still connected after reload:", user);
      console.log("connected address is ", address);
      // Update the global variable so other parts of the app can access it
      ConnectedEthAddress = address;
      
      // Also dispatch a custom event so the profile can update
      window.dispatchEvent(new CustomEvent('wallet-address-updated', { 
        detail: { address: address, connected: true } 
      }));
    } else if (ready && !authenticated) {
      console.log("⚠️ No user session found. Need to log in.");
      ConnectedEthAddress = "Not Connected";
      
      // Dispatch event for disconnected state
      window.dispatchEvent(new CustomEvent('wallet-address-updated', { 
        detail: { address: "Not Connected", connected: false } 
      }));
    }
  }, [ready, authenticated, user, address]);

  return (
    <div>
      {ready && authenticated && address ? (
        <div>
          <p>Connected: {address}</p>
          <button onClick={() => navigator.clipboard.writeText(address)}>
            Copy Address
          </button>
        </div>
      ) : !authenticated ? (
        <button onClick={login}>Login</button>
      ) : (
        <div>Loading wallet...</div>
      )}
    </div>
  );
}
