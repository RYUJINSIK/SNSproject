import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/useUserStore";

export const useLike = (postId) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const userData = useUserStore((state) => state.userData);

  useEffect(() => {
    fetchLikeStatus();
    fetchLikeCount();
  }, [postId, userData]);

  const fetchLikeStatus = async () => {
    if (!userData) return;

    const { data, error } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_email", userData.email)
      .single();

    if (error) {
      console.error("Error fetching like status:", error);
      return;
    }

    setIsLiked(!!data);
  };

  const fetchLikeCount = async () => {
    const { count, error } = await supabase
      .from("likes")
      .select("id", { count: "exact" })
      .eq("post_id", postId);

    if (error) {
      console.error("Error fetching like count:", error);
      return;
    }

    setLikeCount(count);
  };

  const toggleLike = async () => {
    if (!userData) return;

    // Optimistic update
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      if (isLiked) {
        await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_email", userData.email);
      } else {
        await supabase
          .from("likes")
          .insert({ post_id: postId, user_email: userData.email });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert optimistic update if there's an error
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  };

  return { isLiked, likeCount, toggleLike };
};
