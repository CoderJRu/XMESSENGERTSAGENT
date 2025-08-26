import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Privy configuration endpoint
  app.get("/api/privy-config", (req, res) => {
    const appId = process.env.PRIVY_APP_ID;
    
    if (!appId) {
      return res.status(500).json({ error: "Privy App ID not configured" });
    }
    
    res.json({ appId });
  });

  // Token balance endpoint
  app.post("/api/token-balances", async (req, res) => {
    const { address, contract } = req.body;
    
    if (!address || !contract) {
      return res.status(400).json({ error: "Address and contract are required" });
    }

    try {
      // Mock token balances for now - in production, you'd call the actual contract
      // This would typically use Web3.js or ethers.js to query the contract
      const mockBalances = {
        xToken: "1,250.45",
        xnft: "12"
      };

      // TODO: Replace with actual contract call
      // const web3 = new Web3(process.env.ETHEREUM_RPC_URL);
      // const contractInstance = new web3.eth.Contract(ABI, contract);
      // const xTokenBalance = await contractInstance.methods.balanceOf(address).call();
      
      res.json(mockBalances);
    } catch (error) {
      console.error('Failed to fetch token balances:', error);
      res.status(500).json({ error: "Failed to fetch token balances" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
