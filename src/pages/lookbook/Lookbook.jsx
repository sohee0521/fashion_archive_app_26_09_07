import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoveRight } from "lucide-react";
import Stars from "../../img/stars.png";
import hanger from "../../img/hanger.svg";
import paperBg from "../../img/paper_open.png";

export default function Lookbook() {
  const navigate = useNavigate();

  // 4개 테스트 룩북 데이터 (2개 ~ 6개, Acc 중복 포함)
  const [lookbooks] = useState([
    {
      id: 1,
      lookNo: "LOOK 01",
      title: "어쩌구저쩌구룩",
      tags: ["#Feminine", "#Y2K"],
      items: [
        {
          id: 101,
          category: "Top",
          imageUrl:
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 102,
          category: "Bottom",
          imageUrl:
            "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 103,
          category: "Acc",
          imageUrl:
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=60",
        },
      ],
    },
    {
      id: 2,
      lookNo: "LOOK 02",
      title: "어쩌구저쩌구룩",
      tags: ["#Feminine", "#Y2K"],
      items: [
        {
          id: 201,
          category: "Top",
          imageUrl:
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 202,
          category: "Bottom",
          imageUrl:
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60",
        },
      ],
    },
    {
      id: 3,
      lookNo: "LOOK 03",
      title: "어쩌구저쩌구룩",
      tags: ["#Feminine", "#Y2K"],
      items: [
        {
          id: 301,
          category: "Outer",
          imageUrl:
            "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 302,
          category: "Top",
          imageUrl:
            "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 303,
          category: "Bottom",
          imageUrl:
            "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 304,
          category: "Shoes",
          imageUrl:
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 305,
          category: "Acc",
          imageUrl: "",
        },
      ],
    },
    {
      id: 4,
      lookNo: "LOOK 04",
      title: "어쩌구저쩌구룩",
      tags: ["#Feminine", "#Y2K"],
      items: [
        {
          id: 401,
          category: "Outer",
          imageUrl:
            "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 402,
          category: "Top",
          imageUrl:
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 403,
          category: "Bottom",
          imageUrl:
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 404,
          category: "Shoes",
          imageUrl:
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 405,
          category: "Acc",
          imageUrl:
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 406,
          category: "Acc",
          imageUrl:
            "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=500&auto=format&fit=crop&q=60",
        },
      ],
    },
  ]);

  // 2~6개 개수별 각 아이템의 상대적 위치 (조정 완료된 프리셋 좌표)
  const LOOK_LAYOUT_PRESETS = {
    2: [
      "top-4 left-4", // 좌상단
      "bottom-4 right-4", // 우하단
    ],
    3: [
      "top-[40%] -translate-y-1/2 left-3", // 좌측 1개
      "top-3 right-3", // 우상단
      "bottom-3 right-3", // 우하단
    ],
    4: [
      "top-12 left-4", // 좌상단 (살짝 낮음)
      "bottom-2 left-4", // 좌하단
      "top-2 right-4", // 우상단 (살짝 높음)
      "bottom-12 right-4", // 우하단
    ],
    5: [
      "top-[-10px] left-2", // 상단 좌
      "top-[-10px] right-2", // 상단 우
      "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", // 정중앙
      "bottom-[-10px] left-2", // 하단 좌
      "bottom-[-10px] right-2", // 하단 우
    ],
    6: [
      "top-[-30px] left-1/2 -translate-x-1/2", // 상단 중앙
      "top-[40px] left-[-15px]", // 중간 좌
      "top-[80px] left-[100px] -translate-x-1/2", // 정가운데
      "top-[40px] right-[-5px]", // 중간 우
      "bottom-[-25px] left-3", // 하단 좌
      "bottom-[-25px] right-3", // 하단 우
    ],
  };

  return (
    <div className="w-full min-h-screen bg-white text-black flex flex-col pt-[80px]">
      {/* 1. 상단 타이틀 배너 */}
      <section className="w-full bg-base-pink pt-12 sm:pt-16 pb-10 sm:pb-12 px-6 sm:px-[100px] lg:px-[180px] relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* 타원형 하이라이트 */}
        <div
          className="absolute -left-12 sm:left-4 lg:left-[100px] top-1/2 -translate-y-[45%] w-[380px] h-[190px] rounded-[50%] pointer-events-none select-none z-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.6) 35%, rgba(255, 233, 243, 0) 70%)",
          }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
          <h1 className="display1 text-accent-pink font-normal leading-none italic select-none">
            LookBook
          </h1>
          <span className="body2 text-dark-gray  sm:text-sm md:text-base tracking-tight select-none">
            All your pieces, all in one place.
          </span>
        </div>

        {/* Create New Look 버튼 */}
        <button
          type="button"
          onClick={() => navigate("/newLookbook")}
          className="relative z-10 border border-black px-4  sm:px-5 py-2  bg-none hover:bg-black hover:text-white transition-all duration-200 inline-flex items-center gap-2 sm:gap-3  cursor-pointer shrink-0"
        >
          <span className="display3">Creat New Look</span>
          <MoveRight strokeWidth={1.5} size={20} />
        </button>
      </section>

      {/* 2. 룩북 리스트 영역 */}
      <main className="flex-1 w-full px-[50px]  lg:px-[100px] 2xl:px-[250px] py-[100px] relative">
        {/* 배경 별 에셋 */}
        <img
          src={Stars}
          alt=""
          className="absolute right-[5%] md:right-[20%] top-[180px] w-[180px] md:w-[200px] opacity-80 pointer-events-none select-none z-0"
        />
        <img
          src={Stars}
          alt=""
          className="absolute left-[8%] md:left-[18%] top-[1300px] w-[180px] md:w-[200px] opacity-75 pointer-events-none select-none z-0"
        />

        {/* 룩북 목록 컨테이너 */}
        <div className="w-full relative z-10 flex flex-col gap-14 md:gap-0">
          {lookbooks.map((look, idx) => {
            const isRightSide = idx % 2 === 1;

            return (
              <div
                key={look.id}
                className={`w-full flex items-center justify-center ${
                  isRightSide ? "md:justify-end" : "md:justify-start"
                } ${
                  /* 모바일에서는 겹치지 않고 자연스럽게 떨어지며, md 이상에서만 계단식 오버랩 적용 */
                  idx !== 0 ? "md:-mt-16 lg:-mt-24" : ""
                }`}
              >
                {/* 
                  🔥 모바일: flex-col (종이 아래에 텍스트) + items-center
                  🔥 데스크톱(md 이상): flex-row / flex-row-reverse 유지
                */}
                <div
                  className={`flex flex-col items-center gap-5 sm:gap-6 md:gap-10 lg:gap-14 xl:scale-115 ${
                    isRightSide ? "md:flex-row-reverse" : "md:flex-row"
                  }`}
                >
                  {/* [A] 종이 카드 본체 */}
                  <div
                    onClick={() => navigate(`/newLookbook/${look.id}`)}
                    className="relative w-[280px] sm:w-[310px] aspect-[1/1.36] cursor-pointer group select-none transition-transform duration-300 hover:scale-[1.02] shrink-0"
                  >
                    {/* 종이 배경 PNG */}
                    <img
                      src={paperBg}
                      alt="Lookbook Paper"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md z-0"
                    />

                    {/* 안전 박스 */}
                    <div className="absolute inset-0 z-10 pt-11 pb-6 px-4 sm:px-5 flex flex-col justify-between overflow-hidden">
                      {/* LOOK 번호 헤더 */}
                      <div className="w-full pl-2 pt-1">
                        <span className="display3 text-lg sm:text-xl italic text-black">
                          {look.lookNo}
                        </span>
                      </div>

                      {/* 내부 원형 아이템 (프리셋 맵 렌더링) */}
                      <div className="flex-1 w-full flex items-center justify-center my-auto">
                        <div className="relative w-[210px] h-[230px] select-none">
                          {look.items.map((it, itemIdx) => {
                            const positions =
                              LOOK_LAYOUT_PRESETS[look.items.length] ||
                              LOOK_LAYOUT_PRESETS[6];
                            const positionClass = positions[itemIdx] || "";

                            return (
                              <div
                                key={`${it.id}-${itemIdx}`}
                                className={`absolute flex flex-col items-center gap-1 ${positionClass}`}
                              >
                                <div className="w-[72px] h-[72px] rounded-full bg-white border border-gray/40 overflow-hidden flex items-center justify-center shadow-xs">
                                  {it.imageUrl ? (
                                    <img
                                      src={it.imageUrl}
                                      alt={it.category}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <img
                                      src={hanger}
                                      alt="No item"
                                      className="w-5 h-5 opacity-40"
                                    />
                                  )}
                                </div>
                                <span className="caption3 text-[9px] text-dark-gray font-sans">
                                  {it.category}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* [B] 타이틀 & 태그 (모바일에서는 중앙 정렬, 데스크톱에서는 안쪽 정렬) */}
                  <div
                    className={`flex flex-col items-center text-center gap-2 ${
                      isRightSide
                        ? "md:items-end md:text-right"
                        : "md:items-start md:text-left"
                    }`}
                  >
                    <h3 className="body2 text-base sm:text-lg font-medium tracking-tight text-black">
                      {look.title}
                    </h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {look.tags.map((tag) => (
                        <span
                          key={tag}
                          className="h-[28px] px-3 rounded-full border border-gray/70 text-dark-gray caption3 bg-white inline-flex items-center shadow-2xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 페이지네이션 */}
        <div className="w-full flex justify-center items-center gap-4 mt-20 sm:mt-24 text-xs text-dark-gray select-none">
          <button className="hover:text-black cursor-pointer">&lt;</button>
          <span className="text-black font-medium">1</span>
          <button className="hover:text-black cursor-pointer">&gt;</button>
        </div>
      </main>
    </div>
  );
}
