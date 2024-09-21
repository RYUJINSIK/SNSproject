"use client";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import useImageUpload from "@/hooks/useImageUpload";
import useHashtags from "@/hooks/useHashtags";
import ImagePreview from "./ImagePreview";
import { useUserStore } from "@/store/useUserStore";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const WritePost = ({ postId = null }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const userData = useUserStore((state) => state.userData);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { images, setImages, handleImageChange, removeImage } =
    useImageUpload();
  const {
    hashtags,
    setHashtags,
    hashtagInput,
    handleHashtagInputChange,
    handleHashtagInputKeyDown,
    addHashtag,
    removeHashtag,
  } = useHashtags();

  const fetchPostData = useCallback(async () => {
    if (!postId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error) throw error;

      setValue("description", data.description);
      setImages(data.image_urls.map((url) => ({ url })));
      setHashtags(data.hashtags || []);
    } catch (error) {
      console.error("Error fetching post data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [postId, setValue, setImages, setHashtags]);

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  const onSubmit = useCallback(
    async (data) => {
      if (!userData) {
        console.error("User data is not available");
        return;
      }

      setIsLoading(true);
      try {
        let imageUrls = images.map((img) => img.url || img);

        // Upload new images
        const newImages = images.filter(
          (img) => !(typeof img === "string" || img.url)
        );
        const newImageUrls = await Promise.all(
          newImages.map(async (image) => {
            const safeFileName = image.name
              .replace(/\s+/g, "_")
              .replace(/[^a-zA-Z0-9._]/g, "");
            const filePath = `public/postImages/${Date.now()}_${safeFileName}`;
            const { data, error } = await supabase.storage
              .from("ImageBucket")
              .upload(filePath, image);
            if (error) throw error;
            const {
              data: { publicUrl },
            } = supabase.storage.from("ImageBucket").getPublicUrl(filePath);
            return publicUrl;
          })
        );

        imageUrls = [
          ...imageUrls.filter((url) => typeof url === "string"),
          ...newImageUrls,
        ];

        const postData = {
          user_email: userData.email,
          description: data.description,
          image_urls: imageUrls,
          hashtags,
        };

        let result;
        if (postId) {
          result = await supabase
            .from("posts")
            .update(postData)
            .eq("id", postId);
        } else {
          result = await supabase.from("posts").insert(postData).single();
        }

        if (result.error) throw result.error;
        console.log(postId ? "Post updated:" : "Post created:", result.data);
        router.push("/");
      } catch (error) {
        console.error("Error saving post:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [images, hashtags, userData, postId, router]
  );

  const memoizedImages = useMemo(
    () =>
      images.map((image, index) => (
        <ImagePreview
          key={index}
          image={
            image.url ||
            (typeof image === "string" ? image : URL.createObjectURL(image))
          }
          index={index}
          removeImage={removeImage}
        />
      )),
    [images, removeImage]
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button
          type="button"
          onClick={() => document.getElementById("file-input").click()}
        >
          이미지 선택
        </Button>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden"
        />
        <span>{images.length}/5 파일 선택됨</span>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">{memoizedImages}</div>

      <Textarea
        placeholder="게시글 내용을 입력하세요"
        {...register("description", { required: "이 필드는 필수입니다." })}
      />
      {errors.description && (
        <span className="text-red-500">{errors.description.message}</span>
      )}

      <div>
        <Input
          type="text"
          placeholder="#해시태그 입력 후 Enter"
          value={hashtagInput}
          onChange={handleHashtagInputChange}
          onKeyDown={handleHashtagInputKeyDown}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {hashtags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeHashtag(tag)}
                className="ml-1 text-red-500 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {postId ? "게시글 수정" : "게시글 등록"}
      </Button>
    </form>
  );
};

export default React.memo(WritePost);
