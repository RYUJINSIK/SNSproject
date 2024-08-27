"use client";
import { useCallback, useEffect, useState } from "react";

function Header({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    mounted && (
      <header className="w-full flex items-center justify-center sticky top-0 bg-blue-500 h-14 border-b border-[#efefef] z-50">
        <div className="w-full flex justify-between items-center px-4">
          <div className="cursor-pointer">LOGO IMAGE</div>
          <div className="flex flex-row">
            <div className="cursor-pointer">DM</div>
            <div className="cursor-pointer ml-3">LOGIN</div>
          </div>
        </div>
      </header>
    )
  );
}

export default Header;
