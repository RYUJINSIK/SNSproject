"use client";
import { useCallback, useEffect, useState } from "react";

function Header({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    mounted && (
      <header className="w-full flex items-center justify-center sticky top-0 bg-white h-14 border-b border-[#efefef] z-50">
        <div className="w-full flex justify-between items-center px-4">
          <div className="cursor-pointer">LOGO IMAGE</div>
        </div>
      </header>
    )
  );
}

export default Header;
