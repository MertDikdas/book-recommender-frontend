import { useEffect, useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { BookCard } from "../components/BookCard";
import { getRecommendationsForUser, searchBooks, getUserBooks} from "../api/books";
import type { Book } from "../types/book";
import { deleteUser } from "../api/users";

interface HomePageProps {
  username: string;
  onLogout: () => void;
}

export function HomePage({ username, onLogout }: HomePageProps) {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"recommendations" | "search" | "my-books">(
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
        setError("The recommendations could not be loaded.");
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setMode("recommendations");
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
      setError("An error occurred while searching for books.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookRemoved = (bookId: number) => {
    setBooks((prevBooks) => prevBooks.filter((b) => b.id !== bookId));
  };

  const handleUserDelete = async () => {
    try {
      await deleteUser(username);
      onLogout();
    } catch (e) {
      console.error("USER DELETE ERROR:", e);
      setError("An error occurred while deleting the user.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-4xl mx-auto p-4">
        <button
          onClick={onLogout}
          className="text-xs px-1 py-1 rounded border border-gray-300 hover:bg-gray-200"
        >
          Change User
        </button>
        <button
          onClick={handleUserDelete}
          className="text-xs px-5 py-1 rounded border border-gray-300 hover:bg-gray-200"
        >
          Delete Account
        </button>
        <header className="mb-6 flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold mb-1">Book Recommender</h1>
            <p className="text-sm text-gray-600">
              An Assitant For Your Book Taste📚
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Current User : <span className="font-semibold">{username}</span>
            </p>
          </div>
          
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
              ? "Recommendations for you"
              : mode === "my-books"
              ? "My Books"
              : `"${query}" search results`}
          </h2>
        </div>

        {/* Loading / Error / Sonuçlar */}
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          onClick={async () => {
            try {
              const data = await getUserBooks(username);
              setBooks(data);
              setMode("my-books");
            } catch (e) {
              console.error(e);
              setError("The user's books could not be loaded.");
            }
          }}
          className="text-sm px-3 py-1 rounded-lg border border-gray-300 
  hover:bg-gray-100 transition duration-200
  "
        >
          My Books
        </button>
        <button
          onClick={async () => {
            try {
              setLoading(true);
              setError(null);
              setMode("recommendations");
              const data = await getRecommendationsForUser(username);
              setBooks(data);
            } catch (e) {
              console.error(e);
              setError("The recommendations could not be loaded.");
            } finally {
              setLoading(false);
            }
          }}
          className="text-sm px-3 py-1 rounded-lg border border-gray-300 
  hover:bg-gray-100 transition duration-200
  "
        >
          Recommendations For Me
        </button>
        <div className="mt-3 grid gap-3">
          {books.map((b) => (
            <BookCard key={b.id ?? b.title} book={b} username={username} onBookRemoved={handleBookRemoved} />
          ))}

          {!loading && books.length === 0 && !error && (
            <p className="text-sm text-gray-500">
              No books found for the given query.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
