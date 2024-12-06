"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/useUserStore";
import Cookies from "js-cookie";
import Logo from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, UserPlus } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState(null);
  const router = useRouter();

  const setToken = useUserStore((state) => state.setToken);
  const setUserData = useUserStore((state) => state.setUserData);

  const onSubmit = async (formData) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      if (error.message === "Invalid login credentials")
        setError("등록되지 않은 이메일 혹은 비밀번호를 잘못 입력했습니다.");
    } else {
      setToken(data.session.access_token);
      setUserData(data.user.user_metadata);

      console.log("data ?  : ", data);

      // 쿠키에 토큰 저장 (7일 유효)
      Cookies.set("auth_token", data.session.access_token, { expires: 7 });
      console.log("token ? : ", data.session.access_token);
      console.log("userData ? : ", data.user.user_metadata);

      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <Logo className="text-[#91684A]" fontSize="text-5xl" />
        </div>
        <form className="mt-1 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#91684A] focus:border-[#91684A] focus:z-10 sm:text-sm"
                placeholder="비밀번호"
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

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#91684A] hover:bg-[#7D5A3C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#91684A]"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Lock
                  className="h-5 w-5 text-[#7D5A3C] group-hover:text-[#91684A]"
                  aria-hidden="true"
                />
              </span>
              로그인
            </Button>
          </div>
        </form>
        {error && <p className="mt-2 text-center text-red-600">{error}</p>}
        <div className="mt-4">
          <div className="text-center mb-2">
            <p className="text-sm text-gray-600 mb-1">
              아직 계정이 없으신가요 ?
            </p>
          </div>
          <Link href="/signup" passHref>
            <Button
              type="button"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#91684A] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#91684A] border-[#91684A]"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus
                  className="h-5 w-5 text-[#91684A] group-hover:text-[#7D5A3C]"
                  aria-hidden="true"
                />
              </span>
              회원가입
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
