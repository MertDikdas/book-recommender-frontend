import { useState, useEffect } from "react";
import type { Comment } from "../types/comment";
import { getUserById } from "../api/users";
import type { User } from "../types/user";
interface CommentCardProps {
  comment: Comment
}

export function CommentCard({comment} : CommentCardProps) {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    (async () => {
        const data = await getUserById(comment.user_id);
        setUser(data);
    })();
  }, [user]);

  return (
    <div className="border rounded-lg p-3 shadow-sm hover:shadow-md flex gap-3 bg-white relative">
      <div className="flex-1">
        <h3 className="font-semibold text-sm">{user?.username}</h3>
        <p className="text-xs text-gray-600">{}</p>
          <p className="text-xs mt-1 text-gray-500">{"1"}</p>
          <p className="text-xs mt-2 line-clamp-3 text-gray-700">
            {comment.comment_text}
          </p>
        
      </div>
    </div>
  );
}
