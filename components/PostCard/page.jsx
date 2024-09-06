"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react"; // 좋아요 아이콘을 위해 lucide-react 사용
import { supabase } from "@/lib/supabase"; // Supabase 클라이언트

const PostCard = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetchPostDetails();
    fetchComments();
    checkLikeStatus();
  }, [postId]);

  const fetchPostDetails = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Error fetching post:", error);
    } else {
      setPost(data);
    }
  };

  const fetchComments = async () => {
    // 댓글 가져오기 로직 구현
  };

  const checkLikeStatus = async () => {
    // 좋아요 상태 확인 로직 구현
  };

  const handleLike = async () => {
    // 좋아요 토글 로직 구현
  };

  if (!post) return <div>Loading...</div>;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <Carousel className="w-full max-w-xl mx-auto">
          <CarouselContent>
            {post.image_urls.map((url, index) => (
              <CarouselItem key={index}>
                <img
                  src={url}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={handleLike}
          >
            <Heart
              className={`w-6 h-6 ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-500"
              }`}
            />
            <span>{likeCount} likes</span>
          </Button>
        </div>

        <div className="mt-4">
          <p className="text-lg">{post.description}</p>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Comments</h3>
          {comments.map((comment, index) => (
            <div key={index} className="flex items-start gap-3 mb-3">
              <Avatar>
                <AvatarImage src={comment.user_avatar} />
                <AvatarFallback>{comment.user_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{comment.user_name}</p>
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>{/* 댓글 입력 폼 구현 */}</CardFooter>
    </Card>
  );
};

export default PostCard;
