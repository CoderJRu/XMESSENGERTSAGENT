import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PrivyProvider } from "@privy-io/react-auth";
//import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#9945FF",
          logo: "https://pbs.twimg.com/profile_banners/1684221890242412545/1708592912/1080x360",
        },
        embeddedWallets: { createOnLogin: "all-users" },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>,
);
