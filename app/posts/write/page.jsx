"use client";
import { useSearchParams } from "next/navigation";
import WritePost from "@/components/Posts/WritePost";
import WithComponentLayout from "@/components/WithComponentLayout/page";

const WritePostPage = () => {
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");

  const isEditMode = !!postId;

  return (
    <WithComponentLayout>
      <WritePost postId={postId} />
    </WithComponentLayout>
  );
};

export default WritePostPage;
