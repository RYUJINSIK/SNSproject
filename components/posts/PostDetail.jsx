// components/PostDetail.js
"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import CommentSection from "./CommentSection";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";

export default function PostDetail({ post }) {
  const [isEditing, setIsEditing] = useState(false);
  const userData = useUserStore((state) => state.userData);

  const handleEdit = () => {
    setIsEditing(true);
    // 편집 로직 구현
  };

  const handleDelete = async () => {
    // 삭제 로직 구현
  };

  return (
    <div className="space-y-6">
      <PostCard post={post} isDetailView={true} />

      {userData && userData.email === post.user_email && (
        <div className="flex space-x-4">
          <Button onClick={handleEdit}>Edit</Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}

      <CommentSection postId={post.id} />
    </div>
  );
}
