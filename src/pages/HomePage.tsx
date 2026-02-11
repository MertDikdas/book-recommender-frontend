import { useEffect, useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { BookCard } from "../components/BookCard";
import { getRecommendationsForUser, searchBooks } from "../api/books";
import type { Book } from "../types/book";

interface HomePageProps {
  username: string;
  onLogout: () => void;
}

export function HomePage({ username, onLogout }: HomePageProps) {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"recommendations" | "search">(
    "recommendations"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRecommendationsForUser(username);
        setBooks(data);
      } catch (e) {
        console.error(e);
        setError("Öneriler yüklenirken bir hata oldu.");
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setMode("recommendations");
      // istersen burada tekrar öneri çekebilirsin
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMode("search");
      const data = await searchBooks(trimmed);
      setBooks(data);
    } catch (e) {
      console.error("SEARCH ERROR:", e);
      setError("Arama sırasında bir hata oldu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-4xl mx-auto p-4">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Book Recommender</h1>
            <p className="text-sm text-gray-600">
              Senin zevkine göre kitap öneren küçük asistanın 📚
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Giriş yapılan kullanıcı: <span className="font-semibold">{username}</span>
            </p>
          </div>
          <button
            onClick={onLogout}
            className="text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-200"
          >
            Kullanıcı değiştir
          </button>
        </header>

      <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={handleSearch}
        />

        {/* Başlık: öneri mi arama mı? */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold">
            {mode === "recommendations"
              ? "Senin için önerilen kitaplar"
              : `"${query}" için arama sonuçları`}
          </h2>
        </div>

        {/* Loading / Error / Sonuçlar */}
        {loading && <p className="text-sm text-gray-500">Yükleniyor...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="mt-3 grid gap-3">
          {books.map((b) => (
            <BookCard key={b.id ?? b.title} book={b} />
          ))}

          {!loading && books.length === 0 && !error && (
            <p className="text-sm text-gray-500">
              Gösterilecek kitap bulunamadı.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
