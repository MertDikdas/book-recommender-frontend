import { useState, useEffect } from "react";
import type { Comment } from "../types/comment";
import { getUserById } from "../api/users";
import type { User } from "../types/user";
import { getBookRating } from "../api/books";

interface CommentCardProps {
  comment: Comment;
}

export function CommentCard({ comment }: CommentCardProps) {
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

  return (
    <div className="border rounded-lg p-3 shadow-sm hover:shadow-md flex gap-3 bg-white relative">
      <div className="flex-1">
        <h3 className="font-semibold text-sm">{user?.username ?? "Unknown user"}</h3>

        <p className="text-xs mt-2 line-clamp-3 text-gray-700">
          {comment.comment_text}
        </p>
      </div>
      <h3 className="font-semibold text-sm">{[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={rating && star <= rating ? "text-yellow-400" : "text-gray-300"}>★</span>
      ))}</h3>
    </div>
  );
}
