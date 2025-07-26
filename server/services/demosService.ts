// Server-side service for handling Demos SDK operations
import { DemosWebAuth } from "@kynesyslabs/demosdk/websdk";
import { demos } from "@kynesyslabs/demosdk/websdk";

export class DemosService {
  private static instance: DemosService;
  private isConnected = false;

  static getInstance(): DemosService {
    if (!DemosService.instance) {
      DemosService.instance = new DemosService();
    }
    return DemosService.instance;
  }

  async connectSdk(): Promise<any> {
    try {
      const result = await demos.connect("http://84.247.128.61:53550");
      this.isConnected = true;
      console.log("Demos SDK connected:", result);
      return { success: true, result };
    } catch (error) {
      console.error("Failed to connect to Demos SDK:", error);
      return { success: false, error: error.message };
    }
  }

  async generateKeypair(): Promise<any> {
    try {
      // Generate keypair logic here
      return { success: true, keypair: "generated_keypair" };
    } catch (error) {
      console.error("Failed to generate keypair:", error);
      return { success: false, error: error.message };
    }
  }

  async loginWithMnemonic(mnemonics: string): Promise<any> {
    try {
      // This would need bip39 but we'll keep it simple for now
      // const seed = bip39.mnemonicToSeedSync(mnemonics);
      // const keypair = DemosWebAuth.keyPairFromMnemonic(seed);
      
      return { 
        success: true, 
        message: "Login functionality moved to server - implementation needed",
        // keypair: keypair 
      };
    } catch (error) {
      console.error("Failed to login with mnemonic:", error);
      return { success: false, error: error.message };
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}