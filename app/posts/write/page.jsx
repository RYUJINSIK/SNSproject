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
      <h1 className="text-2xl font-bold mb-4">
        {isEditMode ? "게시글 수정" : "새 게시글 작성"}
      </h1>
      <WritePost postId={postId} />
    </WithComponentLayout>
  );
};

export default WritePostPage;
