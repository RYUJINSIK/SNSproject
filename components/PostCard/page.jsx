"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

const PostCard = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [newComment, setNewComment] = useState("");

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
      console.log(data);
      setPost(data);
    }
  };

  const fetchComments = async () => {
    setComments([
      { id: 1, user_name: "User1", user_avatar: null, content: "Great post!" },
      { id: 2, user_name: "User2", user_avatar: null, content: "I love this!" },
    ]);
  };

  const checkLikeStatus = async () => {
    setIsLiked(false);
    setLikeCount(10);
  };

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    console.log("New comment:", newComment);
    setNewComment("");
  };

  if (!post) return <div>Loading...</div>;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="w-12 h-12">
            {/* <AvatarImage src={post.user.avatar_url} /> */}
            <AvatarFallback>{post.user_email}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{post.user_email}</h3>
            <p className="text-sm text-gray-500">
              Posted on {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Carousel className="w-full mb-4">
          <CarouselContent>
            {post.image_urls.map((url, index) => (
              <CarouselItem key={index}>
                <img
                  src={url}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-80 object-cover rounded-lg"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="flex items-center justify-between mb-4">
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
          <Button variant="ghost" className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            <span>{comments.length} comments</span>
          </Button>
        </div>

        <p className="text-lg mb-4">{post.description}</p>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Comments</h3>
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={comment.user_avatar} />
                <AvatarFallback>{comment.user_name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{comment.user_name}</p>
                <p className="text-gray-600">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleCommentSubmit} className="w-full flex space-x-2">
          <Input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
