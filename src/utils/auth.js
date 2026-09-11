// src/utils/auth.js
export const checkLogin = (navigate) => {
  const isLoggedIn = localStorage.getItem("fitlog_logged_in") === "true";
  if (!isLoggedIn) {
    alert("로그인이 필요한 서비스입니다.");
    navigate("/login");
    return false;
  }
  return true;
};
