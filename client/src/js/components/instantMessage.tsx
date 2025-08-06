import { instantMessaging } from "@kynesyslabs/demosdk";
import { encryption } from "@kynesyslabs/demosdk";

const unifiedCrypto = encryption.ucrypto;

export async function setupMessenger(mlKemAes: any, id: any) {
    // Create and connect peer
    const peer = new instantMessaging.MessagingPeer({
        serverUrl: "http://nodes.cruxdecussata.com:3002",
        clientId: "xm_user-" + id,
        publicKey: mlKemAes,
    });

    await peer.connect();
    //
    console.log("peeeer is mee heere ", peer);
    // Set up message handler
    peer.onMessage((message, fromId) => {
        console.log(`Message from ${fromId}:`, message);
    });

    // Discover available peers
    const peers = await peer.discoverPeers();
    console.log("Available peers:", peers);

    return peer;
}

// Use the messenger
//const messenger = await setupMessenger();
