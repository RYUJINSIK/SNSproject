"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Edit, Trash2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { useLike } from "@/hooks/useLike";

const PostDetail = ({ post }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const router = useRouter();
  const userData = useUserStore((state) => state.userData);
  const { isLiked, likeCount, toggleLike } = useLike(post.id);

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*, user:user(username, profile_image_url)")
      .eq("post_id", post.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setComments(data);
    }
  };

  const handleCommentSubmit = async (e) => {
    console.log("??", userData);
    e.preventDefault();
    if (!newComment.trim() || !userData) return;

    const { data, error } = await supabase
      .from("comments")
      .insert({
        content: newComment,
        post_id: post.id,
        user_email: userData.email,
      })
      .select("*, user:user(username, profile_image_url)")
      .single();

    if (error) {
      console.error("Error submitting comment:", error);
    } else {
      setComments([data, ...comments]);
      setNewComment("");
    }
  };

  const handleEdit = () => {
    router.push(`/posts/write?postId=${post.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const { error } = await supabase.from("posts").delete().eq("id", post.id);
      if (error) {
        console.error("Error deleting post:", error);
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-6xl shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={post.user.profile_image_url}
                    alt={post.user.username}
                  />
                  <AvatarFallback>{post.user.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {post.user.username}
                  </h3>
                  <p className="text-sm text-gray-500">
                    작성일: {new Date(post.created_at).toLocaleDateString()}
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
                        className="w-full h-auto object-cover rounded-lg"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            <div className="md:w-1/2">
              {userData && userData.id === post.user_id && (
                <div className="flex justify-end mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="mr-2"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDelete}>
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              )}

              <p className="text-lg mb-4 whitespace-pre-wrap">
                {post.description}
              </p>

              {post.hashtags && post.hashtags.length > 0 && (
                <div className="mb-4">
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

              <div className="flex items-center space-x-4 mb-4">
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
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  <span>{comments.length}</span>
                </div>
              </div>

              <div className="space-y-4 mb-4 h-60 overflow-y-auto">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start space-x-3 border-b pb-2"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={comment.user?.profile_image_url}
                        alt={comment.user?.username}
                      />
                      <AvatarFallback>
                        {comment.user?.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {comment.user?.username}
                      </p>
                      <p className="text-sm">{comment.content}</p>
                      <p className="text-[0.7rem] text-gray-500">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleCommentSubmit} className="flex space-x-2">
                <Input
                  type="text"
                  placeholder={
                    comments.length === 0
                      ? "첫 댓글을 남겨주세요"
                      : "댓글을 입력하세요"
                  }
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit">
                  <MessageCircle className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetail;
