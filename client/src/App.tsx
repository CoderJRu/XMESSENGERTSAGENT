import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";

export default function App() {
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkDemosConnection = async () => {
    try {
      const response = await fetch('/api/demos/status');
      const data = await response.json();
      setConnectionStatus(data.connected);
    } catch (error) {
      console.error('Failed to check connection status:', error);
    }
  };

  const connectToDemos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/demos/connect');
      const data = await response.json();
      if (data.success) {
        setConnectionStatus(true);
      }
    } catch (error) {
      console.error('Failed to connect to Demos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDemosConnection();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Demos SDK Integration
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>
                Current status of Demos SDK connection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${connectionStatus ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={connectionStatus ? 'text-green-700' : 'text-red-700'}>
                  {connectionStatus ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <Button 
                onClick={connectToDemos} 
                disabled={loading || connectionStatus}
                className="mt-4 w-full"
              >
                {loading ? 'Connecting...' : connectionStatus ? 'Connected' : 'Connect to Demos'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>
                Available functionality with the SDK
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={connectionStatus ? 'text-green-600' : 'text-gray-400'}>
                    ✓ Keypair Generation
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={connectionStatus ? 'text-green-600' : 'text-gray-400'}>
                    ✓ Mnemonic Login
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={connectionStatus ? 'text-green-600' : 'text-gray-400'}>
                    ✓ Instant Messaging
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>React ⚛️ + Vite ⚡ + Replit 🌀</CardTitle>
            <CardDescription>
              Full-stack application with server-side SDK integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This application demonstrates proper architecture by moving Node.js dependencies 
              to the server side and creating clean API endpoints for frontend consumption.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
