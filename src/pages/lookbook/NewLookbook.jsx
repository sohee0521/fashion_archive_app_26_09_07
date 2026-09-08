import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit2, Plus, X, ChevronRight } from "lucide-react";
import Stars from "../../img/stars.png";
import hanger from "../../img/hanger.svg";
import pose from "../../img/pose.png";

// 3번째 시안 기준 6개 슬롯의 정밀 좌표 (1 -> 2 -> 3 -> 4 -> 5 -> 6 U자형 순환)
const SLOT_COORDINATES = [
  { id: 0, pos: "top-[10%] left-[8%]" }, // 1번: 좌상단
  { id: 1, pos: "top-[40%] left-[3%]" }, // 2번: 좌중단
  { id: 2, pos: "top-[68%] left-[7%]" }, // 3번: 좌하단
  { id: 3, pos: "top-[68%] right-[7%]" }, // 4번: 우하단
  { id: 4, pos: "top-[40%] right-[3%]" }, // 5번: 우중단
  { id: 5, pos: "top-[10%] right-[8%]" }, // 6번: 우상단
];

const CATEGORIES = ["All", "Top", "Bottom", "Outer", "Shoes", "Acc"];

export default function NewLookbook() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // 컴포넌트 내부
  const tabScrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 마우스 눌렀을 때
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - tabScrollRef.current.offsetLeft);
    setScrollLeft(tabScrollRef.current.scrollLeft);
  };

  // 마우스 뗐을 때나 영역 밖으로 나갔을 때
  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // 마우스 끌어당길 때
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - tabScrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // 스크롤 민감도 배수
    tabScrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // 카테고리 필터 & 룩 정보 상태
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lookTitle, setLookTitle] = useState("Unnamed");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]); // 최대 6개 아이템 배열

  // 보관함 아이템 (LocalStorage 연동 + 테스트용 기본 데이터)
  const [archiveItems, setArchiveItems] = useState([
    {
      id: "it_1",
      name: "셔링 크롭 탑",
      category: "Top",
      styles: ["Feminine", "Y2K"],
      imageUrl:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: "it_2",
      name: "로우라이즈 미니스커트",
      category: "Bottom",
      styles: ["Feminine", "Y2K"],
      imageUrl:
        "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: "it_3",
      name: "버클 로퍼 슈즈",
      category: "Shoes",
      styles: ["Casual", "Minimal"],
      imageUrl:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: "it_4",
      name: "오버사이즈 바이커 자켓",
      category: "Outer",
      styles: ["Street", "Casual"],
      imageUrl:
        "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: "it_5",
      name: "빈티지 실버 넥클리스",
      category: "Acc",
      styles: ["Y2K", "Street"],
      imageUrl:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: "it_6",
      name: "웨스턴 레더 벨트",
      category: "Acc",
      styles: ["Vintage", "Casual"],
      imageUrl:
        "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=500&auto=format&fit=crop&q=60",
    },
  ]);

  // 로컬 스토리지 데이터 불러오기 (수정 모드 포함)
  useEffect(() => {
    const savedArchive = localStorage.getItem("archive_items");
    if (savedArchive) {
      try {
        const parsed = JSON.parse(savedArchive);
        if (parsed.length > 0) setArchiveItems(parsed);
      } catch (e) {
        console.error(e);
      }
    }

    if (isEditMode) {
      const savedLookbooks = localStorage.getItem("fitlog_lookbooks");
      if (savedLookbooks) {
        const parsed = JSON.parse(savedLookbooks);
        const target = parsed.find((lb) => String(lb.id) === String(id));
        if (target) {
          setLookTitle(target.title || "LOOK");
          setSelectedItems(target.items || []);
        }
      }
    }
  }, [id, isEditMode]);

  // 필터링된 아이템 리스트
  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return archiveItems;
    return archiveItems.filter((it) => it.category === selectedCategory);
  }, [archiveItems, selectedCategory]);

  // 3번째 시안 요구사항: 아이템 정보 중 제일 많이 사용된 스타일 태그 2개 자동 집계
  const topStyleTags = useMemo(() => {
    if (selectedItems.length === 0) return ["#StyleTag1", "#StyleTag2"];

    const countMap = {};
    selectedItems.forEach((it) => {
      (it.styles || []).forEach((style) => {
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

  // 아이템 캔버스 추가 (최대 6개)
  const handleAddItem = (item) => {
    if (selectedItems.length >= 6) {
      alert("아이템은 최대 6개까지 배치할 수 있습니다.");
      return;
    }
    setSelectedItems((prev) => [...prev, item]);
  };

  // 캔버스에서 아이템 제거
  const handleRemoveItem = (indexToRemove) => {
    setSelectedItems((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // 드래그 앤 드롭 핸들러
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
      handleAddItem(item);
    } catch (err) {
      console.error("드롭 파싱 실패", err);
    }
  };

  // 룩북 저장
  const handleSaveLookbook = () => {
    if (selectedItems.length < 2) {
      alert("최소 2개 이상의 아이템을 추가해주세요.");
      return;
    }

    const newEntry = {
      id: isEditMode ? Number(id) : Date.now(),
      lookNo: `LOOK ${isEditMode ? id : "01"}`,
      title: lookTitle || "무제 룩",
      tags: topStyleTags.filter((t) => !t.includes("StyleTag")),
      items: selectedItems,
    };

    const existing = JSON.parse(
      localStorage.getItem("fitlog_lookbooks") || "[]",
    );
    let updated;
    if (isEditMode) {
      updated = existing.map((lb) =>
        String(lb.id) === String(id) ? newEntry : lb,
      );
    } else {
      updated = [newEntry, ...existing];
    }

    localStorage.setItem("fitlog_lookbooks", JSON.stringify(updated));
    navigate("/lookbook");
  };

  return (
    <div className="w-full lg:px-[100px] xl:px-[180px] px-[50px] min-h-screen bg-base-pink text-black flex flex-col pt-[80px]">
      {/* 1. 상단 타이틀 & 빵부스러기 네비게이션 */}
      <section className="relative w-full pt-10 pb-6 flex flex-col gap-6">
        <div className="flex flex-col items-start gap-1">
          <h1 className="z-10 display1 text-accent-pink font-normal leading-none italic select-none">
            LookBook
          </h1>
          <span className="z-10 body4 text-dark-gray  select-none">
            All your pieces, all in one place.
          </span>
          <div
            className="absolute scale-50 md:scale-75 lg:scale-100  left-[-110px] sm:left-[-100px] lg:left-[-50px] top-1/2 -translate-y-[55%] w-[360px] h-[180px] rounded-[50%] pointer-events-none select-none z-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.6) 35%, rgba(255, 233, 243, 0) 70%)",
            }}
          />
        </div>

        {/* Breadcrumb */}
        <div className="flex justify-end items-center gap-3   text-dark-gray pr-1">
          <span
            onClick={() => navigate("/lookbook")}
            className="hover:text-black cursor-pointer body4"
          >
            LookBook
          </span>
          <ChevronRight size={20} strokeWidth={1.2} />
          <span className="body4 text-black font-medium">New</span>
        </div>
      </section>

      {/* 2. 메인 워크스페이스 영역 */}
      <main className="flex-1 w-full   pb-24 flex flex-col md:flex-row gap-6 lg:gap-8 items-start justify-center">
        {/* ========================================================
{/* ========================================================
    [좌측 영역]: My Item 아카이브 보관함
    - 모바일: 높이 자동 (h-auto)
    - 태블릿/데스크톱: 580px 완전 고정 (md:h-[580px])
   ======================================================== */}
        <div
          className="
  w-full md:w-[200px] lg:w-[250px] xl:w-[320px] 
  h-auto md:h-[800px] 
  bg-white border border-[#EBEBEB] rounded-sm p-5 sm:p-6 
  flex flex-col shrink-0 shadow-2xs
"
        >
          {/* 보관함 타이틀 */}
          <h2 className="display2 text-black pb-3 select-none shrink-0">
            My Item
          </h2>

          <div
            ref={tabScrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseUpOrLeave}
            onMouseUp={handleMouseUpOrLeave}
            onMouseMove={handleMouseMove}
            className={`flex items-center gap-1.5 pb-4 overflow-x-auto no-scrollbar border-b border-[#F0F0F0] shrink-0 select-none ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  // 드래그 중 실수로 클릭되는 현상 방지
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

          {/* 
    🔥 아이템 목록 영역: 
    - min-h-0을 반드시 주어야 부모의 580px 안에서 삐져나가지 않고 정확히 세로 스크롤이 발생합니다.
    - 모바일(<md)에서는 h-auto 및 overflow-visible
  */}
          <div className="flex-1 min-h-0 pt-5 md:overflow-y-auto no-scrollbar">
            {filteredItems.length === 0 ? (
              <div className="w-full h-32 flex items-center justify-center  text-dark-gray">
                No items saved yet
              </div>
            ) : (
              <div
                className="
        flex flex-row overflow-x-auto gap-3 pb-2 no-scrollbar
        md:grid md:grid-cols-1 md:overflow-x-visible md:gap-3.5
        lg:grid-cols-2
      "
              >
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onClick={() => handleAddItem(item)}
                    className="
              flex flex-col items-center gap-1.5 cursor-pointer group select-none shrink-0
              w-[96px] sm:w-[104px] md:w-full
            "
                  >
                    {/* 정사각 썸네일 박스 */}
                    <div className="relative w-full aspect-square bg-[#F5F5F7] border border-[#EBEBEB] rounded-sm overflow-hidden group-hover:border-black/30 transition-all flex items-center justify-center shadow-2xs">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                        />
                      ) : (
                        <img
                          src={hanger}
                          alt="No item"
                          className="w-7 h-7 opacity-30 pointer-events-none"
                        />
                      )}
                    </div>

                    {/* 아이템명 */}
                    <span className="caption3 text-[14px] text-dark-gray truncate max-w-full text-center">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
      [우측 영역]: 룩북 조립 캔버스 (메인 슬롯)
      - 최소 폭 min-w-[360px] 보장
      - flex-1로 남는 넓은 공간을 메인 슬롯이 주도
     ======================================================== */}
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
          {/* 상단: 룩 이름 편집 + 별 장식 */}
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
                  className=" border-b border-black outline-none bg-transparent"
                />
              ) : (
                <span
                  onClick={() => setIsEditingTitle(true)}
                  className="caption2  text-black cursor-pointer select-none"
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

            {/* 우측 상단 핑크 별 에셋 */}
            <img
              src={Stars}
              alt=""
              className="absolute top-[10px] right-0 w-[200px] opacity-80 pointer-events-none select-none"
            />
          </div>

          {/* 룩 조립 스테이지*/}
          <div className="relative flex-1 w-full max-w-[380px] sm:max-w-[420px] mx-auto my-4 flex items-center justify-center select-none ">
            <div className="w-[300px]">
              <img src={pose} alt="" />
            </div>
            {/* 3. U자형 6개 슬롯 렌더링 */}
            {SLOT_COORDINATES.map((slot, index) => {
              const assignedItem = selectedItems[index];
              const isNextSlot =
                index === selectedItems.length && selectedItems.length < 6;

              if (assignedItem) {
                return (
                  <div
                    key={`slot-${slot.id}`}
                    className={`absolute ${slot.pos} z-10 flex flex-col items-center group`}
                  >
                    <div className="relative w-[72px] h-[72px] sm:w-[82px] sm:h-[82px] rounded-full bg-white border border-gray/40 overflow-hidden shadow-xs">
                      <img
                        src={assignedItem.imageUrl}
                        alt={assignedItem.name}
                        className="w-full h-full object-cover"
                      />
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
                    <span className="caption3 text-[10px] text-dark-gray mt-1">
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
                    <span className="body4  text-[#FF85C0] mt-1 whitespace-nowrap">
                      Add Your Item
                    </span>
                  </div>
                );
              }

              return null;
            })}

            {/* 4. 최다 스타일 태그 2개 */}
            <div className="absolute bottom-[50px] left-1/2 -translate-x-1/2 z-10 flex flex-col gap-1.5 items-center">
              {topStyleTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-4 py-1 rounded-full border border-[#D1D1D6] bg-white body4 text-dark-gray shadow-2xs select-none"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 하단 Save / Create 버튼 */}
          <div className="w-full flex justify-end pt-2 z-20">
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
    </div>
  );
}
