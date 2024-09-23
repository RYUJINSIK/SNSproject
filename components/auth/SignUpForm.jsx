"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Mail, Lock, User, MessageSquare } from "lucide-react";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const router = useRouter();
  const fileInputRef = useRef(null);
  const password = watch("password");
  let defaultImage = process.env.NEXT_PUBLIC_DEFAULT_AVATAR_URL;

  const onSubmit = async (data) => {
    try {
      // 닉네임 중복 체크
      const { data: existingUser, error: checkError } = await supabase
        .from("user")
        .select("id")
        .eq("username", data.username)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking username:", checkError);
        throw checkError;
      }

      if (existingUser) {
        setError("이미 사용 중인 닉네임입니다.");
        return;
      }

      let profileImageUrl = defaultImage; // 기본 이미지 URL로 초기화

      if (fileInputRef.current && fileInputRef.current.files[0]) {
        const file = fileInputRef.current.files[0];
        const filePath = `public/profileImages/${data.username}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("ImageBucket")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
          error: urlError,
        } = supabase.storage.from("ImageBucket").getPublicUrl(filePath);

        if (urlError) throw urlError;

        profileImageUrl = publicUrl; // 업로드된 이미지 URL로 업데이트
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            profile_image_url: profileImageUrl, // 항상 값이 있음 (기본 이미지 또는 업로드된 이미지)
            profile_message: data.profile_message,
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("이미 등록된 이메일입니다.");
        } else {
          throw authError;
        }
        return;
      }

      router.push("/login");
    } catch (error) {
      console.error("Error in onSubmit:", error);
      setError(error.message);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const validatePassword = (value) => {
    if (value.length < 8) return "비밀번호는 최소 8자 이상이어야 합니다.";
    let typeCount = 0;
    if (/[A-Z]/.test(value)) typeCount++;
    if (/[a-z]/.test(value)) typeCount++;
    if (/[0-9]/.test(value)) typeCount++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) typeCount++;
    if (typeCount < 3)
      return "비밀번호는 영어 대문자, 소문자, 숫자, 특수문자 중 3종류 이상을 포함해야 합니다.";
    return true;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center">
          <Logo className="text-[#91684A]" fontSize="text-5xl" />
          <p className="font-goryeong text-[#91684A] mt-2 text-center text-2xl">
            회원가입
          </p>
        </div>
        <div className="flex items-center justify-center mt-2">
          <div
            className="w-40 h-40 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center cursor-pointer"
            onClick={handleImageClick}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile Preview"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div
                className="w-full h-full bg-cover bg-center rounded-full relative"
                style={{ backgroundImage: `url(${defaultImage})` }}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <span className="text-white text-sm font-medium">
                    프로필 사진 선택
                  </span>
                </div>
              </div>
            )}
          </div>
          <Input
            id="profileImage"
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 이메일 입력 필드 */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="email"
                type="email"
                {...register("email", { required: "이메일을 입력해주세요." })}
                className="pl-10"
                placeholder="example@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* 비밀번호 입력 필드 */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "비밀번호를 입력해주세요.",
                  validate: validatePassword,
                })}
                className="pl-10"
                placeholder="********"
              />
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* 비밀번호 확인 필드 */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호 확인
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  required: "비밀번호 확인을 입력해주세요.",
                  validate: (value) =>
                    value === password || "비밀번호가 일치하지 않습니다.",
                })}
                className="pl-10"
                placeholder="********"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* 닉네임 입력 필드 */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              닉네임
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="username"
                type="text"
                {...register("username", {
                  required: "닉네임을 입력해주세요.",
                  minLength: {
                    value: 2,
                    message: "닉네임은 최소 2자 이상이어야 합니다.",
                  },
                  maxLength: {
                    value: 20,
                    message: "닉네임은 최대 20자까지 가능합니다.",
                  },
                })}
                className="pl-10"
                placeholder="닉네임"
              />
            </div>
            {errors.username && (
              <p className="mt-2 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* 프로필 메시지 입력 필드 */}
          <div>
            <label
              htmlFor="profile_message"
              className="block text-sm font-medium text-gray-700"
            >
              프로필 메시지
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
              <Textarea
                id="profile_message"
                {...register("profile_message")}
                className="pl-10"
                placeholder="자신을 소개해주세요"
                rows={3}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full flex justify-center bg-[#91684A] hover:bg-[#7D5A3C] "
          >
            <UserPlus className="h-5 w-5 mr-2" />
            회원가입
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="font-medium text-[#91684A] hover:text-[#7D5A3C]"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
