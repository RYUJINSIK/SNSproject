import Link from "next/link";
import { Cat, Dog } from "lucide-react";

const Logo = ({ className = "" }) => {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <Dog strokeWidth={3} className="h-5 w-5 mb-1" />
      <span className="font-goryeong text-xl leading-none mr-1 ml-1 flex items-center">
        PETOPIA
      </span>
      <Cat strokeWidth={3} className="h-5 w-5 mb-1" />
    </Link>
  );
};

export default Logo;
