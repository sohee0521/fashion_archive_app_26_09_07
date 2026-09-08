import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PaperOpen from "../../../img/paper_open.png";
import PaperClose from "../../../img/paper_close.png";
import Stars from "../../../img/stars.png";
import { ChevronLeft, ChevronRight, MoveRight } from "lucide-react";

export default function LookbookSection() {
  const navigate = useNavigate();

  // 등록된 룩북 목데이터 (로컬스토리지 연동 시 대체 가능)
  const looks = [
    { id: 1, title: "LOOK 01", desc: "No looks created yet" },
    { id: 2, title: "LOOK 02", desc: "Cozy knit & pleated skirt" },
    { id: 3, title: "LOOK 03", desc: "City casual street mood" },
    { id: 4, title: "LOOK 04", desc: "Vintage leather mix" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  // 애니메이션 방향: 'next' | 'prev' | null
  const [turningDirection, setTurningDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTurningDirection("next");

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % looks.length);
      setTurningDirection(null);
      setIsAnimating(false);
    }, 280); // 촤라락 감기는 속도 (0.28초)
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTurningDirection("prev");

    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + looks.length) % looks.length);
      setTurningDirection(null);
      setIsAnimating(false);
    }, 280);
  };

  const currentLook = looks[currentIndex];

  return (
    <section className="w-full lg:px-[180px] sm:px-[100px] px-[50px] py-[100px] bg-[linear-gradient(to_bottom,#ffffff_0%,var(--color-background)_10%,var(--color-background)_90%,#ffffff_100%)] flex flex-col md:flex-row items-center justify-between gap-16 overflow-hidden">
      {/* 좌측 타이틀 & 링크 */}
      <div className="flex flex-col items-center md:items-start gap-4">
        <div>
          <div className="relative left-[200px] top-[50px] z-0 pointer-events-none">
            <img src={Stars} alt="Stars" />
          </div>

          <h2 className="display1 leading-none font-normal select-none">
            My LookBook <span className="font-light">—</span>
          </h2>
        </div>

        <p className="body4 text-dark-gray">Mix, match, and make your look.</p>

        <Link
          to="/lookbook"
          className="border border-black px-6 py-2 display3 shrink-0 hover:bg-black hover:!text-white transition-all duration-200 mt-6 inline-flex items-center gap-2"
        >
          Create New Look
          <MoveRight strokeWidth={1.2} />
        </Link>
      </div>

      {/* 우측 룩북 인터랙션 뷰어 */}
      <div className="relative flex items-center gap-4 sm:gap-6 [perspective:1000px]">
        {/* 이전 버튼 */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={isAnimating}
          className="w-[40px] h-[40px] bg-white flex justify-center items-center rounded-full shadow-sm hover:scale-105 active:scale-95 hover:bg-base-pink/40 transition-all cursor-pointer z-20 shrink-0"
        >
          <ChevronLeft strokeWidth={1.2} size={26} className="text-black" />
        </button>

        {/* 메인 종이 노트 (촤라락 인터랙션 컨테이너) */}
        <div className="relative w-[300px] h-[405px] flex items-center justify-center select-none">
          {/* 뒤에 겹쳐 있는 대기용 종이 (원근감 & 입체감) */}
          <div className="absolute inset-0 w-full h-full rotate-[-2deg] scale-[0.98] opacity-60 pointer-events-none">
            <img
              src={PaperOpen}
              alt=""
              className="w-full h-full object-contain drop-shadow-sm"
            />
          </div>

          {/* 실제 페이지 카드 (넘길 때 회전하며 스르륵 날아가는 효과) */}
          <div
            key={currentIndex}
            className={`relative w-full h-full flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
              turningDirection === "next"
                ? "-translate-x-12 -rotate-6 opacity-0 scale-95"
                : turningDirection === "prev"
                  ? "translate-x-12 rotate-6 opacity-0 scale-95"
                  : "translate-x-0 rotate-0 opacity-100 scale-100"
            }`}
          >
            {/* 펼쳐진 종이 이미지 */}
            <img
              src={PaperOpen}
              alt="Opened Lookbook Note"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md"
            />

            {/* 내부 종이 내용 */}
            <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between items-center text-center">
              <div className="w-full flex justify-start pt-2">
                <span className="display3 text-xl italic tracking-wide text-black">
                  {currentLook.title}
                </span>
              </div>

              <div
                onClick={() => navigate("/lookbook")}
                className="flex flex-col items-center justify-center gap-2 cursor-pointer group my-auto"
              >
                <div className="w-11 h-11 rounded-full border border-dashed border-accent-pink flex items-center justify-center text-accent-pink text-2xl font-light group-hover:scale-110 transition-transform">
                  +
                </div>
                <span className="caption3 text-xs text-accent-pink tracking-tight font-sans">
                  Add Your Item
                </span>
              </div>

              <span className="caption3 text-xs text-dark-gray pb-2">
                {currentLook.desc}
              </span>
            </div>
          </div>
        </div>

        {/* 다음 버튼 */}
        <button
          type="button"
          onClick={handleNext}
          disabled={isAnimating}
          className="w-[40px] h-[40px] bg-white flex justify-center items-center rounded-full shadow-sm hover:scale-105 active:scale-95 hover:bg-base-pink/40 transition-all cursor-pointer z-20 shrink-0"
        >
          <ChevronRight strokeWidth={1.2} size={26} className="text-black" />
        </button>

        {/* 우측 닫힌 서브 노트 데코 */}
        <div
          className={`relative w-[190px] h-[260px] hidden sm:block opacity-90 select-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
            turningDirection === "next"
              ? "-translate-x-5 -rotate-3 scale-[0.96] opacity-50"
              : turningDirection === "prev"
                ? "translate-x-3 rotate-4 scale-[0.98] opacity-70"
                : "translate-x-0 rotate-2 scale-100 opacity-90"
          }`}
        >
          <img
            src={PaperClose}
            alt="Closed Lookbook Note"
            className="w-full h-full object-contain pointer-events-none drop-shadow-sm"
          />
        </div>
      </div>
    </section>
  );
}
