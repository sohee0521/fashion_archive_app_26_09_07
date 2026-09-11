import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import hanger from "../../img/hanger.svg";
import {
  ChevronDown,
  ArrowUpRight,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const DEFAULT_STYLES = ["Casual", "Feminine", "Hip", "Y2k"];
const CATEGORIES = ["All", "Top", "Bottom", "Outer", "Shoes", "Acc"];

export default function Archive() {
  const navigate = useNavigate();
  const location = useLocation(); // 🔥 전달된 state를 받기 위한 훅

  // 1. 상태 관리
  const [items, setItems] = useState([]);
  const [customFolders, setCustomFolders] = useState([]);
  const [customStyles, setCustomStyles] = useState([]);

  // 필터 상태 (🔥 대시보드 등에서 넘겨준 selectedFolder가 있다면 초기값으로 우선 적용)
  const [selectedFolder, setSelectedFolder] = useState(
    location.state?.selectedFolder || "All",
  );
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState("All");

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  // 카드별 폴더 선택 드롭다운 상태
  const [openFolderDropdownId, setOpenFolderDropdownId] = useState(null);

  // 🔥 만약 페이지가 이미 열려있는 상태에서 다른 곳을 통해 state가 넘어올 경우를 대비한 처리
  useEffect(() => {
    if (location.state?.selectedFolder) {
      setSelectedFolder(location.state.selectedFolder);
    }
  }, [location.state]);

  // (이하 기존 로컬스토리지 로드 및 필터링 로직 동일...)

  // 2. 로컬스토리지에서 아이템 및 커스텀 목록 로드
  useEffect(() => {
    window.scrollTo(0, 0);
    const isLoggedIn = localStorage.getItem("fitlog_logged_in") === "true";
    if (!isLoggedIn) {
      setItems([]);
      return;
    }
    // 1) fitlog_items
    try {
      const savedItems = JSON.parse(
        localStorage.getItem("fitlog_items") || "[]",
      );
      setItems(Array.isArray(savedItems) ? savedItems : []);
    } catch {
      setItems([]);
    }

    // 2) fitlog_custom_folders
    try {
      const savedFolders = JSON.parse(
        localStorage.getItem("fitlog_custom_folders") || "[]",
      );
      setCustomFolders(Array.isArray(savedFolders) ? savedFolders : []);
    } catch {
      setCustomFolders([]);
    }

    // 3) fitlog_custom_styles
    try {
      const savedStyles = JSON.parse(
        localStorage.getItem("fitlog_custom_styles") || "[]",
      );
      setCustomStyles(Array.isArray(savedStyles) ? savedStyles : []);
    } catch {
      setCustomStyles([]);
    }
  }, []);

  // 전체 유효 폴더 목록 (All + 등록된 폴더들 중 "None" 제외)
  const availableFolders = useMemo(() => {
    const itemFolders = items.map((it) => it.folder).filter(Boolean);
    const set = new Set([...itemFolders, ...customFolders]);
    const foldersWithoutNone = Array.from(set).filter(
      (f) => f && f !== "None" && f !== "All",
    );
    return ["All", ...foldersWithoutNone];
  }, [items, customFolders]);

  // 전체 유효 스타일 목록 (All + 기본 스타일 + 커스텀 등록 스타일 통합)
  const availableStyles = useMemo(() => {
    const itemStyles = items.flatMap((it) =>
      Array.isArray(it.styles) ? it.styles : it.style ? [it.style] : [],
    );
    const set = new Set([
      "All",
      ...DEFAULT_STYLES,
      ...customStyles,
      ...itemStyles,
    ]);
    return Array.from(set).filter((s) => s !== "None");
  }, [items, customStyles]);

  // 폴더 변경 핸들러
  const handleUpdateFolder = (itemId, newFolder) => {
    const updated = items.map((it) =>
      it.id === itemId ? { ...it, folder: newFolder } : it,
    );
    setItems(updated);
    localStorage.setItem("fitlog_items", JSON.stringify(updated));

    // 룩북 내부 아이템 폴더도 동기화
    try {
      const lbs = JSON.parse(localStorage.getItem("fitlog_lookbooks") || "[]");
      const updatedLbs = lbs.map((lb) => ({
        ...lb,
        items: (lb.items || []).map((it) =>
          it.id === itemId ? { ...it, folder: newFolder } : it,
        ),
      }));
      localStorage.setItem("fitlog_lookbooks", JSON.stringify(updatedLbs));
    } catch (e) {
      console.error(e);
    }

    setOpenFolderDropdownId(null);
  };

  // 필터링 로직 (다중 style 배열 대응)
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1) Folder 필터
      const matchFolder =
        selectedFolder === "All" ||
        (selectedFolder === "None"
          ? !item.folder || item.folder === "None"
          : item.folder === selectedFolder);

      // 2) Category 필터
      const matchCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      // 3) Style 필터 (styles 배열 또는 style 단일값 검사)
      const itemStyles = Array.isArray(item.styles)
        ? item.styles
        : item.style
          ? [item.style]
          : [];
      const matchStyle =
        selectedStyle === "All" || itemStyles.includes(selectedStyle);

      return matchFolder && matchCategory && matchStyle;
    });
  }, [items, selectedFolder, selectedCategory, selectedStyle]);

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
        <div
          className="absolute -left-8 sm:left-4 lg:left-[100px] top-1/2 -translate-y-[45%] w-[200px] h-[100px] md:w-[240px] md:h-[120px] lg:w-[360px] lg:h-[180px] rounded-[50%] pointer-events-none select-none z-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.6) 35%, rgba(255, 233, 243, 0) 70%)",
          }}
        />

        <div className="relative z-10 flex items-baseline gap-4">
          <h1 className="display1 text-accent-pink font-normal leading-none italic select-none">
            Archive
          </h1>
          <span className="body4 text-dark-gray select-none">
            All your pieces, all in one place.
          </span>
        </div>
      </section>

      {/* 2. 필터 섹션 */}
      <section className="w-full px-[50px] sm:px-[100px] lg:px-[180px] py-6 flex flex-col gap-[25px] border-b border-gray/20">
        {/* Folder 필터 */}
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
                    ? "bg-accent-pink text-white border-accent-pink font-medium"
                    : "border-gray/70 text-dark-gray bg-white hover:border-black"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Category 필터 */}
        <div className="flex items-start">
          <span className="w-[110px] md:w-[130px] shrink-0 text-dark-gray body3 leading-[32px] md:leading-[36px]">
            Category
          </span>
          <div className="flex flex-1 flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`h-[32px] px-[12px] md:h-[36px] md:px-[14px] rounded-full border caption2 transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? "bg-accent-pink text-white border-accent-pink font-medium"
                    : "border-gray/70 text-dark-gray bg-white hover:border-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Style 필터 (커스텀 스타일 포함) */}
        <div className="flex items-start">
          <span className="w-[110px] md:w-[130px] shrink-0 text-dark-gray body3 leading-[32px] md:leading-[36px]">
            Style
          </span>
          <div className="flex flex-1 flex-wrap gap-2">
            {availableStyles.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStyle(st)}
                className={`h-[32px] px-[12px] md:h-[36px] md:px-[14px] rounded-full border caption2 transition-colors cursor-pointer shrink-0 ${
                  selectedStyle === st
                    ? "bg-accent-pink text-white border-accent-pink font-medium"
                    : "border-gray/70 text-dark-gray bg-white hover:border-black"
                }`}
              >
                {st === "All" ? "All" : `#${st}`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 아이템 그리드 영역 */}
      <main className="flex-1 w-full px-8 sm:px-16 lg:px-[180px] py-12">
        {filteredItems.length === 0 ? (
          <div className="w-full py-32 flex flex-col items-center justify-center text-center">
            <p className="body1 mb-1">No items saved yet.</p>
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
            {currentItems.map((item) => {
              const displayImage =
                item.detailImages?.[0] || item.imageUrl || "";

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/itemDetail/${item.id}`)}
                  className="flex flex-col bg-white border border-gray/40 overflow-hidden cursor-pointer group hover:shadow-xs transition-all duration-200 select-none"
                >
                  {/* 썸네일 & 호버 오버레이 */}
                  <div className="w-full aspect-[3/4] bg-white overflow-hidden flex items-center justify-center relative">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-white flex flex-col items-center justify-center gap-2 p-4 text-center select-none">
                        <img
                          src={hanger}
                          alt="No preview"
                          className="w-10 h-10 opacity-30"
                        />
                      </div>
                    )}

                    {/* 호버 오버레이 */}
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-3.5 z-10">
                      {/* 폴더 선택 드롭다운 (커스텀 폴더 목록 포함) */}
                      <div className="relative self-start">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenFolderDropdownId(
                              openFolderDropdownId === item.id ? null : item.id,
                            );
                          }}
                          className="flex items-center gap-1.5 text-white caption3 tracking-tight bg-black/30 hover:bg-black/50 px-2.5 py-1.5 rounded-sm backdrop-blur-md transition-colors cursor-pointer"
                        >
                          <span className="drop-shadow-sm">
                            {item.folder && item.folder !== "None"
                              ? item.folder
                              : "None"}
                          </span>
                          <ChevronDown size={14} />
                        </button>

                        {openFolderDropdownId === item.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute left-0 top-full mt-1.5 w-32 bg-white text-black shadow-md rounded-sm border border-gray/30 z-20 max-h-48 overflow-y-auto no-scrollbar"
                          >
                            {availableFolders
                              .filter((f) => f !== "All")
                              .map((f) => (
                                <button
                                  key={f}
                                  type="button"
                                  onClick={() => handleUpdateFolder(item.id, f)}
                                  className="w-full text-left px-3 py-2 caption3 hover:bg-base-pink/50 flex items-center justify-between cursor-pointer"
                                >
                                  <span className="truncate">{f}</span>
                                  {((!item.folder && f === "None") ||
                                    item.folder === f) && (
                                    <span className="text-accent-pink text-[10px]">
                                      ✓
                                    </span>
                                  )}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* Visit Site */}
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="self-end flex items-center gap-1.5 !text-white body4 transition-colors cursor-pointer hover:underline"
                        >
                          <span className="drop-shadow-sm">Visit Site</span>
                          <ArrowUpRight strokeWidth={1.5} size={16} />
                        </a>
                      ) : (
                        <div />
                      )}
                    </div>
                  </div>

                  {/* 하단 바 */}
                  <div className="p-3 bg-white flex items-center gap-2 border-t border-gray/30">
                    <span
                      className={`body4 px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        item.isOwned === "Want"
                          ? "bg-base-pink text-accent-pink"
                          : "bg-white text-accent-pink "
                      }`}
                    >
                      {item.isOwned || "Have"}
                    </span>
                    <span className="caption3 text-black truncate flex-1">
                      {item.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. 동적 페이지네이션 */}
        {filteredItems.length > 0 && totalPages > 1 && (
          <div className="w-full flex justify-center items-center gap-3 mt-16 caption3 text-dark-gray select-none">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-2 py-1 cursor-pointer transition-colors ${
                currentPage === 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:text-black"
              }`}
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
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
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
