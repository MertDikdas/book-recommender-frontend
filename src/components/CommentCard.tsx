import { useState, useEffect } from "react";
import type { Comment } from "../types/comment";
import { getUserById } from "../api/users";
import type { User } from "../types/user";
import { deleteComment, getBookRating } from "../api/books";

interface CommentCardProps {
  comment: Comment;
  username: string;
  handleCommentDeleted?:(comment_id:number) => void;
}

export function CommentCard({ comment, username, handleCommentDeleted }: CommentCardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [rating, setRating] = useState<number | null>(0);
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getUserById(comment.user_id);
        const tempRating = await getBookRating(data.username, comment.book_id);
        if (!cancelled) {
            setUser(data);
            setRating(tempRating);
        }
      } catch (e) {
        console.error("getUserById error:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [comment.user_id]);

  const handleDeleteComment = async() =>{
    try{
      deleteComment(comment.id);
      handleCommentDeleted?.(comment.id);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  }

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md bg-white flex justify-between">

      {/* LEFT */}
      <div className="flex-1">
        <h3 className="font-semibold text-sm">
          {user?.username ?? "Unknown user"}
        </h3>

        <p className="text-xs mt-2 text-gray-700">
          {comment.comment_text}
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end min-w-[90px]">

        {/* Rating */}
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-sm ${
                rating && star <= rating
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        {/* Remove en dip */}
        {user?.username === username && (
          <button
            onClick={handleDeleteComment}
            className="mt-4 text-[11px] px-3 py-1 rounded-lg bg-gray-100 text-red-500 hover:bg-gray-200 transition"
          >
            Remove
          </button>
        )}

      </div>
    </div>
  );
}
