"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Home, Search, Plus, Users, User } from "lucide-react";

function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <footer className="w-full fixed bottom-0 left-0 bg-white h-16 border-t border-[#C1AC95] z-50">
      <div className="max-w-7xl mx-auto h-full flex justify-between items-center px-4">
        <Link href="/" className="flex flex-col items-center">
          <Home className="h-6 w-6 text-[#91684A]" />
          <span className="text-xs mt-1 text-[#91684A]">홈</span>
        </Link>
        <Link href="/search" className="flex flex-col items-center">
          <Search className="h-6 w-6 text-[#91684A]" />
          <span className="text-xs mt-1 text-[#91684A]">검색</span>
        </Link>
        <Link href="/posts/write" className="flex flex-col items-center -mt-6">
          <div className="bg-[#91684A] rounded-full p-3">
            <Plus className="h-8 w-8 text-white" />
          </div>
          <span className="text-xs mt-1 text-[#91684A]">글쓰기</span>
        </Link>
        <Link href="/community" className="flex flex-col items-center">
          <Users className="h-6 w-6 text-[#91684A]" />
          <span className="text-xs mt-1 text-[#91684A]">커뮤니티</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center">
          <User className="h-6 w-6 text-[#91684A]" />
          <span className="text-xs mt-1 text-[#91684A]">프로필</span>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
