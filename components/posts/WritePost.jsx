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
import { shallow } from "zustand/shallow";

const WritePost = ({ existingPost = null }) => {
  const [userData, setUserData] = useState({});

  const { userData: storeData } = useUserStore(
    (state) => ({
      userData: state.userData,
    }),
    shallow
  );

  useEffect(() => {
    setUserData(storeData);
  }, [storeData]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { description: existingPost?.description || "" },
  });

  const { images, handleImageChange, removeImage } = useImageUpload(
    existingPost?.images
  );
  const {
    hashtags,
    hashtagInput,
    handleHashtagInputChange,
    handleHashtagInputKeyDown,
    addHashtag,
    removeHashtag,
  } = useHashtags(existingPost?.hashtags);

  const onSubmit = useCallback(
    async (data) => {
      try {
        const imageUrls = await Promise.all(
          images.map(async (image) => {
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
        // TODO: 성공 시 처리 (예: 리다이렉트)
      } catch (error) {
        console.error("Error creating post:", error);
        // TODO: 에러 처리
      }
    },
    [images, hashtags]
  );

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
          onBlur={addHashtag}
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
