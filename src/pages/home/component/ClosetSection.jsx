import React, { useState, useEffect, useRef } from "react";
import { MoveRight } from "lucide-react";
import logoImg from "../../../img/Logo1.png";
import { Link, useNavigate } from "react-router-dom";
import hanger from "../../../img/hanger.svg";

// 🔥 스크롤 트리거 쇼쇼쇽 래퍼 컴포넌트
function ScrollFadeIn({ children, delay = 0, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => currentRef && observer.unobserve(currentRef);
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-10 scale-[0.99]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function ClosetSection({ items: initialItems, setIsFormOpen }) {
  const navigate = useNavigate();

  // 🔥 실시간으로 로컬스토리지의 최신 아이템을 담을 내부 State
  const [items, setItems] = useState(initialItems || []);

  // 🔥 로컬스토리지 변경 및 커스텀 신호 감지 (저장 즉시 새로고침 없이 반영)
  useEffect(() => {
    const loadLatestItems = () => {
      try {
        // 🔒 [핵심] 로그인 상태가 아니면 데이터 안 보이게 빈 배열 처리!
        const isLoggedIn = localStorage.getItem("fitlog_logged_in") === "true";
        if (!isLoggedIn) {
          setItems([]);
          return;
        }

        // 로그인 상태일 때만 정상적으로 불러오기
        const saved = JSON.parse(localStorage.getItem("fitlog_items") || "[]");
        setItems(saved);
      } catch (e) {
        console.error("아이템 동기화 실패:", e);
      }
    };

    // 처음 렌더링 시 불러오기
    loadLatestItems();

    // 커스텀 신호 및 다른 탭 감지 이벤트 등록
    window.addEventListener("fitlog_storage_updated", loadLatestItems);
    window.addEventListener("storage", loadLatestItems);

    return () => {
      window.removeEventListener("fitlog_storage_updated", loadLatestItems);
      window.removeEventListener("storage", loadLatestItems);
    };
  }, [initialItems]);

  // 5개 카드의 크기 및 위치 규격
  const emptyCardTemplates = [
    {
      width: "w-[210px]",
      height: "h-[270px]",
      translate: "-translate-y-4",
      circle: "w-10 h-10 text-xl",
      textSize: "caption3",
    },
    {
      width: "w-[280px]",
      height: "h-[370px]",
      translate: "translate-y-3",
      circle: "w-11 h-11 text-2xl",
      textSize: "caption3",
    },
    {
      width: "w-[180px]",
      height: "h-[210px]",
      translate: "-translate-y-8",
      circle: "w-9 h-9 text-lg",
      textSize: "caption3",
    },
    {
      width: "w-[220px]",
      height: "h-[310px]",
      translate: "translate-y-8",
      circle: "w-10 h-10 text-xl",
      textSize: "caption3",
    },
    {
      width: "w-[230px]",
      height: "h-[290px]",
      translate: "-translate-y-2",
      circle: "w-10 h-10 text-xl",
      textSize: "caption3",
    },
  ];

  const totalSlots = Math.max(emptyCardTemplates.length, items.length);

  return (
    <section className="w-full py-24 relative flex flex-col justify-center overflow-hidden">
      {/* 배경 은은한 로고 */}
      <div className="absolute left-6 top-8 z-0 w-[300px] pointer-events-none select-none opacity-40">
        <img src={logoImg} alt="Logo" />
      </div>

      {/* 헤더 타이틀 쇼쇼쇽 */}
      <ScrollFadeIn
        delay={100}
        className="w-full mb-16 relative z-10 flex items-center gap-[5px] lg:px-[180px] sm:px-[100px] px-[50px]"
      >
        <h2 className="display1 text-black leading-none font-normal select-none">
          My Closet <span className="font-light">—</span>
        </h2>
        <span className="body4 text-dark-gray tracking-tight select-none">
          Collect what you want
        </span>
      </ScrollFadeIn>

      {/* 무한 롤링 트랙 쇼쇼쇽 */}
      <ScrollFadeIn
        delay={250}
        className="w-full overflow-hidden py-6 cursor-pointer"
      >
        <div className="animate-marquee flex items-center gap-10">
          {[...Array(2)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center gap-10 shrink-0">
              {Array.from({ length: totalSlots }).map((_, slotIdx) => {
                const tpl =
                  emptyCardTemplates[slotIdx % emptyCardTemplates.length];
                const item = items[slotIdx];

                // 🔥 로컬스토리지에 저장된 첫 번째 디테일 이미지를 1순위로 채택
                const displayImage =
                  item?.detailImages?.[0] || item?.imageUrl || "";

                return (
                  <div
                    key={`${loopIdx}-${slotIdx}`}
                    onClick={() => {
                      if (item) {
                        navigate(`/itemDetail/${item.id}`);
                      } else {
                        // 🔥 [로그인 가드 추가] 비로그인 시 차단 후 로그인 페이지로 이동
                        const isLoggedIn =
                          localStorage.getItem("fitlog_logged_in") === "true";
                        if (!isLoggedIn) {
                          alert("로그인이 필요한 서비스입니다.");
                          navigate("/login");
                          return;
                        }

                        // 🔥 빈 슬롯 클릭 시 화면 맨 위로 부드럽게 스크롤 이동 후 폼 열기
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setIsFormOpen(true);
                      }
                    }}
                    className={`${tpl.width} ${tpl.height} ${tpl.translate} bg-white border border-gray/50 flex-shrink-0 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 hover:border-accent-pink hover:shadow-md group select-none`}
                  >
                    {item ? (
                      // 1. 아이템이 채워진 슬롯
                      displayImage ? (
                        // 1-A. 첫 번째 디테일 이미지(or imageUrl)가 있을 때
                        <img
                          src={displayImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        // 1-B. 등록된 이미지가 전혀 없을 때
                        <div className="w-full h-full bg-base-pink/60 flex flex-col items-center justify-center gap-2.5 p-4 text-center select-none">
                          <img src={hanger} alt="Hanger" />
                          <span className="caption3 text-accent-pink tracking-tight font-normal line-clamp-2">
                            {item.title}
                          </span>
                        </div>
                      )
                    ) : (
                      // 2. 빈 슬롯 (+ Add Your Item)
                      <>
                        <div
                          className={`${tpl.circle} rounded-full border border-dashed border-accent-pink flex items-center justify-center text-accent-pink font-light mb-2 group-hover:scale-110 transition-transform`}
                        >
                          +
                        </div>
                        <span
                          className={`${tpl.textSize} text-accent-pink tracking-tight`}
                        >
                          Add Your Item
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </ScrollFadeIn>

      {/* 우측 하단 View More 쇼쇼쇽 */}
      <ScrollFadeIn
        delay={150}
        className="w-full mx-auto pr-[50px] sm:pr-[100px] md:pr-[180px] mt-12 flex justify-end"
      >
        <Link
          to="/archive"
          className="display3 hover:!text-accent-pink transition-colors flex items-center gap-2"
        >
          View More
          <MoveRight strokeWidth={1.2} />
        </Link>
      </ScrollFadeIn>
    </section>
  );
}
