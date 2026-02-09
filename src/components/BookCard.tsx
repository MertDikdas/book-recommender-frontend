import type { Book } from "../types/book";

interface Props {
  book: Book;
}

export function BookCard({ book }: Props) {
  return (
    <div className="border rounded-lg p-3 shadow-sm hover:shadow-md cursor-pointer flex gap-3 bg-white">
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
      </div>
    </div>
  );
}
