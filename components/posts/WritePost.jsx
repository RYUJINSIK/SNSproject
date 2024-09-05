"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import useImageUpload from "@/hooks/useImageUpload";
import useHashtags from "@/hooks/useHashtags";
import ImagePreview from "./ImagePreview";
import { useUserStore } from "@/store/useUserStore";
import { supabase } from "@/lib/supabase";

const WritePost = ({ existingPost = null }) => {
  const userData = useUserStore((state) => state.userData);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { images, handleImageChange, removeImage } = useImageUpload(
    existingPost?.images
  );

  const {
    hashtags,
    hashtagInput,
    setHashtagInput,
    handleHashtagInputChange,
    handleHashtagInputKeyDown,
    addHashtag,
    removeHashtag,
  } = useHashtags(existingPost?.hashtags);

  useEffect(() => {
    if (existingPost) {
      setValue("description", existingPost.description);
    }
  }, [existingPost, setValue]);

  const onSubmit = async (data) => {
    console.log("userData ? : ", userData);
    try {
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const filePath = `public/postImages/${Date.now()}_${image.name}`;
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

      const { data: post, error } = await supabase
        .from("posts")
        .insert({
          user_email: userData.email,
          description: data.description,
          image_urls: imageUrls,
          hashtags,
        })
        .single();

      if (error) throw error;

      console.log("Post created:", post);
      // 성공 메시지 표시 또는 리디렉션 처리
    } catch (error) {
      console.error("Error creating post:", error);
      // 에러 메시지 표시
    }
  };

  const handleHashtagBlur = useCallback(() => {
    addHashtag();
  }, [addHashtag]);

  const fileInputRef = useRef(null);
  const handleFileButtonClick = useCallback(() => {
    fileInputRef.current.click();
  }, []);

  const memoizedImages = useMemo(
    () =>
      images.map((image, index) => (
        <ImagePreview
          key={index}
          image={typeof image === "string" ? image : URL.createObjectURL(image)}
          index={index}
          removeImage={removeImage}
        />
      )),
    [images, removeImage]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button type="button" onClick={handleFileButtonClick}>
          이미지 선택
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden"
        />
        <span>{images.length}/5 파일 선택됨</span>
        <span className="text-sm text-gray-500">
          (이미지 파일만 가능, 최대 5개)
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">{memoizedImages}</div>

      <Textarea
        placeholder="게시글 내용을 입력하세요"
        {...register("description", { required: true })}
      />
      {errors.description && (
        <span className="text-red-500">이 필드는 필수입니다.</span>
      )}

      <div>
        <Input
          type="text"
          placeholder="#해시태그 입력 후 Enter"
          value={hashtagInput}
          onChange={handleHashtagInputChange}
          onKeyDown={handleHashtagInputKeyDown}
          onBlur={handleHashtagBlur}
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

      <Button type="submit">
        {existingPost ? "게시글 수정" : "게시글 등록"}
      </Button>
    </form>
  );
};

export default React.memo(WritePost);
