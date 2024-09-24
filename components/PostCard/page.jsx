"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Edit } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/useUserStore";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useLike } from "@/hooks/useLike";

const PostCard = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const router = useRouter();
  const userData = useUserStore((state) => state.userData);
  const { isLiked, likeCount, toggleLike } = useLike(postId);

  useEffect(() => {
    fetchPostDetails();
    fetchCommentCount();
  }, [postId]);

  const fetchPostDetails = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        user:user (
          id,
          username,
          email,
          profile_image_url,
          profile_message
        )
      `
      )
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Error fetching post:", error);
    } else {
      setPost(data);
    }
  };

  const fetchCommentCount = async () => {
    const { count, error } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);

    if (error) {
      console.error("Error fetching comment count:", error);
    } else {
      setCommentCount(count);
    }
  };

  const handleViewDetails = () => {
    router.push(`/posts/${postId}`);
  };

  const handleEditClick = () => {
    router.push(`/posts/write?postId=${postId}`);
  };

  if (!post) return <div>Loading...</div>;

  const truncatedDescription = post.description
    .split("\n")
    .slice(0, 3)
    .join("\n");
  const isDescriptionTruncated = post.description.split("\n").length > 3;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg mb-5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={post.user?.profile_image_url} />
              <AvatarFallback>
                {post.user?.username?.[0] || post.user_email[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">
                {post.user?.username || post.user_email}
              </h3>
              <p className="text-sm text-gray-500">
                작성일 : {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          {userData && userData.email === post.user_email && (
            <Button variant="ghost" size="sm" onClick={handleEditClick}>
              <Edit className="h-5 w-5" />
            </Button>
          )}
        </div>

        <Carousel className="w-full mb-4">
          <CarouselContent>
            {post.image_urls.map((url, index) => (
              <CarouselItem key={index}>
                <img
                  src={url}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-100 object-cover rounded-lg"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={toggleLike}
          >
            <Heart
              className={`w-6 h-6 ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-500"
              }`}
            />
            <span>{likeCount}</span>
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={handleViewDetails}
          >
            <MessageCircle className="w-6 h-6" />
            <span>{commentCount}개의 댓글보기</span>
          </Button>
        </div>

        <p className="text-lg mb-1 whitespace-pre-wrap">
          {truncatedDescription}
        </p>
        {isDescriptionTruncated && (
          <Button variant="link" onClick={handleViewDetails}>
            ... 더보기
          </Button>
        )}

        {post.hashtags && post.hashtags.length > 0 && (
          <div className="mb-1">
            {post.hashtags.map((tag, index) => (
              <span
                key={index}
                className="inline-block rounded-lg px-3 py-1 text-sm font-semibold bg-[#FADFA1] text-[#664343] mr-2 mb-2"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
