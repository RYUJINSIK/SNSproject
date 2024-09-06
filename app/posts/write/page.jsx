import WritePost from "@/components/Posts/WritePost";

const WritePostPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">새 게시글 작성</h1>
      <WritePost />
    </div>
  );
};

export default WritePostPage;
