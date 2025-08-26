import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PrivyProvider } from "@privy-io/react-auth";
//import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID!}   // <-- from Privy dashboard
      config={{
        embeddedWallets: { createOnLogin: "all-users" }, // auto-create wallet
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
  );
