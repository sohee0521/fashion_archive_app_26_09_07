import profile from "../img/profile.svg";
import { Link, NavLink, useNavigate } from "react-router-dom"; // 🔥 useNavigate 추가

export default function Header() {
  const navigate = useNavigate(); // 🔥 네비게이트 훅 선언

  // 클릭된 활성 메뉴(isActive)일 때와 아닐 때의 스타일 분기
  const navLinkStyle = ({ isActive }) =>
    `transition-colors ${
      isActive
        ? "!text-accent-pink font-medium"
        : "text-dark-gray hover:text-black"
    }`;

  return (
    <header className="w-full fixed top-0 z-50 backdrop-blur-xs px-10 py-[20px] flex items-center justify-between bg-white/80">
      {/* 로고 */}
      <Link to="/" className="display3 text-black italic">
        Fitlog
      </Link>

      {/* 네비게이션 메뉴 (클릭 및 활성화 시 핑크색) */}
      <nav className="flex items-center gap-10 body4">
        <NavLink to="/archive" className={navLinkStyle}>
          Archive
        </NavLink>
        <NavLink to="/lookbook" className={navLinkStyle}>
          LookBook
        </NavLink>
        <NavLink to="/data" className={navLinkStyle}>
          My Style
        </NavLink>
      </nav>

      {/* 🔥 마이페이지 유저 아이콘 클릭 시 /login 페이지로 이동 */}
      <button
        type="button"
        onClick={() => navigate("/login")}
        className="text-black hover:opacity-70 p-1 cursor-pointer"
      >
        <img src={profile} alt="Profile" />
      </button>
    </header>
  );
}
