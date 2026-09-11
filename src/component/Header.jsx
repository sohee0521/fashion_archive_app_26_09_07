import profile from "../img/profile.svg";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  // 클릭된 활성 메뉴(isActive)일 때와 아닐 때의 스타일 분기
  const navLinkStyle = ({ isActive }) =>
    `transition-colors ${
      isActive
        ? "!text-accent-pink font-medium"
        : "text-dark-gray hover:text-black"
    }`;

  // 프로필 아이콘 클릭 핸들러 (로그인 여부에 따른 분기)
  const handleProfileClick = () => {
    const isLoggedIn = localStorage.getItem("fitlog_logged_in") === "true";

    if (isLoggedIn) {
      // 이미 로그인된 상태라면 로그아웃 여부 확인
      const confirmLogout = window.confirm("로그아웃 하시겠습니까?");
      if (confirmLogout) {
        localStorage.removeItem("fitlog_logged_in"); // 데이터는 남기고 로그인 상태만 해제
        alert("로그아웃 되었습니다.");
        navigate("/login");
      }
    } else {
      // 로그인이 안 되어 있다면 로그인 페이지로 이동
      navigate("/login");
    }
  };

  return (
    <header className="w-full fixed top-0 z-50 backdrop-blur-xs px-10 py-[20px] flex items-center justify-between ">
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

      {/* 마이페이지 유저 아이콘 (로그인 상태에 따라 로그인/로그아웃 분기) */}
      <button
        type="button"
        onClick={handleProfileClick}
        className="text-black hover:opacity-70 p-1 cursor-pointer"
        title="Profile / Logout"
      >
        <img src={profile} alt="Profile" />
      </button>
    </header>
  );
}
