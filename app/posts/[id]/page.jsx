import { Suspense } from "react";
import PostDetail from "@/components/PostDetail";
import { supabase } from "@/lib/supabase";

async function getPostData(id) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export default async function PostPage({ params }) {
  const postData = await getPostData(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <PostDetail post={postData} />
      </Suspense>
    </div>
  );
}
