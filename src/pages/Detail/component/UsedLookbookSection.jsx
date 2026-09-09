import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import paperBg from "../../../img/paper_open.png";
import hanger from "../../../img/hanger.svg";

const LOOK_LAYOUT_PRESETS = {
  2: ["top-2 left-2", "bottom-2 right-2"],
  3: ["top-[40%] -translate-y-1/2 left-1", "top-2 right-2", "bottom-2 right-2"],
  4: ["top-5 left-3", "bottom-0 left-3", "top-0 right-3", "bottom-5 right-3"],
  5: [
    "top-0 left-1",
    "top-0 right-1",
    "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "bottom-0 left-1",
    "bottom-0 right-1",
  ],
  6: [
    "top-[-10px] left-1/2 -translate-x-1/2",
    "top-[30px] left-[-6px]",
    "top-[55px] left-[75px] -translate-x-1/2",
    "top-[30px] right-[-6px]",
    "bottom-[-5px] left-1.5",
    "bottom-[-5px] right-1.5",
  ],
};

const getMainDetailImage = (targetItem) => {
  if (!targetItem) return "";
  return targetItem.detailImages?.[0] || targetItem.imageUrl || "";
};

export default function UsedLookbookSection({ lookbooks = [] }) {
  const navigate = useNavigate();

  // 🔥 마우스 드래그 가로 스크롤 상태 관리
  const scrollRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // 드래그 가속도 계수

    if (Math.abs(walk) > 5) {
      setHasDragged(true); // 5px 이상 움직이면 드래그로 판정 (클릭 방지)
    }
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  const enrichedLookbooks = useMemo(() => {
    let archiveItems = [];
    try {
      const savedItems = localStorage.getItem("fitlog_items");
      if (savedItems) archiveItems = JSON.parse(savedItems);
    } catch (e) {
      console.error("아이템 로드 실패:", e);
    }

    return lookbooks.map((lb, index) => {
      const formattedLookNo = `LOOK ${String(index + 1).padStart(2, "0")}`;

      const refreshedItems = (lb.items || []).map((it) => {
        const matched = archiveItems.find(
          (arc) => String(arc.id) === String(it.id),
        );
        return {
          ...it,
          imageUrl: getMainDetailImage(matched) || getMainDetailImage(it) || "",
        };
      });

      return {
        ...lb,
        lookNo: formattedLookNo,
        items: refreshedItems,
      };
    });
  }, [lookbooks]);

  return (
    <div className="w-full flex flex-col gap-6 pt-6 border-t border-gray/30 select-none">
      <h2 className="display2 text-accent-pink italic select-none">
        Used LookBook
      </h2>

      {enrichedLookbooks.length === 0 ? (
        <div className="w-full py-12 flex flex-col items-center justify-center text-center text-dark-gray">
          <span className="body4">
            이 아이템을 사용해 만든 룩북이 아직 없습니다.
          </span>
        </div>
      ) : (
        /* 🔥 가로 드래그 스크롤 컨테이너 */
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`w-full flex items-start gap-8 overflow-x-auto pb-4 pt-2 no-scrollbar ${
            isMouseDown ? "cursor-grabbing select-none" : "cursor-grab"
          }`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {enrichedLookbooks.map((lb) => (
            <div
              key={lb.id}
              onClick={() => {
                // 드래그 중이 아닐 때만 상세 이동
                if (!hasDragged) {
                  navigate(`/newLookbook/${lb.id}`);
                }
              }}
              className="flex flex-col items-center gap-3.5 shrink-0 group"
            >
              {/* 종이 카드 본체 */}
              <div className="relative w-[200px] sm:w-[220px] aspect-[1/1.36] transition-transform duration-300 group-hover:scale-105 shrink-0 pointer-events-none">
                <img
                  src={paperBg}
                  alt={lb.title}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md"
                />

                <div className="absolute inset-0 pt-8 pb-5 px-4 flex flex-col justify-between overflow-hidden">
                  {/* LOOK 헤더 */}
                  <div className="w-full pl-2 pt-0.5">
                    <span className="display3 text-base italic text-black">
                      {lb.lookNo}
                    </span>
                  </div>

                  {/* 미니 원형 아이템 캔버스 */}
                  <div className="relative w-[150px] h-[170px] mx-auto my-auto flex items-center justify-center select-none">
                    {(lb.items || []).map((it, itemIdx) => {
                      const positions =
                        LOOK_LAYOUT_PRESETS[lb.items.length] ||
                        LOOK_LAYOUT_PRESETS[6];
                      const positionClass = positions[itemIdx] || "";

                      return (
                        <div
                          key={`${it.id}-${itemIdx}`}
                          className={`absolute flex flex-col items-center gap-0.5 ${positionClass}`}
                        >
                          <div className="w-[46px] h-[46px] sm:w-[50px] sm:h-[50px] rounded-full bg-white border border-gray/40 overflow-hidden flex items-center justify-center shadow-xs">
                            {it.imageUrl ? (
                              <img
                                src={it.imageUrl}
                                alt={it.category || "Item"}
                                className="w-full h-full object-cover pointer-events-none"
                              />
                            ) : (
                              <img
                                src={hanger}
                                alt="No item"
                                className="w-4 h-4 opacity-40 pointer-events-none"
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

                  <div className="h-2" />
                </div>
              </div>

              {/* 하단 룩북 타이틀 */}
              <span className="body3 font-medium text-black group-hover:text-accent-pink transition-colors truncate max-w-[200px]">
                {lb.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
