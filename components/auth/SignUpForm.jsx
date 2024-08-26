"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState(null);
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      // 1. 회원가입
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      // 2. 프로필 이미지 업로드
      let profileImageUrl = null;
      if (data.profileImage && data.profileImage[0]) {
        const file = data.profileImage[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("profiles")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // 업로드된 이미지의 public URL 가져오기
        const {
          data: { publicUrl },
          error: urlError,
        } = supabase.storage.from("profiles").getPublicUrl(fileName);

        if (urlError) throw urlError;

        profileImageUrl = publicUrl;
      }

      // 3. 사용자 정보를 데이터베이스에 저장
      const { error: insertError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: data.email,
        username: data.username,
        profile_picture_url: profileImageUrl,
        bio: data.bio,
      });

      if (insertError) throw insertError;

      // 성공 시 로그인 페이지로 리다이렉트
      router.push("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email", { required: true })} placeholder="Email" />
      <input
        type="password"
        {...register("password", { required: true })}
        placeholder="Password"
      />
      <input
        {...register("username", { required: true })}
        placeholder="Username"
      />
      <input {...register("bio")} placeholder="Bio" />
      <input type="file" {...register("profileImage")} accept="image/*" />
      <button type="submit">Sign Up</button>
      {error && <p>{error}</p>}
    </form>
  );
}
