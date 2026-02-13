import { useState } from "react";
import type { Book } from "../types/book";
import { rateBook } from "../api/books";

interface Props {
  book: Book;
  username: string;
  onRatingSubmitted?: () => void;
}

export function BookCard({ book, username, onRatingSubmitted }: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading] = useState(false);

  // When user clicks a star, we optimistically update the UI and then send the rating to the server.
  const handleRateBook = async (rate: number) => {
    setRating(rate);
    
    if (username) {
      try {
        // Optimistically set submitting state to disable further clicks until we get a response
        setIsSubmitting(true);
        await rateBook(username, book.id, rate);
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

  return (
    <div className="border rounded-lg p-3 shadow-sm hover:shadow-md flex gap-3 bg-white">
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
                // When a star is clicked, we call handleRateBook with the corresponding rating value
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
