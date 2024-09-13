import Link from "next/link";
import { Cat, Dog } from "lucide-react";

const Logo = ({ className = "", fontSize = "text-xl" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Dog strokeWidth={3} className="h-5 w-5 mb-1" />
      <span
        className={`font-goryeong leading-none mr-1 ml-1 flex items-center ${fontSize}`}
      >
        PETOPIA
      </span>
      <Cat strokeWidth={3} className="h-5 w-5 mb-1" />
    </div>
  );
};

export default Logo;
