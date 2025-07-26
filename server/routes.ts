import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { DemosService } from "./services/demosService";

export async function registerRoutes(app: Express): Promise<Server> {
  const demosService = DemosService.getInstance();

  // API routes for Demos SDK functionality
  app.get("/api/demos/connect", async (req, res) => {
    try {
      const result = await demosService.connectSdk();
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get("/api/demos/status", (req, res) => {
    res.json({ connected: demosService.getConnectionStatus() });
  });

  app.post("/api/demos/generate-keypair", async (req, res) => {
    try {
      const result = await demosService.generateKeypair();
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post("/api/demos/login-mnemonic", async (req, res) => {
    try {
      const { mnemonics } = req.body;
      if (!mnemonics) {
        return res.status(400).json({ success: false, error: "Mnemonics required" });
      }
      const result = await demosService.loginWithMnemonic(mnemonics);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // User management routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const user = await storage.insertUser(req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
