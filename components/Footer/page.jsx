"use client";
import { useCallback, useEffect, useState } from "react";

function Footer({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    mounted && (
      <footer className="w-full flex items-center justify-center sticky bottom-0 bg-white h-14 border-b border-[#efefef] z-50">
        <div className="w-full flex justify-between items-center px-4">
          <div className="cursor-pointer">LOGO IMAGE</div>
        </div>
      </footer>
    )
  );
}

export default Footer;
