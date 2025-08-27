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
    // grab the connected wallet address (if any)
    ConnectedEthAddress = wallets[0]?.address;
    
    window.addEventListener("privy-login", handler);
    return () => window.removeEventListener("privy-login", handler);
  }, [login]);
 
  useEffect(() => {
    if (ready && authenticated) {
      console.log("✅ User is still connected after reload:", user);
      console.log("connected address is ", wallets[0].address);
    } else if (ready && !authenticated) {
      console.log("⚠️ No user session found. Need to log in.");
    }
  }, [ready, authenticated, user]);

  return (
    <div>
      <ProfileSettings />
    </div>
  );
  /*
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  useEffect(() => {
    // wait until the DOM is ready
    const btn = document.querySelector(".copy-eth-btn");

    if (btn) {
      // attach the click event
      btn.addEventListener("click", login);

      console.log("Privy login button connected ✅");
    } else {
      console.warn("Privy button not found ❌");
    }

    // cleanup
    return () => {
      if (btn) btn.removeEventListener("click", login);
    };
  }, [login]);*/
}
