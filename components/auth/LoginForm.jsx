"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/useUserStore";

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
      setError(error.message);
    } else {
      setToken(data.session.access_token);
      setUserData(data.user.user_metadata);

      console.log("token ? : ", data.session.access_token);
      console.log("userData ? : ", data.user.user_metadata);

      router.push("/");
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
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
}
