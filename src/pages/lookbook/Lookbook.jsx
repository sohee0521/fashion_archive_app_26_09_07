import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoveRight, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Stars from "../../img/stars.png";
import hanger from "../../img/hanger.svg";
import paperBg from "../../img/paper_open.png";

// 🔥 1페이지(노트 1권)당 최대 4개 아이템을 배치하는 프리셋
const LOOK_LAYOUT_PRESETS_4 = [
  "top-4 left-4", // 1번: 좌상단
  "top-4 right-4", // 2번: 우상단
  "bottom-4 left-4", // 3번: 좌하단
  "bottom-4 right-4", // 4번: 우하단
];

export default function Lookbook() {
  const navigate = useNavigate();
  const [paginatedLookbooks, setPaginatedLookbooks] = useState([]);

  // 페이지네이션 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // 한 페이지에 보여줄 노트(룩북 카드) 개수

  // 로컬스토리지에서 룩북 목록 및 최신 아카이브 아이템 데이터 로드
  useEffect(() => {
    window.scrollTo(0, 0);
    // 🔒 [추가] 로그인 상태가 아니면 룩북 데이터를 비우고 종료
    const isLoggedIn = localStorage.getItem("fitlog_logged_in") === "true";
    if (!isLoggedIn) {
      setPaginatedLookbooks([]);
      return;
    }
    let archiveItems = [];

    try {
      const savedItems = localStorage.getItem("fitlog_items");
      if (savedItems) {
        archiveItems = JSON.parse(savedItems);
      }
    } catch (err) {
      console.error("아카이브 아이템 로드 실패:", err);
    }

    const savedLookbooks = localStorage.getItem("fitlog_lookbooks");
    if (savedLookbooks) {
      try {
        const parsed = JSON.parse(savedLookbooks);
        if (Array.isArray(parsed)) {
          const expandedPages = [];

          parsed.forEach((lb, index) => {
            const refreshedItems = (lb.items || []).map((it) => {
              const matchedArchiveItem = archiveItems.find(
                (arc) => String(arc.id) === String(it.id),
              );

              const resolvedImage =
                matchedArchiveItem?.detailImages?.[0] ||
                matchedArchiveItem?.imageUrl ||
                it?.detailImages?.[0] ||
                it?.imageUrl ||
                "";

              return {
                ...it,
                imageUrl: resolvedImage,
              };
            });

            // 🔥 핵심: 아이템이 4개를 넘어가면 4개씩 끊어서 별도의 페이지 카드로 분할 생성
            const chunkSize = 4;
            const totalChunks =
              Math.ceil(refreshedItems.length / chunkSize) || 1;

            if (totalChunks === 1) {
              expandedPages.push({
                ...lb,
                uniqueKey: `${lb.id}-page-0`,
                lookNo: `LOOK ${String(index + 1).padStart(2, "0")}`,
                pageIndicator: "",
                items: refreshedItems,
              });
            } else {
              for (let i = 0; i < refreshedItems.length; i += chunkSize) {
                const chunk = refreshedItems.slice(i, i + chunkSize);
                const pageNum = Math.floor(i / chunkSize) + 1;
                expandedPages.push({
                  ...lb,
                  uniqueKey: `${lb.id}-page-${pageNum}`,
                  lookNo: `LOOK ${String(index + 1).padStart(2, "0")}`,
                  pageIndicator: ` (${pageNum}/${totalChunks})`, // 예: (1/2)
                  items: chunk,
                });
              }
            }
          });

          setPaginatedLookbooks(expandedPages);
          setCurrentPage(1);
          return;
        }
      } catch (err) {
        console.error("룩북 로드 실패:", err);
      }
    }
    setPaginatedLookbooks([]);
  }, []);

  // 페이지네이션 계산 로직
  const totalPages = Math.ceil(paginatedLookbooks.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLookbooks = paginatedLookbooks.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-black flex flex-col pt-[80px]">
      {/* 1. 상단 타이틀 배너 */}
      <section className="w-full bg-base-pink pt-12 sm:pt-16 pb-10 sm:pb-12 px-6 sm:px-[100px] lg:px-[180px] relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div
          className="absolute -left-5 sm:left-15 lg:left-[100px] top-1/3 sm:top-1/2 -translate-y-[45%] w-[200px] h-[100px] md:w-[250px] md:h-[120px] lg:w-[360px] lg:h-[180px] rounded-[50%] pointer-events-none select-none z-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.6) 35%, rgba(255, 233, 243, 0) 70%)",
          }}
        />

        <div className="relative z-10 flex items-center gap-[10px] sm:gap-4">
          <h1 className="display1 text-accent-pink font-normal leading-none italic select-none">
            LookBook
          </h1>
          <span className="body2 text-dark-gray sm:text-sm md:text-base tracking-tight select-none">
            All your pieces, all in one place.
          </span>
        </div>

        {/* Create New Look 버튼 */}
        <button
          type="button"
          onClick={() => navigate("/newLookbook")}
          className="relative z-10 border border-black px-4 sm:px-5 py-2 bg-none hover:bg-black hover:text-white transition-all duration-200 inline-flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0"
        >
          <span className="display3">Create New Look</span>
          <MoveRight strokeWidth={1.5} size={20} />
        </button>
      </section>

      {/* 2. 룩북 리스트 영역 */}
      <main className="flex-1 w-full px-[50px] lg:px-[100px] 2xl:px-[250px] py-[100px] relative">
        {/* 배경 별 에셋 */}
        <img
          src={Stars}
          alt=""
          className="absolute right-[5%] md:right-[20%] top-[2%] sm:top-[10%] w-[180px] md:w-[200px] opacity-80 pointer-events-none select-none z-0"
        />
        <img
          src={Stars}
          alt=""
          className="absolute left-[8%] md:left-[18%] top-[87%] w-[180px] md:w-[200px] opacity-75 pointer-events-none select-none z-0"
        />

        {/* 데이터가 없을 때 표시되는 빈 상태 */}
        {paginatedLookbooks.length === 0 ? (
          <div className="relative z-10 w-full py-24 flex flex-col items-center justify-center gap-4 text-center">
            <div>
              <p className="caption1 font-medium text-accent-pink">
                아직 등록된 룩이 없어요.
              </p>
              <p className="caption3 text-dark-gray ">
                옷장의 아이템을 모아 나만의 코디를 완성해보세요!
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/newLookbook")}
              className="border border-black px-6 py-2.5 display3 inline-flex items-center gap-2 hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              <Plus size={18} strokeWidth={1.5} />
              <span className="caption3">첫 룩북 만들기</span>
            </button>
          </div>
        ) : (
          <>
            {/* 룩북 목록 컨테이너 */}
            <div className="w-full relative z-10 flex flex-col gap-14 md:gap-0">
              {currentLookbooks.map((look, idx) => {
                const isRightSide = idx % 2 === 1;

                return (
                  <div
                    key={look.uniqueKey}
                    className={`w-full flex items-center justify-center ${
                      isRightSide ? "md:justify-end" : "md:justify-start"
                    } ${idx !== 0 ? "md:-mt-16 lg:-mt-24" : ""}`}
                  >
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
                          <div className="w-full pl-2 pt-1 flex justify-between items-center pr-2">
                            <span className="display3 text-lg sm:text-[24px] pl-[7px] italic text-black">
                              {look.lookNo}
                              <span className="text-xs text-dark-gray ml-1 font-sans font-normal">
                                {look.pageIndicator}
                              </span>
                            </span>
                          </div>

                          {/* 내부 원형 아이템 (4개 프리셋 렌더링) */}
                          <div className="flex-1 w-full flex items-center justify-center my-auto">
                            <div className="relative w-[210px] h-[230px] select-none">
                              {(look.items || []).map((it, itemIdx) => {
                                const positionClass =
                                  LOOK_LAYOUT_PRESETS_4[itemIdx] || "";

                                return (
                                  <div
                                    key={`${it.id}-${itemIdx}`}
                                    className={`absolute flex flex-col items-center gap-1 ${positionClass}`}
                                  >
                                    <div className="w-[66px] h-[66px] rounded-full bg-white border border-gray/40 overflow-hidden flex items-center justify-center shadow-xs">
                                      {it.imageUrl ? (
                                        <img
                                          src={it.imageUrl}
                                          alt={it.category || "Item"}
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
                                    <span className="caption3 text-dark-gray font-sans">
                                      {it.category}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* [B] 타이틀 & 태그 */}
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
                          {(look.tags || []).map((tag, tagIdx) => (
                            <span
                              key={tagIdx}
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

            {/* 하단 페이지네이션 번호 제어 */}
            {totalPages > 1 && (
              <div className="w-full flex justify-center items-center gap-4 mt-20 sm:mt-24 text-xs text-dark-gray select-none">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`cursor-pointer ${currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:text-black"}`}
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handlePageChange(num)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                          currentPage === num
                            ? "bg-black text-white font-medium"
                            : "hover:bg-stone-100 text-black"
                        }`}
                      >
                        {num}
                      </button>
                    ),
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`cursor-pointer ${currentPage === totalPages ? "opacity-30 cursor-not-allowed" : "hover:text-black"}`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
