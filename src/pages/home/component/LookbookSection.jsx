import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PaperOpen from "../../../img/paper_open.png";
import PaperClose from "../../../img/paper_close.png";
import Stars from "../../../img/stars.png";
import hanger from "../../../img/hanger.svg";
import { ChevronLeft, ChevronRight, MoveRight, Plus } from "lucide-react";

// 2~6개 개수별 각 아이템의 상대적 위치 (w-[180px] h-[200px] 축소 기준)
const LOOK_LAYOUT_PRESETS = {
  2: ["top-5 left-4", "bottom-5 right-4"],
  3: ["top-[50%] -translate-y-1/2 left-2", "top-2 right-4", "bottom-2 right-4"],
  4: ["top-8 left-2", "bottom-2 left-2", "top-2 right-3", "bottom-8 right-3"],
  5: [
    "top-0 left-1",

    "top-0 right-1",

    "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",

    "bottom-0 left-1",

    "bottom-0 right-1",
  ],
  6: [
    "top-[-15px] left-1/2 -translate-x-1/2",

    "top-[35px] left-[-5px]",

    "top-[90px] left-[100px] -translate-x-1/2",

    "top-[35px] right-[-5px]",

    "bottom-[-5px] left-2",

    "bottom-[-5px] right-2",
  ],
};

const getMainDetailImage = (targetItem) => {
  if (!targetItem) return "";
  return targetItem.detailImages?.[0] || targetItem.imageUrl || "";
};

