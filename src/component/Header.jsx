import profile from "../img/profile.svg";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full fixed top-0 z-50 backdrop-blur-xs px-10 py-6 flex items-center justify-between ">
      {/* 로고 */}
      <Link to="/" className="display3 text-black italic">
        Fitlog
      </Link>

      {/* 네비게이션 메뉴 */}
      <nav className="flex items-center gap-10 body4 text-dark-gray">
        <Link to="/archive" className="hover:text-black transition-colors">
          Archive
        </Link>
        <Link to="/lookbook" className="hover:text-black transition-colors">
          LookBook
        </Link>
        <Link to="/data" className="hover:text-black transition-colors">
          My Style
        </Link>
      </nav>

      {/* 마이페이지 유저 아이콘 */}
      <button type="button" className="text-black hover:opacity-70 p-1">
        <img src={profile} alt="Profile" />
      </button>
    </header>
  );
}
