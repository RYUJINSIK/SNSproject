"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import WithComponentLayout from "@/components/WithComponentLayout/page";
import UserProfile from "@/components/User/UserProfile";
import { useUserStore } from "@/store/useUserStore";

export default function UserPage({ params }) {
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useUserStore((state) => state.userData);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data: userData, error: userError } = await supabase
          .from("user")
          .select("*")
          .eq("username", params.id)
          .limit(1)
          .single();

        if (userError) throw userError;

        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select("id, image_urls")
          .eq("user_email", userData.email)
          .order("created_at", { ascending: false });

        if (postsError) throw postsError;

        setProfileData(userData);
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <WithComponentLayout>
      <UserProfile
        profileData={profileData}
        posts={posts}
        isOwnProfile={currentUser?.email === profileData?.email}
      />
    </WithComponentLayout>
  );
}
