"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function MyPage({ params }) {
  const { username } = params;
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // 마이페이지 ( 회원정보 수정 페이지 )
  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data, error } = await supabase
          .from("user")
          .select("*")
          .eq("username", username)
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching user:", error);
          setError("사용자 정보를 불러오는 중 오류가 발생했습니다.");
        } else if (!data) {
          setError("사용자를 찾을 수 없습니다.");
        } else {
          console.log(data);
          setUserData(data);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setError("예기치 않은 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [username]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>사용자 데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <h1>{userData.username}의 마이페이지</h1>
      <div>
        <img src={userData.profile_image_url} alt="프로필 이미지" />
        <p>이메일: {userData.email}</p>
        <p>프로필 메시지: {userData.profile_message}</p>
      </div>
    </div>
  );
}
