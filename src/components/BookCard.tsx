import { useState, useEffect } from "react";
import type { Book } from "../types/book";
import { rateBook, getBookRating, getUserBooks, deleteUserBook } from "../api/books";

interface Props {
  book: Book;
  username: string;
  onRatingSubmitted?: () => void;
  onBookRemoved?: (bookId: number) => void;
}

export function BookCard({ book, username, onRatingSubmitted, onBookRemoved }: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load user's existing rating for this book when component mounts or when username/book changes
  useEffect(() => {
    const loadRating = async () => {
      try {
        setIsLoading(true);
        // Check if user has rated this book before by fetching user's books and their ratings
        const userBooks = await getUserBooks(username);
        // If the book is in user's books, fetch its rating
        if(userBooks.some(b => b.id === book.id)) {
          const userRating = await getBookRating(username, book.id);
          if (userRating) {
            // If user has rated before, set the rating state to that value
            setRating(userRating);
          }
        }
      } catch (error) {
        console.error("Error loading rating:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRating();
  }, [username, book.id]);

  // Handle rating submission
  const handleRateBook = async (rate: number) => {
    setRating(rate);
    // Only submit if user is logged in
    if (username) {
      try {
        setIsSubmitting(true);
        if (rating === rate) {
          // If user clicks the same rating again, it means they want to remove their rating
          await rateBook(username, book.id, 0); // Assuming 0 means "no rating"
          setRating(null);
          onRatingSubmitted?.();
          return;
        }
        // Call API to save the rating for this book and user
        await rateBook(username, book.id, rate);
        // Show a temporary "Saved" message after successful submission
        setSubmitted(true);
        onRatingSubmitted?.();
        // Reset after 2 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 2000);
      } catch (error) {
        console.error("Error submitting rating:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handle book deletion from user's list
  const handleDeleteBook = async () => {
    try {
      setIsSubmitting(true);
      await deleteUserBook(username, book.id); // Assuming this also removes the book from user's list
      setRating(null);
      onBookRemoved?.(book.id); // Notify parent to remove this book from the UI
    } catch (error) {
      console.error("Error deleting book:", error);
    } finally {
      setIsSubmitting(false);
    }
  };  

  return (
    <div className="border rounded-lg p-3 shadow-sm hover:shadow-md flex gap-3 bg-white relative">
      <button
        onClick={() => handleRateBook(0)}
        className="absolute top-2 right-15 text-gray-400 hover:text-gray-600 transition-colors"
        title="Add to my books"
      >
        +
      </button>
      <button
        onClick={() => handleDeleteBook()}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        title="Remove from list"
      >
        ✕
      </button>
      {book.cover_url && (
        <img
          src={book.cover_url}
          alt={book.title}
          className="w-16 h-24 object-cover rounded"
        />
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-sm">{book.title}</h3>
        <p className="text-xs text-gray-600">{book.author}</p>
        {book.genre && (
          <p className="text-xs mt-1 text-gray-500">{book.genre}</p>
        )}
        {book.description && (
          <p className="text-xs mt-2 line-clamp-3 text-gray-700">
            {book.description}
          </p>
        )}
        
        {/* Rating Section */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Rate:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRateBook(star)}
                disabled={isSubmitting || isLoading}
                className={`text-xl transition-transform ${
                  rating && star <= rating
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-yellow-300"
                } ${isSubmitting || isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110"}`}
              >
                ★
              </button>
            ))}
          </div>
          {submitted && (
            <span className="text-xs text-green-600 font-medium">✓ Saved</span>
          )}
        </div>
      </div>
    </div>
  );
}
