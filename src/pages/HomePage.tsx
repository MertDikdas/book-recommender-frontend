import { useEffect, useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { BookCard } from "../components/BookCard";
import { getRecommendationsForUser, searchBooks, getUserBooks, getRecommendationsForUserByGenre} from "../api/books";
import type { Book } from "../types/book";
import { deleteUser, getUserGenres } from "../api/users";
import { PageChanger } from "../components/PageChanger";

interface HomePageProps {
  username: string;
  onLogout: () => void;
}

export function HomePage({ username, onLogout }: HomePageProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState("1");
  const [currentPage, setCurrentPage] = useState<string | "1">("1");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"recommendations" | "search" | "my-books">(
    "recommendations"
  );
  const [userGenres, setUserGenres] = useState<string[]>([]);
  const [showGenreFilter, setShowGenreFilter] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentGenre, setCurrentGenre] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        if(currentGenre) {
          const data = await getRecommendationsForUserByGenre(username, currentGenre, parseInt(currentPage));
          setBooks(data);
        }
        else {
          const data = await getRecommendationsForUser(username, parseInt(currentPage));
          setBooks(data);
        }


      } catch (e) {
        console.error(e);
        setError("The recommendations could not be loaded.");
      } finally {
        setLoading(false);
      }
    })();
  }, [username, currentPage]);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setMode("recommendations");
      return;
    }
    setShowGenreFilter(false);
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

  const handlePageChange = async (p_number: string) => {
    if (mode === "recommendations") {
      try {
        setLoading(true);
        setError(null);
        
        setPage(p_number.toString());
        setCurrentPage(p_number.toString());
        if(currentGenre) {
          const data = await getRecommendationsForUserByGenre(username, currentGenre, parseInt(p_number));
          setBooks(data);
        }
        else {
          const data = await getRecommendationsForUser(username, parseInt(p_number));
          setBooks(data);
        }
      } catch (e) {
        console.error(e);
        setError("The recommendations could not be loaded.");
      } finally {
        setLoading(false);
      }
    }
  };

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
            setShowGenreFilter(false);
            try {
              setCurrentGenre(null);
              setLoading(true);
              setError(null);
              const data = await getUserBooks(username);
              setBooks(data);
              setMode("my-books");
              setLoading(false);
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
              setCurrentGenre(null);
              if(!currentPage)
              {
                setCurrentPage("1");
              }
              const data = await getRecommendationsForUser(username, parseInt(currentPage));
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
        {mode === "recommendations" && <button 
          onClick={async () => {
          try {
                const genres = await getUserGenres(username);
                setUserGenres(genres); 
                if (!showGenreFilter) {
                  setShowGenreFilter(true);
                } else {
                  setShowGenreFilter(false);
                }
              } catch (e) {
                console.error(e);
                setError("The user's genres could not be loaded.");
              }
          }}
          className="text-sm px-3 py-1 rounded-lg border border-gray-300 
  hover:bg-gray-100 transition duration-200
  "
        >
          Filter
        </button>}
        {mode === "recommendations" && <PageChanger
          value={page}
          onChange={setPage}
          onSubmit={() => {
              if (!page?.trim() || isNaN(parseInt(page))){}
              else{
                handlePageChange(page);
              }
            }}
        />}
        { mode === "recommendations" && !loading && !error &&
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold">
            Page : {currentPage}
          </h2>
        </div>}
        {showGenreFilter && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {userGenres.map((genre) => (
              <button
              key={genre}
              onClick={() => {
                setLoading(true);
                setCurrentGenre(genre);

                getRecommendationsForUserByGenre(username, genre, parseInt(currentPage))
                  .then(setBooks)
                  .catch((e) => {
                    console.error(e);
                    setError("Failed to load recommendations for the selected genre.");
                  })
                  .finally(() => setLoading(false));
              }}
              className={`text-xs px-3 py-1 rounded-full border transition
                ${
                  currentGenre === genre
                    ? "bg-blue-600 text-black border-blue-600"
                    : "border-blue-400 text-blue-600 hover:bg-blue-100"
                }
              `}
            >
              {genre}
            </button>
            ))}
          </div>
        )}
        <div className="mt-3 grid gap-3">
          {books.map((b) => (
            <BookCard key={b.id ?? b.title} book={b} username={username} onBookRemoved={handleBookRemoved} bookCardType={mode === "my-books" ? "my-book" : "other-book"} />
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
