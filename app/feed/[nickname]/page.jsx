import { notFound } from "next/navigation";

export default async function UserFeedPage({ params }) {
  //   if (!user) {
  //     notFound();
  //   }

  return (
    <div>
      <h1>{user.nickname}의 피드</h1>
      {/* 사용자 피드 표시 */}
    </div>
  );
}
