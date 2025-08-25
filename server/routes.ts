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

  const httpServer = createServer(app);

  return httpServer;
}
