"use client";
import { Suspense } from "react";
import PostDetail from "@/components/Posts/PostDetail";
import { supabase } from "@/lib/supabase";
import WithComponentLayout from "@/components/WithComponentLayout/page";

async function getPostData(id) {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      user:user_email (
        id,
        username,
        email,
        profile_image_url,
        profile_message
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export default async function PostPage({ params }) {
  const postData = await getPostData(params.id);

  return (
    <WithComponentLayout>
      <div className="container mx-auto px-4 py-8">
        {/* <Suspense fallback={<div>Loading...</div>}> */}
        <PostDetail post={postData} />
        {/* </Suspense> */}
      </div>
    </WithComponentLayout>
  );
}
