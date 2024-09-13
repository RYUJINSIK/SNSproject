"use client";
import WritePost from "@/components/Posts/WritePost";
import WithComponentLayout from "@/components/WithComponentLayout/page";

const WritePostPage = () => {
  return (
    <WithComponentLayout>
      <h1 className="text-2xl font-bold mb-4">새 게시글 작성</h1>
      <WritePost />
    </WithComponentLayout>
  );
};

export default WritePostPage;
