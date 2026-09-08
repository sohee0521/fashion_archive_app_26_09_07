import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hanger from "../../img/hanger.svg";
import { ChevronDown, ArrowUpRight, Plus } from "lucide-react";

export default function Archive() {
  const navigate = useNavigate();

  // 1. 메인에서 저장한 로컬스토리지 아이템 불러오기
  const [items, setItems] = useState([]);

  // 필터 상태
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState("All");

  // 페이지네이션 상태 (한 페이지당 12개)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // 카드별 폴더 선택 드롭다운 상태 관리 (열린 카드의 item.id)
  const [openFolderDropdownId, setOpenFolderDropdownId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("fitlog_items");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        setItems([]);
      }
    } else {
      setItems([]);
    }
  }, []);

  // 전체 등록 아이템에서 고유 폴더 목록 추출
  const availableFolders = [
    "All",
    ...Array.from(new Set(items.map((it) => it.folder).filter(Boolean))),
  ];

  // 폴더 변경 핸들러
  const handleUpdateFolder = (itemId, newFolder) => {
    const updated = items.map((it) =>
      it.id === itemId ? { ...it, folder: newFolder } : it,
    );
    setItems(updated);
    localStorage.setItem("fitlog_items", JSON.stringify(updated));
    setOpenFolderDropdownId(null);
  };

  // 필터링 로직
  const filteredItems = items.filter((item) => {
    const matchFolder =
      selectedFolder === "All" || item.folder === selectedFolder;
    const matchCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchStyle = selectedStyle === "All" || item.style === selectedStyle;
    return matchFolder && matchCategory && matchStyle;
  });

  // 필터 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFolder, selectedCategory, selectedStyle]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen bg-white text-black flex flex-col pt-[80px]">
      {/* 1. 상단 타이틀 배너 */}
      <section className="w-full bg-base-pink pt-16 pb-12 px-8 sm:px-16 lg:px-[180px] relative overflow-hidden flex items-baseline gap-4">
        {/* 타원형 하이라이트 광채 */}
        <div
          className="absolute -left-12 sm:left-4 lg:left-[100px] top-1/2 -translate-y-[45%] w-[360px] h-[180px] rounded-[50%] pointer-events-none select-none z-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.6) 35%, rgba(255, 233, 243, 0) 70%)",
          }}
        />

        <div className="relative z-10 flex items-baseline gap-4">
          <h1 className="display1 text-accent-pink font-normal leading-none italic select-none">
            Archive
          </h1>
          <span className="body4 text-dark-gray text-sm sm:text-base tracking-tight select-none">
            All your pieces, all in one place.
          </span>
        </div>
      </section>

      {/* 2. 필터 섹션 */}
      <section className="w-full px-[50px] sm:px-[100px] lg:px-[180px] py-6 flex flex-col gap-[25px] border-b border-gray/20">
        {/* Folder */}
        <div className="flex items-start">
          <span className="w-[110px] md:w-[130px] shrink-0 text-dark-gray body3 leading-[32px] md:leading-[36px]">
            Folder
          </span>
          <div className="flex flex-1 flex-wrap gap-2">
            {availableFolders.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedFolder(f)}
                className={`h-[32px] px-[12px] md:h-[36px] md:px-[14px] rounded-full border caption2 transition-colors cursor-pointer shrink-0 ${
                  selectedFolder === f
                    ? "bg-accent-pink text-white border-accent-pink"
                    : "border-gray/70 text-dark-gray bg-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="flex items-start">
          <span className="w-[110px] md:w-[130px] shrink-0 text-dark-gray body3 leading-[32px] md:leading-[36px]">
            Category
          </span>
          <div className="flex flex-1 flex-wrap gap-2">
            {["All", "Top", "Bottom", "Outer", "Shoes", "Acc"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`h-[32px] px-[12px] md:h-[36px] md:px-[14px] rounded-full border caption2 transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? "bg-accent-pink text-white border-accent-pink"
                    : "border-gray/70 text-dark-gray bg-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div className="flex items-start">
          <span className="w-[110px] md:w-[130px] shrink-0 text-dark-gray body3 leading-[32px] md:leading-[36px]">
            Style
          </span>
          <div className="flex flex-1 flex-wrap gap-2">
            {["All", "Casual", "Feminine", "Hip", "Y2k"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStyle(st)}
                className={`h-[32px] px-[12px] md:h-[36px] md:px-[14px] rounded-full border caption2 transition-colors cursor-pointer shrink-0 ${
                  selectedStyle === st
                    ? "bg-accent-pink text-white border-accent-pink"
                    : "border-gray/70 text-dark-gray bg-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 아이템 그리드 영역 (4열 배치) */}
      <main className="flex-1 w-full px-8 sm:px-16 lg:px-[180px] py-12">
        {filteredItems.length === 0 ? (
          <div className="w-full py-32 flex flex-col items-center justify-center text-center">
            <p className="body1  mb-1">No items saved yet.</p>
            <p className="caption3 text-dark-gray mb-6">
              아이템을 추가해 나만의 아카이브를 채워보세요!
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-[16px] py-[10px] bg-black text-white body3 flex items-center gap-[10px] tracking-wider uppercase hover:bg-black/60 transition-colors cursor-pointer"
            >
              <span>
                <Plus size={20} />
              </span>{" "}
              Add Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/itemDetail/${item.id}`)}
                className="flex flex-col bg-white border border-gray/40 overflow-hidden cursor-pointer group hover:shadow-xs transition-all duration-200"
              >
                {/* 썸네일 및 호버 인터랙션 영역 */}
                <div className="w-full aspect-[3/4] bg-white overflow-hidden flex items-center justify-center relative">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-white flex flex-col items-center justify-center gap-2 p-4 text-center select-none">
                      <img
                        src={hanger}
                        alt="No preview"
                        className="w-10 h-10"
                      />
                    </div>
                  )}

                  {/* 마우스 호버 오버레이 (블러 + 반투명 딤드 레이어) */}
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-3.5 z-10">
                    {/* 좌상단: 폴더 선택 버튼 & 팝업 드롭다운 */}
                    <div className="relative self-start">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenFolderDropdownId(
                            openFolderDropdownId === item.id ? null : item.id,
                          );
                        }}
                        className="flex items-center gap-1.5 text-white caption3 tracking-tight bg-black/20 hover:bg-black/40 px-2.5 py-1.5 rounded-sm backdrop-blur-md transition-colors cursor-pointer"
                      >
                        <span className="drop-shadow-sm">
                          {item.folder && item.folder !== "None"
                            ? item.folder
                            : "None"}
                        </span>
                        <ChevronDown />
                      </button>

                      {/* 폴더 선택 드롭다운 */}
                      {openFolderDropdownId === item.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute left-0 top-full mt-1.5 w-32 bg-white text-black shadow-md rounded-sm  border border-gray/30 z-20"
                        >
                          <button
                            type="button"
                            onClick={() => handleUpdateFolder(item.id, "None")}
                            className="w-full text-left px-3 py-2.5 caption3 hover:bg-base-pink/50 flex items-center justify-between"
                          >
                            <span>None</span>
                            {(!item.folder || item.folder === "None") && (
                              <span className="text-accent-pink text-[10px]">
                                ✓
                              </span>
                            )}
                          </button>

                          {availableFolders
                            .filter((f) => f !== "All" && f !== "None")
                            .map((f) => (
                              <button
                                key={f}
                                type="button"
                                onClick={() => handleUpdateFolder(item.id, f)}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-base-pink/50 flex items-center justify-between"
                              >
                                <span className="truncate">{f}</span>
                                {item.folder === f && (
                                  <span className="text-accent-pink text-[10px]">
                                    ✓
                                  </span>
                                )}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* 우하단: Visit Site 링크 */}
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="self-end flex items-center gap-1.5 !text-white body4   transition-colors cursor-pointer group/link"
                      >
                        <span className="drop-shadow-sm">Visit Site</span>
                        <ArrowUpRight strokeWidth={1.5} />
                      </a>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>

                {/* 카드 하단 정보 바 */}
                <div className="p-3 bg-white flex items-center gap-2 border-t border-gray/30">
                  <span
                    className={`body4 text-[12px] sm:text-[14px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      item.isOwned === "Want"
                        ? "bg-[#FFEAF3] text-accent-pink"
                        : "bg-[#F3EBF9] text-[#A66BD9]"
                    }`}
                  >
                    {item.isOwned || "Have"}
                  </span>
                  <span className="caption3 text-black truncate flex-1">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. 동적 페이지네이션 */}
        {filteredItems.length > 0 && totalPages > 1 && (
          <div className="w-full flex justify-center items-center gap-3 mt-16 text-xs text-dark-gray select-none">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-2 py-1 cursor-pointer transition-colors ${
                currentPage === 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:text-black"
              }`}
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-black text-white font-medium"
                      : "text-dark-gray hover:text-black hover:bg-gray/20"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-2 py-1 cursor-pointer transition-colors ${
                currentPage === totalPages
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:text-black"
              }`}
            >
              &gt;
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
