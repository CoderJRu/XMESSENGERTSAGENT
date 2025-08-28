const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
/*
console.log("VITE_SUPABASE_URL:", supabaseUrl);
console.log("VITE_SUPABASE_KEY:", supabaseKey ? "✓ Present" : "✗ Missing");*/
import { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import ProfileSettings from "./js/profile.tsx";

export var ConnectedEthAddress: string = "Not Connected";

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
  const address = wallets.length > 0 ? wallets[0].address : undefined;

  // safer
  useEffect(() => {
    if (ready && authenticated && address) {
      console.log("✅ User is still connected after reload:", user);
      console.log("connected address is ", address);
      ConnectedEthAddress = address;
      console.log("connected address is........ ", ConnectedEthAddress);
    } else if (ready && !authenticated) {
      console.log("⚠️ No user session found. Need to log in.");
    }
  }, [ready, authenticated, user, address]);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  useEffect(() => {
    const address = wallets[0]?.address;
    if (authenticated && address) {
      setConnectedAddress(address); // ✅ persist once it exists
      console.log("✅ Connected address set:", address);
    }
  }, [authenticated, wallets]);

  return (
    <>
      {ready ? (
        authenticated ? (
          connectedAddress ? (
            <ProfileSettings
              address={connectedAddress}
              _data={{}}
              login={login}
              onClose={() => console.log("Profile closed")}
            />
          ) : (
            <div>Fetching wallet...</div>
          )
        ) : (
          <button onClick={login}>Login</button>
        )
      ) : (
        <div>Loading Privy session...</div>
      )}
    </>
  );
}
