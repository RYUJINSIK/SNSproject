import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/useUserStore";

export const useComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userData = useUserStore((state) => state.userData);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("*, user:user(username, profile_image_url)")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setComments(data);
    }
    setIsLoading(false);
  };

  const addComment = async (content) => {
    if (!userData) return;

    const { data, error } = await supabase
      .from("comments")
      .insert({ post_id: postId, user_email: userData.email, content })
      .select("*, user:user(username, profile_image_url)")
      .single();

    if (error) {
      console.error("Error adding comment:", error);
    } else {
      setComments((prev) => [data, ...prev]);
    }
  };

  return { comments, isLoading, addComment };
};
