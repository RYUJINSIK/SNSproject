"use client";
import { useState, useEffect } from "react";
import { shallow } from "zustand/shallow";
import WithComponentLayout from "@/components/WithComponentLayout/page";
import { useUserStore } from "@/store/useUserStore";
import PostCard from "@/components/PostCard/page";

export default function Index() {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState({});

  const { token: storeToken, userData: storeData } = useUserStore(
    (state) => ({
      token: state.token,
      userData: state.userData,
    }),
    shallow
  );

  useEffect(() => {
    setToken(storeToken);
    setUserData(storeData);
  }, [storeToken, storeData]);

  return (
    <WithComponentLayout>
      <div>
        <p>Token: {token}</p>
        <p>User Data: {JSON.stringify(userData)}</p>
      </div>
      <PostCard postId={1} />
      <PostCard postId={2} />
      <PostCard postId={3} />
      <p>hi</p>
    </WithComponentLayout>
  );
}
