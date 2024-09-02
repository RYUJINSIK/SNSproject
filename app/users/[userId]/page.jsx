import { supabase } from "@/lib/supabase";

export default async function MyPage({ params }) {
  const { userId } = params;

  // 서버 사이드에서 사용자 정보 조회
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !user) {
    return <div>사용자를 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <h1>{user.name}의 마이페이지</h1>
      {/* 사용자 정보 표시 */}
    </div>
  );
}
