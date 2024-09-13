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

      let profileImageUrl = null;
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

        profileImageUrl = publicUrl;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            profile_image_url: profileImageUrl,
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <Logo className="text-[#91684A]" fontSize="text-5xl" />
          <p className="font-goryeong text-[#91684A] mt-2 text-center text-2xl">
            회원가입
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-center">
            <div
              className="w-40 h-40 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center cursor-pointer"
              onClick={handleImageClick}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">프로필 사진</span>
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
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                이메일
              </label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: "이메일을 입력해주세요." })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#91684A] focus:border-[#91684A] focus:z-10 sm:text-sm"
                placeholder="이메일"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "비밀번호를 입력해주세요.",
                  validate: validatePassword,
                })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#91684A] focus:border-[#91684A] focus:z-10 sm:text-sm"
                placeholder="비밀번호"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                비밀번호 확인
              </label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  required: "비밀번호를 다시 입력해주세요.",
                  validate: (value) =>
                    value === password || "비밀번호가 일치하지 않습니다.",
                })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#91684A] focus:border-[#91684A] focus:z-10 sm:text-sm"
                placeholder="비밀번호 확인"
              />
            </div>
            <div>
              <label htmlFor="username" className="sr-only">
                닉네임
              </label>
              <Input
                id="username"
                {...register("username", {
                  required: "닉네임을 입력해주세요.",
                })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#91684A] focus:border-[#91684A] focus:z-10 sm:text-sm"
                placeholder="닉네임"
              />
            </div>
            <div>
              <label htmlFor="profile_message" className="sr-only">
                프로필 메시지
              </label>
              <Textarea
                id="profile_message"
                {...register("profile_message", {
                  maxLength: {
                    value: 50,
                    message: "프로필 메시지는 50자를 초과할 수 없습니다.",
                  },
                })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#91684A] focus:border-[#91684A] focus:z-10 sm:text-sm"
                placeholder="프로필 메시지 (최대 50자)"
              />
            </div>
          </div>

          {errors.email && (
            <p className="text-red-500 text-xs italic">
              {errors.email.message}
            </p>
          )}
          {errors.password && (
            <p className="text-red-500 text-xs italic">
              {errors.password.message}
            </p>
          )}
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs italic">
              {errors.confirmPassword.message}
            </p>
          )}
          {errors.username && (
            <p className="text-red-500 text-xs italic">
              {errors.username.message}
            </p>
          )}
          {errors.profile_message && (
            <p className="text-red-500 text-xs italic">
              {errors.profile_message.message}
            </p>
          )}

          {error && <p className="mt-2 text-center text-red-600">{error}</p>}

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#91684A] hover:bg-[#7D5A3C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#91684A]"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus
                  className="h-5 w-5 text-[#7D5A3C] group-hover:text-[#91684A]"
                  aria-hidden="true"
                />
              </span>
              회원가입
            </Button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
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
    </div>
  );
}
