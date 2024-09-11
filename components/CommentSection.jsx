"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/store/useUserStore";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const userData = useUserStore((state) => state.userData);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) console.error("Error fetching comments:", error);
    else setComments(data);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_email: userData.email,
        content: newComment,
      })
      .single();

    if (error) console.error("Error adding comment:", error);
    else {
      setComments([...comments, data]);
      setNewComment("");
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="mb-4 p-3 bg-gray-100 rounded">
          <p className="font-semibold">{comment.user_email}</p>
          <p>{comment.content}</p>
        </div>
      ))}
      {userData && (
        <form onSubmit={handleSubmitComment} className="mt-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="mb-2"
          />
          <Button type="submit">Post Comment</Button>
        </form>
      )}
    </div>
  );
}
