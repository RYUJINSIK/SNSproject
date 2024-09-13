import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle, LogOut, LogIn } from "lucide-react";
import Logo from "@/components/Logo";
import { supabase } from "@/lib/supabase";

function Header() {
  const [mounted, setMounted] = useState(false);
  const { userData, setUserData, setToken } = useUserStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      // Supabase 로그아웃
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Zustand 스토어 데이터 비우기
      setUserData(null);
      setToken(null);

      window.location.href = "/"; // 홈페이지로 리다이렉트
    } catch (error) {
      console.error("Logout failed:", error);
      // 에러 처리 (예: 사용자에게 알림)
    }
  };

  if (!mounted) return null;

  return (
    <header className="w-full fixed top-0 left-0 bg-white h-14 border-b border-[#C1AC95] z-50">
      <div className="max-w-7xl mx-auto h-full flex justify-between items-center px-4">
        <Logo className="text-[#91684A]" />
        <div className="font-goryeong flex items-center space-x-4">
          {userData ? (
            <>
              <Link href="/messages" className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#91684A] p-0 h-auto"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-[#91684A] text-md p-0 h-auto flex items-center"
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span className="mt-px">LOGOUT</span>
              </Button>
            </>
          ) : (
            <Link href="/login" className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#91684A] p-0 h-auto flex items-center"
              >
                <LogIn className="h-5 w-5 mr-2" />
                <span className="mt-px">LOGIN</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
