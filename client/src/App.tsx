import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    console.log("🚀 App loaded - Profile.tsx handles all authentication");
  }, []);

  return (
    <div style={{ 
      padding: "20px", 
      textAlign: "center",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <h1>Welcome to the Profile App</h1>
      <p>All authentication is now handled directly in the profile component.</p>
      <p>The profile settings will open when you interact with the profile dropdown.</p>
    </div>
  );
}
