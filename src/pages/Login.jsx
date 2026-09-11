import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 이미 로그인된 상태라면 로그인 페이지 진입 시 바로 홈으로 이동
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("fitlog_logged_in") === "true";
    if (isLoggedIn) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }
    // 프론트엔드 전용이므로 간단히 로그인 성공 처리를 하고 홈으로 이동
    localStorage.setItem("fitlog_logged_in", "true");
    alert("로그인되었습니다!");
    navigate("/");
  };

  return (
    <div className="w-full min-h-screen bg-white text-black flex flex-col justify-center items-center px-6 pt-[80px] pb-24">
      <div className="w-full max-w-[420px] flex flex-col gap-8 bg-white border border-[#EBEBEB] rounded-2xl p-8 sm:p-10 shadow-2xs">
        {/* 타이틀 영역 */}
        <div className="flex flex-col gap-2 text-center">
          <h1 className="display1 text-accent-pink italic font-normal">
            FitLog
          </h1>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="caption2 font-medium text-black">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-sm border border-gray/40 body4 focus:border-accent-pink focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="caption2 font-medium text-black">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-sm border border-gray/40 body4 focus:border-accent-pink focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-black text-white display3 flex items-center justify-center gap-2 hover:bg-accent-pink transition-colors cursor-pointer mt-2"
          >
            <span>Sign In</span>
            <ArrowRight size={18} strokeWidth={1.5} />
          </button>
        </form>

        {/* 회원가입 페이지로 이동 링크 */}
        <div className="flex items-center justify-center gap-2 caption3 text-dark-gray pt-2 border-t border-[#F0F0F0]">
          <span>Don&apos;t have an account?</span>
          <Link
            to="/signup"
            className="text-black font-medium underline hover:text-accent-pink transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
