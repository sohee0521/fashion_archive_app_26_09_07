import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 프론트엔드 전용 회원가입 성공 처리
    localStorage.setItem("fitlog_logged_in", "true");
    alert("회원가입이 완료되었습니다! 환영합니다.");
    navigate("/");
  };

  return (
    <div className="w-full min-h-screen bg-white text-black flex flex-col justify-center items-center px-6 pt-[80px] pb-24">
      <div className="w-full max-w-[420px] flex flex-col gap-8 bg-white border border-[#EBEBEB] rounded-2xl p-8 sm:p-10 shadow-2xs">
        {/* 타이틀 영역 */}
        <div className="flex flex-col gap-2 text-center">
          <h1 className="display1 text-accent-pink italic font-normal">
            Fitlog
          </h1>
        </div>

        {/* 회원가입 폼 */}
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="caption2 font-medium text-black">Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 rounded-sm border border-gray/40 body4 focus:border-accent-pink focus:outline-none transition-colors"
            />
          </div>

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

          <div className="flex flex-col gap-1.5">
            <label className="caption2 font-medium text-black">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-sm border border-gray/40 body4 focus:border-accent-pink focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-black text-white display3 flex items-center justify-center gap-2 hover:bg-accent-pink transition-colors cursor-pointer mt-2"
          >
            <span>Sign Up</span>
            <ArrowRight size={18} strokeWidth={1.5} />
          </button>
        </form>

        {/* 로그인 페이지로 이동 링크 */}
        <div className="flex items-center justify-center gap-2 caption3 text-dark-gray pt-2 border-t border-[#F0F0F0]">
          <span>Already have an account?</span>
          <Link
            to="/login"
            className="text-black font-medium underline hover:text-accent-pink transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
