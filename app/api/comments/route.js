import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { data, error } = await supabase
    .from("comments")
    .select("*, user:user(username, profile_image_url)")
    .eq("post_id", postId)
    .order("created_at", { ascending: false })
    .range(offset, offset + parseInt(limit) - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
