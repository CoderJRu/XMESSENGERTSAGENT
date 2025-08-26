const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
console.log("VITE_SUPABASE_URL:", supabaseUrl);
console.log("VITE_SUPABASE_KEY:", supabaseKey ? "✓ Present" : "✗ Missing");
import { useEffect } from "react";

import { usePrivy, useWallets } from "@privy-io/react-auth";

export default function App() {
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
  }, [login]);
}
