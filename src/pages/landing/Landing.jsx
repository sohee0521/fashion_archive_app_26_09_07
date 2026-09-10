import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus, Edit2, Folder } from "lucide-react";
import main_slogan from "../../img/main_slogan.png";
import pose from "../../img/pose.png";
import { LANDING_MOCK_DATA } from "./landingData";
import Footer from "../../component/Footer";

function ScrollFadeIn({ children, delay = 0, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 화면에 들어오면 보이고, 화면 위/아래로 벗어나면 다시 숨김
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.15, // 요소가 15% 정도 화면에 보이면 쇼쇽 등장
        rootMargin: "0px 0px -50px 0px", // 스크롤 내릴 때 살짝 여유 있게 트리거
      },
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    // 언마운트 시 클린업
    return () => currentRef && observer.unobserve(currentRef);
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-12 scale-[0.98]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Landing({ onStart }) {
  const navigate = useNavigate();

  const handleStartCloset = () => {
    if (typeof onStart === "function") {
      onStart();
    } else {
      navigate("/home");
    }
  };

  const { howItWorks, lookbook, insights } = LANDING_MOCK_DATA;

  return (
    <div className="w-full min-h-screen text-black flex flex-col items-center selection:bg-pink-100 selection:text-accent-pink overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────
          ZONE 1: 히어로 & HOW IT WORKS
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full pt-[60px] sm:pt-[70px] bg-gradient-to-b from-base-pink via-base-pink/20 to-white pb-16 px-6 flex flex-col items-center">
        {/* 히어로 타이틀 */}
        <ScrollFadeIn
          delay={100}
          className="w-full flex flex-col items-center text-center mb-[60px] md:mb-[30px]"
        >
          <span className="body3 text-accent-pink select-none">
            Fashion Archiving Space
          </span>

          <div className="w-full sm:w-[80%] max-w-[600px] my-2 flex justify-center">
            <img
              src={main_slogan}
              alt="What's in My Closet?"
              className="w-full object-contain pointer-events-none select-none"
            />
          </div>

          <p className="caption2 text-light-text italic">
            소장템부터 위시리스트까지, 링크 하나로 채우는 나만의 온라인 옷장
          </p>
        </ScrollFadeIn>

        {/* SECTION 1: HOW IT WORKS */}
        <div className="w-full max-w-5xl sm:mt-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* 좌측 안내 가이드 */}
            <ScrollFadeIn
              delay={200}
              className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <span className="caption3 text-accent-pink tracking-widest uppercase mb-1 select-none">
                HOW IT WORKS
              </span>
              <h2 className="caption1 text-[24px] text-black font-semibold">
                이렇게 시작해보세요.
              </h2>

              <div className="mt-6 flex flex-col gap-5 w-full max-w-md lg:max-w-none">
                {/* STEP 1 */}
                <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left gap-2 sm:gap-3 lg:gap-4">
                  <span className="w-[30px] h-[30px] rounded-full bg-white text-accent-pink caption2 flex items-center justify-center shrink-0 shadow-2xs border border-pink-100 select-none">
                    1
                  </span>
                  <div className="flex flex-col items-center lg:items-start">
                    <h4 className="caption1 text-black select-none">
                      상품 링크 붙여넣기
                    </h4>
                    <p className="body4 text-dark-gray mt-0.5 select-none">
                      마음에 드는 상품의 URL을 입력해보세요.
                    </p>
                  </div>
                </div>

                {/* STEP 2 */}
                <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left gap-2 sm:gap-3 lg:gap-4">
                  <span className="w-[30px] h-[30px] rounded-full bg-white text-accent-pink caption2 flex items-center justify-center shrink-0 shadow-2xs border border-pink-100 select-none">
                    2
                  </span>
                  <div className="flex flex-col items-center lg:items-start">
                    <h4 className="caption1 text-black select-none">
                      아이템 저장 & 분류
                    </h4>
                    <p className="body4 text-dark-gray mt-0.5 select-none">
                      소장템인지 위시템인지 쏙 골라 담아보세요.
                    </p>
                  </div>
                </div>

                {/* STEP 3 */}
                <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left gap-2 sm:gap-3 lg:gap-4">
                  <span className="w-[30px] h-[30px] rounded-full bg-white text-accent-pink caption2 flex items-center justify-center shrink-0 shadow-2xs border border-pink-100 select-none">
                    3
                  </span>
                  <div className="flex flex-col items-center lg:items-start">
                    <h4 className="caption1 text-black select-none">
                      내 옷장 완성
                    </h4>
                    <p className="body4 text-dark-gray mt-0.5 select-none">
                      저장한 아이템을 모아 나만의 아카이브를 만들어보세요.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollFadeIn>

            {/* 우측 브라우저/아카이브 프리뷰 */}
            <ScrollFadeIn
              delay={350}
              className="lg:col-span-7 relative flex items-center justify-center gap-4 p-2 sm:p-4 w-full"
            >
              <div className="w-[58%] bg-white rounded-2xl border border-[#EBEBEB] shadow-xl p-3 flex flex-col gap-2.5">
                <div className="flex items-center gap-1.5 pb-2 border-b border-[#F0F0F0] caption3 text-dark-gray">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#EBEBEB]" />
                    <span className="w-2 h-2 rounded-full bg-[#EBEBEB]" />
                  </div>
                  <span className="truncate bg-[#F5F5F7] px-2 py-0.5 rounded caption3 w-full text-center">
                    {howItWorks.singleProduct.siteUrl}
                  </span>
                </div>
                <div className="aspect-square bg-base-pink/30 rounded-xl overflow-hidden flex items-center justify-center">
                  <img
                    src={howItWorks.singleProduct.image}
                    alt="item"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-between items-center pt-1">
                  <div>
                    <p className="caption2 text-black truncate">
                      {howItWorks.singleProduct.title}
                    </p>
                    <p className="caption3 text-dark-gray">
                      {howItWorks.singleProduct.memo}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-[42%] bg-white rounded-2xl border border-[#EBEBEB] shadow-xl p-3.5 flex flex-col">
                <span className="  display3 text-[24px] mb-2 select-none">
                  My Archive
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {howItWorks.archiveGrid.map((src, idx) => (
                    <div
                      key={idx}
                      className="aspect-square bg-[#F5F5F7] rounded-lg overflow-hidden border border-[#EBEBEB]"
                    >
                      <img
                        src={src}
                        alt="thumb"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <span className="absolute -bottom-4 -right-2 display3 text-[24px] text-accent-pink/60 rotate-6 select-none">
                Save & Collect ♡
              </span>
            </ScrollFadeIn>
          </div>

          <ScrollFadeIn
            delay={200}
            className="w-full flex justify-center mt-12 sm:mt-14"
          >
            <button
              type="button"
              onClick={handleStartCloset}
              className="px-[40px] py-[20px] rounded-full bg-black text-white flex items-center gap-2.5 hover:bg-black/60 transition-all cursor-pointer shadow-lg active:scale-95 select-none"
            >
              <span className="caption2">내 옷장 채우러 가기</span>
              <ArrowRight size={16} />
            </button>
          </ScrollFadeIn>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 2: MY LOOKBOOK
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#FFF2F5]/60 py-24 flex flex-col items-center text-center border-y border-pink-100/60 px-6">
        <ScrollFadeIn
          delay={150}
          className="w-full max-w-5xl flex flex-col items-center"
        >
          <span className="body3 text-accent-pink  mb-1 ">My Lookbook</span>
          <h2 className="body1 text-black font-semibold select-none">
            저장한 아이템으로 나만의 룩북을 만들어보세요
          </h2>
          <p className="body4 text-dark-gray max-w-lg mt-2 select-none">
            마네킹 주위에 옷을 하나씩 얹어가며 완성하는 나만의 피팅룸 캔버스
          </p>

          <button
            type="button"
            onClick={handleStartCloset}
            className="mt-6 px-[30px] py-[15px] rounded-full bg-black text-white body4 flex items-center gap-2 hover:bg-black/60 transition-all cursor-pointer shadow-sm mb-12 select-none"
          >
            <span className="caption2">룩북 제작하기</span>
            <ArrowRight size={14} />
          </button>
        </ScrollFadeIn>

        <ScrollFadeIn
          delay={300}
          className="w-full max-w-3xl relative flex items-center justify-center"
        >
          {/* 좌측 서랍장 */}
          <div className="hidden md:flex flex-col w-[250px] bg-white border border-[#EBEBEB] rounded-lg p-5 shadow-lg absolute -left-18 top-8 z-20 rotate-[-4deg] pointer-events-none opacity-95 select-none">
            <span className="display3 text-black mb-2 text-left">My Item</span>
            <div className="flex gap-1 pb-2 border-b border-[#F0F0F0] caption4 text-dark-gray">
              <span className="bg-black text-white px-2.5 py-0.5 rounded-full">
                Top
              </span>
              <span className="px-2.5 py-0.5 ">Bottom</span>
              <span className="px-2.5 py-0.5">Outer</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {lookbook.subItemImages.map((src, idx) => (
                <div
                  key={idx}
                  className="aspect-square bg-[#F5F5F7] rounded overflow-hidden"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 룩북 조립 캔버스 */}
          <div className="w-full sm:w-[480px] bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-2xl shadow-pink-200/40 relative overflow-hidden flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
              <div className="flex items-center gap-1.5">
                <span className="body3 text-black select-none">
                  {lookbook.title}
                </span>
                <Edit2 size={14} className="text-dark-gray" />
              </div>
            </div>

            <div className="relative w-full h-[360px] flex items-center justify-center mb-2 select-none">
              <div className="w-[220px] flex items-center justify-center">
                <img
                  src={pose}
                  alt="pose"
                  className="w-full object-contain pointer-events-none"
                />
              </div>

              <div className="absolute top-[6%] left-[10%] flex flex-col items-center">
                <div className="w-18 h-18 rounded-full bg-white border-1 border-gray shadow-md overflow-hidden">
                  <img
                    src={lookbook.slots.top}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="caption4 text-dark-gray mt-1">Top</span>
              </div>

              <div className="absolute top-[35%] -left-[0%] flex flex-col items-center">
                <div className="w-18 h-18 rounded-full bg-white border-1 border-gray shadow-md overflow-hidden">
                  <img
                    src={lookbook.slots.outer}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="caption4 text-dark-gray mt-1">Outer</span>
              </div>

              <div className="absolute bottom-[10%] left-[10%] flex flex-col items-center">
                <div className="w-18 h-18 rounded-full bg-white border-1 border-gray shadow-md overflow-hidden">
                  <img
                    src={lookbook.slots.bottom}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="caption4 text-dark-gray mt-1">Bottom</span>
              </div>

              <div className="absolute top-[6%] right-[10%] flex flex-col items-center">
                <div className="w-18 h-18 rounded-full bg-white border-1 border-gray shadow-md overflow-hidden">
                  <img
                    src={lookbook.slots.acc}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="caption4 text-dark-gray mt-1">Acc</span>
              </div>

              <div className="absolute top-[35%] -right-[0%] flex flex-col items-center">
                <div className="w-18 h-18 rounded-full bg-white border-1 border-gray shadow-md overflow-hidden">
                  <img
                    src={lookbook.slots.shoes}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="caption4 text-dark-gray mt-1">Shoes</span>
              </div>

              <div className="absolute bottom-[10%] right-[10%] flex flex-col items-center animate-pulse duration-50">
                <div className="w-17 h-17 rounded-full border-2 border-dashed border-accent-pink bg-pink-50 flex items-center justify-center text-[#FF85C0]">
                  <Plus size={18} strokeWidth={2} />
                </div>
                <span className="caption4 text-[#FF85C0] mt-1 font-medium">
                  Add Item
                </span>
              </div>

              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#D1D1D6] caption3 text-dark-gray shadow-2xs">
                  #Casual
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#D1D1D6] caption3 text-dark-gray shadow-2xs">
                  #Minimal
                </span>
              </div>
            </div>
          </div>
        </ScrollFadeIn>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 3: STYLE INSIGHTS
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full bg-white py-24 flex justify-center px-6">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* 좌측 안내 텍스트 */}
            <ScrollFadeIn
              delay={150}
              className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <span className="body3 text-accent-pink">Style Insights</span>
              <h2 className="body1 text-black font-semibold select-none leading-snug">
                데이터로 보는
                <br />
                나의 스타일
              </h2>
              <p className="body4 text-dark-gray mt-2 select-none max-w-md lg:max-w-none">
                선호하는 스타일 태그와 카테고리부터,
                <br />내 룩북에서 가장 사랑받은 아이템까지 분석해 드려요.
              </p>
              <div className="mt-6 flex justify-center lg:justify-start w-full">
                <button
                  type="button"
                  onClick={handleStartCloset}
                  className="px-[30px] py-[15px] rounded-full border border-black text-black body4 hover:bg-black hover:text-white flex items-center gap-1.5 transition-all cursor-pointer select-none"
                >
                  <span className="caption2">내 데이터 확인하기</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </ScrollFadeIn>

            {/* 우측 대시보드 프리뷰 카드 */}
            <ScrollFadeIn
              delay={300}
              className="lg:col-span-7 bg-white rounded-2xl border border-[#EBEBEB] shadow-md p-5 sm:p-6 flex flex-col gap-4 w-full"
            >
              {/* 01 Favorite Style */}
              <div className="w-full border border-[#F0F0F0] rounded-2xl p-5 flex flex-col gap-4 bg-white shadow-2xs">
                <div className="flex justify-between items-baseline border-b border-[#F7F7F7] pb-2.5">
                  <span className="display3 text-black">01 Favorite Style</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-around py-2 px-2 gap-4">
                  {/* SVG 도넛 차트 */}
                  <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                    <svg
                      className="w-full h-full -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#F0F0F0"
                        strokeWidth="4.5"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#E5E5EA"
                        strokeWidth="4.5"
                        strokeDasharray="100 100"
                        strokeDashoffset="0"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#D1D1D6"
                        strokeWidth="4.5"
                        strokeDasharray="88 100"
                        strokeDashoffset="0"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#FFB6D9"
                        strokeWidth="4.5"
                        strokeDasharray="74 100"
                        strokeDashoffset="0"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#FF69B4"
                        strokeWidth="4.5"
                        strokeDasharray="56 100"
                        strokeDashoffset="0"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#1C1C1E"
                        strokeWidth="4.5"
                        strokeDasharray="32 100"
                        strokeDashoffset="0"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="caption1 font-bold text-black tracking-tight">
                        32%
                      </span>
                    </div>
                  </div>

                  {/* 스타일 태그 목록 */}
                  <div className="flex flex-col gap-2 min-w-[140px] w-full sm:w-auto">
                    {insights.styles.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs gap-4"
                      >
                        <span className="flex items-center gap-2 text-black">
                          <span className={`w-2 h-2 rounded-full ${s.color}`} />
                          <span className="caption3 text-black font-normal">
                            {s.name}
                          </span>
                        </span>
                        <span className="caption3 text-black">{s.percent}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 03 Hall of Fame */}
              <div className="w-full border border-[#F0F0F0] rounded-2xl p-5 flex flex-col gap-3 bg-white shadow-2xs">
                <div className="flex justify-between items-baseline border-b border-[#F7F7F7] pb-2">
                  <span className="display3 text-black">02 Hall of Fame</span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="caption3 text-accent-pink ">
                    Most Used Saved
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {insights.hallOfFame.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#FAFAFA] rounded-lg p-1.5 border border-[#EBEBEB] flex flex-col gap-1 shadow-2xs"
                      >
                        <div className="w-full aspect-square bg-white rounded overflow-hidden">
                          <img
                            src={item.img}
                            alt={item.title}
                            className="w-full h-full object-cover pointer-events-none"
                          />
                        </div>
                        <div className="flex flex-col px-0.5 pb-0.5">
                          <span className="caption3 text-[14px] font-medium text-black truncate">
                            {item.id}. {item.title}
                          </span>
                          <span className=" pl-[10px] caption3 text-[12px] text-dark-gray mt-0.5">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
