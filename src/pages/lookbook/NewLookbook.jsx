import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Edit2,
  Plus,
  X,
  ChevronRight,
  Trash2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Stars from "../../img/stars.png";
import hanger from "../../img/hanger.svg";
import pose from "../../img/pose.png";

const SLOT_COORDINATES = [
  { id: 0, pos: "top-[10%] left-[8%]" },
  { id: 1, pos: "top-[40%] left-[-4%]" },
  { id: 2, pos: "top-[70%] left-[5%]" },
  { id: 3, pos: "top-[70%] right-[5%]" },
  { id: 4, pos: "top-[40%] right-[-4%]" },
  { id: 5, pos: "top-[10%] right-[8%]" },
];

const CATEGORIES = ["All", "Top", "Bottom", "Outer", "Shoes", "Acc"];

const getMainDetailImage = (targetItem) => {
  if (!targetItem) return "";
  return targetItem.detailImages?.[0] || targetItem.imageUrl || "";
};

export default function NewLookbook() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // 탭 가로 드래그 스크롤
  const tabScrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - tabScrollRef.current.offsetLeft);
    setScrollLeft(tabScrollRef.current.scrollLeft);
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - tabScrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    tabScrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lookTitle, setLookTitle] = useState("Unnamed");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [archiveItems, setArchiveItems] = useState([]);

  // 🔥 룩북 저장 모달 상태 (null | "FIRST" | "SUBSEQUENT")
  const [modalType, setModalType] = useState(null);

  // 로컬 스토리지 불러오기
  useEffect(() => {
    const savedArchive = localStorage.getItem("fitlog_items");
    let parsedArchiveList = [];
    if (savedArchive) {
      try {
        const parsed = JSON.parse(savedArchive);
        if (Array.isArray(parsed)) {
          parsedArchiveList = parsed;
          setArchiveItems(parsed);
        }
      } catch (e) {
        console.error("아이템 로드 실패:", e);
      }
    } else {
      setArchiveItems([]);
    }

    if (isEditMode) {
      const savedLookbooks = localStorage.getItem("fitlog_lookbooks");
      if (savedLookbooks) {
        try {
          const parsed = JSON.parse(savedLookbooks);
          const target = parsed.find((lb) => String(lb.id) === String(id));
          if (target) {
            setLookTitle(target.title || "LOOK");

            const refreshedItems = (target.items || []).map((it) => {
              const matched = parsedArchiveList.find(
                (arc) => String(arc.id) === String(it.id),
              );
              return {
                ...(matched || it),
                imageUrl: getMainDetailImage(matched) || getMainDetailImage(it),
              };
            });
            setSelectedItems(refreshedItems);
          }
        } catch (e) {
          console.error("룩북 로드 실패:", e);
        }
      }
    }
  }, [id, isEditMode]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return archiveItems;
    return archiveItems.filter((it) => it.category === selectedCategory);
  }, [archiveItems, selectedCategory]);

  const topStyleTags = useMemo(() => {
    if (selectedItems.length === 0) return ["#StyleTag1", "#StyleTag2"];

    const countMap = {};
    selectedItems.forEach((it) => {
      const styles = Array.isArray(it.styles)
        ? it.styles
        : it.style
          ? [it.style]
          : [];
      styles.forEach((style) => {
        countMap[style] = (countMap[style] || 0) + 1;
      });
    });

    const sortedTags = Object.keys(countMap).sort(
      (a, b) => countMap[b] - countMap[a],
    );

    const first = sortedTags[0] ? `#${sortedTags[0]}` : "#StyleTag1";
    const second = sortedTags[1] ? `#${sortedTags[1]}` : "#StyleTag2";
    return [first, second];
  }, [selectedItems]);

  // 룩북에 드롭으로 아이템 추가
  const handleAddItemByDrop = (item) => {
    if (selectedItems.some((s) => String(s.id) === String(item.id))) {
      alert("이미 이 룩북에 추가된 아이템입니다.");
      return;
    }
    if (selectedItems.length >= 6) {
      alert("아이템은 최대 6개까지 배치할 수 있습니다.");
      return;
    }
    const itemWithMainImage = {
      ...item,
      imageUrl: getMainDetailImage(item),
    };
    setSelectedItems((prev) => [...prev, itemWithMainImage]);
  };

  const handleRemoveItem = (indexToRemove) => {
    setSelectedItems((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;
    try {
      const item = JSON.parse(data);
      handleAddItemByDrop(item);
    } catch (err) {
      console.error("드롭 파싱 실패", err);
    }
  };

  // 🔥 룩북 저장 핸들러 + 첫 저장 여부 판별
  const handleSaveLookbook = () => {
    if (selectedItems.length < 2) {
      alert("최소 2개 이상의 아이템을 추가해주세요.");
      return;
    }

    try {
      const existing = JSON.parse(
        localStorage.getItem("fitlog_lookbooks") || "[]",
      );
      const nextNo = isEditMode
        ? id
        : String(existing.length + 1).padStart(2, "0");

      const lightweightItems = selectedItems.map((it) => ({
        id: it.id,
        title: it.title || it.name || "Untitled",
        category: it.category || "Top",
      }));

      const newEntry = {
        id: isEditMode ? Number(id) : Date.now(),
        lookNo: `LOOK ${nextNo}`,
        title: (lookTitle && lookTitle.trim()) || "무제 룩",
        tags: topStyleTags.filter((t) => !t.includes("StyleTag")),
        items: lightweightItems,
      };

      let updated;
      if (isEditMode) {
        updated = existing.map((lb) =>
          String(lb.id) === String(id) ? newEntry : lb,
        );
      } else {
        updated = [newEntry, ...existing];
      }

      localStorage.setItem("fitlog_lookbooks", JSON.stringify(updated));

      // 첫 룩북인지 여부에 따라 모달 타입 분기
      if (updated.length === 1 && !isEditMode) {
        setModalType("FIRST");
      } else {
        setModalType("SUBSEQUENT");
      }
    } catch (err) {
      console.error("룩북 저장 실패:", err);
      alert("저장 실패: " + err.message);
    }
  };

  // 새 룩북 작성 캔버스 초기화
  const handleResetForNewLookbook = () => {
    setModalType(null);
    setSelectedItems([]);
    setLookTitle("Unnamed");
    if (isEditMode) {
      navigate("/newLookbook");
    }
  };

  const handleDeleteLookbook = () => {
    if (!window.confirm("룩북을 삭제하시겠습니까?")) return;

    try {
      const existing = JSON.parse(
        localStorage.getItem("fitlog_lookbooks") || "[]",
      );
      const updated = existing.filter((lb) => String(lb.id) !== String(id));
      localStorage.setItem("fitlog_lookbooks", JSON.stringify(updated));
      navigate("/lookbook");
    } catch (err) {
      console.error("룩북 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="w-full lg:px-[100px] xl:px-[180px] px-[50px] min-h-screen bg-base-pink text-black flex flex-col pt-[80px]">
      {/* 1. 상단 타이틀 */}
      <section className="relative w-full pt-10 pb-6 flex flex-col gap-6">
        <div className="flex flex-col items-start gap-1">
          <h1 className="z-10 display1 text-accent-pink font-normal leading-none italic select-none">
            LookBook
          </h1>
          <span className="z-10 body4 text-dark-gray select-none">
            All your pieces, all in one place.
          </span>
          <div
            className="absolute scale-50 md:scale-75 lg:scale-100 left-[-110px] sm:left-[-100px] lg:left-[-50px] top-1/2 -translate-y-[55%] w-[360px] h-[180px] rounded-[50%] pointer-events-none select-none z-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.6) 35%, rgba(255, 233, 243, 0) 70%)",
            }}
          />
        </div>

        <div className="flex justify-end items-center gap-3 text-dark-gray pr-1 select-none">
          <span
            onClick={() => navigate("/lookbook")}
            className="hover:text-black cursor-pointer body4"
          >
            LookBook
          </span>
          <ChevronRight size={20} strokeWidth={1.2} />
          <span className="body4 text-black font-medium">
            {isEditMode ? "Edit" : "New"}
          </span>
        </div>
      </section>

      {/* 2. 메인 워크스페이스 */}
      <main className="flex-1 w-full pb-24 flex flex-col md:flex-row gap-6 lg:gap-8 items-start justify-center">
        {/* [좌측]: My Item 보관함 */}
        <div
          className="
            w-full md:w-[200px] lg:w-[250px] xl:w-[320px] 
            h-auto md:h-[800px] 
            bg-white border border-[#EBEBEB] rounded-sm p-5 sm:p-6 
            flex flex-col shrink-0 shadow-2xs
          "
        >
          <div className="flex items-baseline justify-between pb-3 shrink-0 select-none">
            <h2 className="display2 text-black">My Item</h2>
          </div>

          <div
            ref={tabScrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseUpOrLeave}
            onMouseUp={handleMouseUpOrLeave}
            onMouseMove={handleMouseMove}
            className={`flex items-center gap-1.5 pb-4 overflow-x-auto border-b border-[#F0F0F0] shrink-0 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  if (!isDragging) setSelectedCategory(cat);
                }}
                className={`px-2.5 py-1 rounded-full transition-all select-none shrink-0 ${
                  selectedCategory === cat
                    ? "bg-black text-white font-medium"
                    : "text-dark-gray hover:text-black"
                }`}
              >
                <div className="body4 pointer-events-none">{cat}</div>
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-0 pt-5 md:overflow-y-auto no-scrollbar">
            {filteredItems.length === 0 ? (
              <div className="w-full h-48 flex flex-col items-center justify-center gap-3 text-center px-2">
                <span className="body4 text-dark-gray">
                  {archiveItems.length === 0
                    ? "등록된 옷이 없습니다."
                    : "해당 카테고리에 아이템이 없습니다."}
                </span>
                {archiveItems.length === 0 && (
                  <button
                    type="button"
                    onClick={() => navigate("/archive")}
                    className="border border-black px-3 py-1.5 body4 hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    옷 등록하러 가기
                  </button>
                )}
              </div>
            ) : (
              <div
                className="
                  flex flex-row overflow-x-auto gap-3 pb-2 no-scrollbar
                  md:grid md:grid-cols-1 md:overflow-x-visible md:gap-3.5
                  lg:grid-cols-2
                "
              >
                {filteredItems.map((item) => {
                  const displayImage = getMainDetailImage(item);
                  const isUsed = selectedItems.some(
                    (selected) => String(selected.id) === String(item.id),
                  );

                  return (
                    <div
                      key={item.id}
                      draggable={!isUsed}
                      onDragStart={(e) => !isUsed && handleDragStart(e, item)}
                      onClick={() => navigate(`/itemDetail/${item.id}`)}
                      className={`
                        flex flex-col items-center gap-1.5 select-none shrink-0
                        w-[96px] sm:w-[104px] md:w-full transition-all
                        ${
                          isUsed
                            ? "opacity-40 cursor-not-allowed filter grayscale"
                            : "cursor-pointer group hover:opacity-90"
                        }
                      `}
                      title={
                        isUsed
                          ? "이미 사용된 아이템입니다"
                          : "클릭: 상세페이지 / 드래그: 룩북 추가"
                      }
                    >
                      <div className="relative w-full aspect-square bg-[#F5F5F7] border border-[#EBEBEB] rounded-sm overflow-hidden flex items-center justify-center shadow-2xs">
                        {displayImage ? (
                          <img
                            src={displayImage}
                            alt={item.title || item.name}
                            className={`w-full h-full object-cover transition-transform duration-300 pointer-events-none ${
                              !isUsed ? "group-hover:scale-105" : ""
                            }`}
                          />
                        ) : (
                          <img
                            src={hanger}
                            alt="No item"
                            className="w-7 h-7 opacity-30 pointer-events-none"
                          />
                        )}

                        {isUsed && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                            <span className="caption3  text-white px-1.5 py-0.5 rounded bg-black/60">
                              used
                            </span>
                          </div>
                        )}
                      </div>

                      <span className="caption3 text-dark-gray truncate max-w-full text-center">
                        {item.title || item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* [우측]: 룩북 조립 캔버스 */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="
            w-full md:flex-1 md:min-w-[360px] max-w-[720px] 
            bg-white border border-[#EBEBEB] rounded-sm p-6 sm:p-8 
            flex flex-col justify-between relative shadow-2xs 
            min-h-[800px] overflow-hidden shrink-0
          "
        >
          <div className="w-full flex items-center justify-between relative z-20">
            <div className="flex items-center gap-[10px]">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={lookTitle}
                  autoFocus
                  onChange={(e) => setLookTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setIsEditingTitle(false)
                  }
                  className="border-b border-black outline-none bg-transparent body2"
                />
              ) : (
                <span
                  onClick={() => setIsEditingTitle(true)}
                  className="caption2 text-black cursor-pointer select-none"
                >
                  {lookTitle}
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsEditingTitle((prev) => !prev)}
                className="text-dark-gray hover:text-black transition-colors cursor-pointer"
              >
                <Edit2 size={18} strokeWidth={2} />
              </button>
            </div>

            <img
              src={Stars}
              alt=""
              className="absolute top-[10px] right-0 w-[200px] opacity-80 pointer-events-none select-none"
            />
          </div>

          {/* 메인 스테이지 */}
          <div className="relative flex-1 w-full max-w-[380px] sm:max-w-[420px] mx-auto my-4 flex items-center justify-center select-none">
            <div className="w-[300px]">
              <img src={pose} alt="" />
            </div>

            {/* U자형 6개 슬롯 */}
            {SLOT_COORDINATES.map((slot, index) => {
              const assignedItem = selectedItems[index];
              const isNextSlot =
                index === selectedItems.length && selectedItems.length < 6;

              if (assignedItem) {
                const slotImage = getMainDetailImage(assignedItem);

                return (
                  <div
                    key={`slot-${slot.id}`}
                    className={`absolute ${slot.pos} z-10 flex flex-col items-center group`}
                  >
                    <div className="relative w-[72px] h-[72px] sm:w-[100px] sm:h-[100px] rounded-full bg-white border border-gray/40 overflow-hidden flex items-center justify-center shadow-xs">
                      {slotImage ? (
                        <img
                          src={slotImage}
                          alt={assignedItem.title || assignedItem.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={hanger}
                          alt="No item"
                          className="w-6 h-6 sm:w-8 sm:h-8 opacity-40 pointer-events-none"
                        />
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(index);
                        }}
                        className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X size={18} strokeWidth={2} />
                      </button>
                    </div>

                    <span className="caption3 text-dark-gray mt-1">
                      {assignedItem.category}
                    </span>
                  </div>
                );
              }

              if (isNextSlot) {
                return (
                  <div
                    key={`slot-${slot.id}`}
                    className={`absolute ${slot.pos} z-10 flex flex-col items-center animate-pulse`}
                  >
                    <div className="w-[66px] h-[66px] sm:w-[74px] sm:h-[74px] rounded-full border border-dashed border-[#FF85C0] flex items-center justify-center text-[#FF85C0] bg-white/50 backdrop-blur-2xs">
                      <Plus size={20} strokeWidth={1.5} />
                    </div>
                    <span className="body4 text-[#FF85C0] mt-1 whitespace-nowrap">
                      Drop Here
                    </span>
                  </div>
                );
              }

              return null;
            })}

            {/* 최다 스타일 태그 2개 */}
            <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 z-10 flex flex-col gap-1.5 items-center">
              {topStyleTags.map((tag, idx) => (
                <span
                  key={`top-tag-${idx}`}
                  className="px-4 py-1 rounded-full border border-[#D1D1D6] bg-white body4 text-dark-gray shadow-2xs select-none"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 하단 버튼 영역 */}
          <div
            className={`w-full flex items-center pt-2 z-20 ${
              isEditMode ? "justify-between" : "justify-end"
            }`}
          >
            {isEditMode && (
              <button
                type="button"
                onClick={handleDeleteLookbook}
                className="text-red-500 px-3.5 py-2 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 size={16} strokeWidth={1.8} />
                <span className="body4 font-medium">Delete</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveLookbook}
              className="bg-[#1C1C1E] text-white px-7 py-2.5 tracking-wider hover:bg-black transition-all cursor-pointer rounded-xs"
            >
              <div className="body4">{isEditMode ? "Save" : "Create"}</div>
            </button>
          </div>
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          🔥 룩북 저장 모달 (문구 분기 + 버튼 통일: 아이템 추가하기 vs 새로운 룩북 만들기)
      ───────────────────────────────────────────────────────────── */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-pink-100 flex flex-col items-center text-center select-none">
            {/* 상단 아이콘 & 문구 분기 */}
            {modalType === "FIRST" ? (
              <>
                <div className="w-12 h-12 rounded-full bg-base-pink/50 text-accent-pink flex items-center justify-center mb-4">
                  <Sparkles size={26} strokeWidth={1.8} />
                </div>
                <h3 className="body2 font-bold text-black mb-1.5">
                  첫 번째 룩북을 완성했어요!
                </h3>
                <p className="body4 text-dark-gray mb-6">
                  나만의 첫 코디가 저장되었어요.
                  <br />새 아이템을 추가하거나 새로운 룩북을 만들어보세요.
                </p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-base-pink/50 text-accent-pink flex items-center justify-center mb-4">
                  <CheckCircle2 size={26} strokeWidth={2} />
                </div>
                <h3 className="body2 font-bold text-black mb-1.5">
                  룩북이 저장되었어요!
                </h3>
                <p className="body4 text-dark-gray mb-6">
                  새로운 코디가 성공적으로 아카이브되었습니다.
                  <br />새 아이템을 추가하거나 또 다른 룩북을 만들어보세요.
                </p>
              </>
            )}

            {/* 🔥 통일된 2개 버튼: 1. 아이템 추가하기 (/home) / 2. 새로운 룩북 만들기 */}
            <div className="flex gap-2.5 w-full">
              <button
                type="button"
                onClick={() => {
                  setModalType(null);
                  navigate("/home");
                }}
                className="flex-1 py-2.5 rounded-full border border-[#EBEBEB] text-dark-gray body4 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                아이템 추가하기
              </button>
              <button
                type="button"
                onClick={handleResetForNewLookbook}
                className="flex-1 py-2.5 rounded-full bg-black text-white body4 font-medium flex items-center justify-center gap-1.5 hover:bg-black/85 transition-colors cursor-pointer shadow-sm"
              >
                <span>새로운 룩북 만들기</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
