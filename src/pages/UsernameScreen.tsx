import { useState } from "react";
import { getUser, createUser } from "../api/users";

interface UsernameScreenProps {
    onSubmit: (username: string) => void;
}

export function UsernameScreen({ onSubmit }: UsernameScreenProps) {
    const [username, setUsername] = useState("");
    const [error, setError] = useState<string | null>(null);
    
    // Login işlemi: Kullanıcı adı varsa onSubmit'i çağır, yoksa hata göster
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = username.trim();
        if (trimmed) {
          try {
            setError(null);
            await getUser(trimmed);
          } catch (e) {
            setError("The user doesn't exist. Please register first or choose a different username.");
            console.error("User not found:", trimmed);
            
            return;
          }
          onSubmit(trimmed);
        }
        else {
            return;
        }
    };

    // Handle user registration
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = username.trim();
        // Check if username is not emptyand doesn't already exist before creating a new user
        if (trimmed) {
          try {
            setError(null);
            await getUser(trimmed);
            
          } catch (e) {
            createUser(trimmed);
            onSubmit(trimmed);
          }
          setError("The user already exists. Please choose a different username.");
          console.error("User already exists:", trimmed);
        }
        else {
            return;
        }
    };

    return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-6">
        <h1 className="text-xl font-bold mb-2">Book Recommender</h1>
        <p className="text-sm text-gray-600 mb-4">
          Choose a username to get personalized book recommendations. If you're new, just enter a username and click "Register".
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-2 rounded bg-black text-black text-sm font-medium"
          >
            Login
          </button>
          <button onClick={handleRegister}
            type="button"
            className="w-full py-2 rounded bg-black text-black text-sm font-medium"
          >
            Register
          </button>
        </form>

        {error && <p className="text-sm text-red-500">{error}</p>}
        <p className="mt-3 text-xs text-gray-500">
          This is a personal project. No real user data is stored. For any questions or feedback, please contact me at <a href="mailto:dikdasmert@gmail.com">dikdasmert@gmail.com</a>
        </p>
      </div>
    </div>
  );
}       