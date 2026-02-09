import { useEffect, useState } from "react";
import { HomePage } from "./pages/HomePage";
import { UsernameScreen } from "./pages/UsernameScreen";

const STORAGE_KEY = "book-recommender-username";

function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUsername(stored);
    }
    setHydrated(true);
  }, []);

  const handleLogin = (name: string) => {
    setUsername(name);
    window.localStorage.setItem(STORAGE_KEY, name);
  };

  const handleLogout = () => {
    setUsername(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-sm text-gray-500">Yükleniyor...</p>
      </div>
    );
  }

  if (!username) {
    return <UsernameScreen onSubmit={handleLogin} />;
  }

  return <HomePage username={username} onLogout={handleLogout} />;
}


export default App;
