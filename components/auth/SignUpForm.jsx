"use client";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    <Card className="w-full max-w-md mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            <div
              className="w-36 h-36 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center cursor-pointer"
              onClick={handleImageClick}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">Click to add</span>
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

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password", {
                required: "비밀번호는 필수입니다.",
                validate: validatePassword,
              })}
              placeholder="비밀번호 입력"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", {
                required: "비밀번호를 다시 입력해주세요.",
                validate: (value) =>
                  value === password || "비밀번호가 일치하지 않습니다.",
              })}
              placeholder="비밀번호 확인"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              {...register("username", { required: "Username is required" })}
              placeholder="Choose a username"
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile_message">Profile Message</Label>
            <Textarea
              id="profile_message"
              {...register("profile_message", {
                maxLength: {
                  value: 50,
                  message: "프로필 메시지는 50자를 초과할 수 없습니다.",
                },
              })}
              placeholder="자기소개를 입력하세요 (최대 50자)"
              className="h-24"
            />
            {errors.profile_message && (
              <p className="text-sm text-red-500">
                {errors.profile_message.message}
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
