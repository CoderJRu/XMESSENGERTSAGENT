const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
console.log("VITE_SUPABASE_URL:", supabaseUrl);
console.log("VITE_SUPABASE_KEY:", supabaseKey ? "✓ Present" : "✗ Missing");

export default function App() {
  return <main>React ⚛️ + Vite ⚡ + Replit 🌀</main>;
}