export default function LookbookSection() {
  const navigate = useNavigate();
  const [looks, setLooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [turningDirection, setTurningDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // 로컬스토리지에서 실제 생성된 룩북 및 아이템 로드
  useEffect(() => {
    let archiveItems = [];
    try {
      const savedItems = localStorage.getItem("fitlog_items");
      if (savedItems) archiveItems = JSON.parse(savedItems);
    } catch (e) {
      console.error(e);
    }

    try {
      const savedLbs = localStorage.getItem("fitlog_lookbooks");
      if (savedLbs) {
        const parsed = JSON.parse(savedLbs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const formatted = parsed.map((lb, idx) => {
            const refreshedItems = (lb.items || []).map((it) => {
              const matched = archiveItems.find(
                (arc) => String(arc.id) === String(it.id),
              );
              return {
                ...it,
                imageUrl: getMainDetailImage(matched) || getMainDetailImage(it),
              };
            });

            return {
              ...lb,
              lookNo: `LOOK ${String(idx + 1).padStart(2, "0")}`,
              items: refreshedItems,
            };
          });

          setLooks(formatted);
          setCurrentIndex(0);
          return;
        }
      }
    } catch (err) {
      console.error("룩북 로드 실패:", err);
    }
    setLooks([]);
  }, []);

  const handleNext = () => {
    if (isAnimating || looks.length <= 1) return;
    setIsAnimating(true);
    setTurningDirection("next");

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % looks.length);
      setTurningDirection(null);
      setIsAnimating(false);
    }, 280);
  };

  const handlePrev = () => {
    if (isAnimating || looks.length <= 1) return;
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
          View All Looks
          <MoveRight strokeWidth={1.2} />
        </Link>
      </div>

      {/* 우측 룩북 인터랙션 뷰어 */}
      <div className="relative flex items-center gap-4 sm:gap-6 [perspective:1000px]">
        {/* 이전 버튼 (룩북이 2개 이상일 때만 활성화) */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={isAnimating || looks.length <= 1}
          className={`w-[40px] h-[40px] bg-white flex justify-center items-center rounded-full shadow-sm transition-all z-20 shrink-0 ${
            looks.length > 1
              ? "hover:scale-105 active:scale-95 hover:bg-base-pink/40 cursor-pointer"
              : "opacity-30 cursor-not-allowed"
          }`}
        >
          <ChevronLeft strokeWidth={1.2} size={26} className="text-black" />
        </button>

        {/* 메인 종이 노트 컨테이너 (종이 + 바깥 하단 타이틀 세로 배치) */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-[300px] h-[405px] flex items-center justify-center select-none">
            {/* 뒤에 겹쳐 있는 대기용 종이 효과 */}
            <div className="absolute inset-0 w-full h-full rotate-[-2deg] scale-[0.98] opacity-60 pointer-events-none">
              <img
                src={PaperOpen}
                alt=""
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>

            {/* 실제 페이지 카드 (넘길 때 회전 애니메이션) */}
            <div
              key={currentLook ? currentLook.id : "empty"}
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

              {/* 내부 내용 */}
              <div className="relative z-10 w-full h-full pt-10 pb-7 px-6 flex flex-col justify-between items-center text-center overflow-hidden">
                {looks.length === 0 ? (
                  // 등록된 룩북이 없을 때
                  <div className="w-full h-full flex flex-col items-center justify-between py-2">
                    <div className="w-full flex justify-start">
                      <span className="display3 text-xl italic text-black">
                        LOOK 01
                      </span>
                    </div>

                    <div
                      onClick={() => navigate("/newLookbook")}
                      className="flex flex-col items-center justify-center gap-2 cursor-pointer group my-auto"
                    >
                      <div className="w-11 h-11 rounded-full border border-dashed border-accent-pink flex items-center justify-center text-accent-pink group-hover:scale-110 transition-transform">
                        <Plus size={22} strokeWidth={1.5} />
                      </div>
                      <span className="caption3 text-xs text-accent-pink font-sans">
                        Create Your First Look
                      </span>
                    </div>

                    <div className="h-4" />
                  </div>
                ) : (
                  // 등록된 룩북이 있을 때
                  <div
                    onClick={() => navigate(`/newLookbook/${currentLook.id}`)}
                    className="w-full h-full flex flex-col pb-[30px] justify-between items-center cursor-pointer"
                  >
                    {/* LOOK 번호 헤더 */}
                    <div className="w-full flex justify-start pl-1 pt-1">
                      <span className="display3 text-xl italic tracking-wide text-black">
                        {currentLook?.lookNo}
                      </span>
                    </div>

                    {/* 미니 원형 아이템 캔버스 프리뷰 */}
                    <div className="relative w-[200px] h-[240px]  flex items-center justify-center select-none">
                      {(currentLook?.items || []).map((it, itemIdx) => {
                        const positions =
                          LOOK_LAYOUT_PRESETS[currentLook.items.length] ||
                          LOOK_LAYOUT_PRESETS[6];
                        const positionClass = positions[itemIdx] || "";

                        return (
                          <div
                            key={`${it.id}-${itemIdx}`}
                            className={`absolute flex flex-col items-center gap-0.5 ${positionClass}`}
                          >
                            <div className="w-[68px] h-[68px] rounded-full bg-white border border-gray/40 overflow-hidden flex items-center justify-center shadow-xs">
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
                                  className="w-4 h-4 opacity-40"
                                />
                              )}
                            </div>
                            <span className="caption3 text-[12px] text-dark-gray font-sans">
                              {it.category}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 룩북 타이틀 */}
          <div className="w-full flex flex-col items-center text-center gap-1 select-none">
            <span className="body3 font-medium text-black truncate max-w-[240px]">
              {currentLook ? currentLook.title : "No looks created yet"}
            </span>
          </div>
        </div>

        {/* 다음 버튼 (룩북이 2개 이상일 때만 활성화) */}
        <button
          type="button"
          onClick={handleNext}
          disabled={isAnimating || looks.length <= 1}
          className={`w-[40px] h-[40px] bg-white flex justify-center items-center rounded-full shadow-sm transition-all z-20 shrink-0 ${
            looks.length > 1
              ? "hover:scale-105 active:scale-95 hover:bg-base-pink/40 cursor-pointer"
              : "opacity-30 cursor-not-allowed"
          }`}
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
