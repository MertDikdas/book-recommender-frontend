import { useState } from "react";

interface UsernameScreenProps {
    onSubmit: (username: string) => void;
}

export function UsernameScreen({ onSubmit }: UsernameScreenProps) {
    const [username, setUsername] = useState("");
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = username.trim();
        if (trimmed) {
            onSubmit(trimmed);
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
          Devam etmek için bir kullanıcı adı seç.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Kullanıcı adı (ör. mertdikdas)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-2 rounded bg-black text-white text-sm font-medium"
          >
            Giriş yap
          </button>
        </form>

        <p className="mt-3 text-xs text-gray-500">
          Sadece kullanıcı adı kullanıyoruz, şifre vs yok.
        </p>
      </div>
    </div>
  );
}       