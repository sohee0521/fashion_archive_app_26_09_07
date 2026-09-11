import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import main_slogan from "../../../img/main_slogan.png";
import {
  Plus,
  Check,
  X,
  ArrowRight,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { fetchOgData } from "../../../utils/fetchOgData";

const DEFAULT_STYLES = ["Casual", "Feminine", "Hip", "Y2k"];

// 스크롤 트리거 쇼쇼쇽 래퍼 컴포넌트
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

export default function HeroSection({
  urlInput,
  setUrlInput,
  isFormOpen,
  setIsFormOpen,
  formData,
  setFormData,
  handleAddUrl,
  handleOpenWithoutLink,
  handleImageUpload,
  handleSaveItem,
}) {
  const navigate = useNavigate();

  const [folders, setFolders] = useState(["None"]);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderInput, setNewFolderInput] = useState("");

  const [styles, setStyles] = useState(DEFAULT_STYLES);
  const [isAddingStyle, setIsAddingStyle] = useState(false);
  const [newStyleInput, setNewStyleInput] = useState("");

  // 저장 완료 모달 State
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // OG 이미지 및 메타데이터 로딩 상태
  const [isFetchingOg, setIsFetchingOg] = useState(false);

  // 링크 존재 여부 판단 변수 (링크가 없으면 상품명 필수!)
  const hasUrl = Boolean(formData.url && formData.url.trim());

  // 폼 열림 또는 마운트 시 로컬스토리지와 동기화
  useEffect(() => {
    try {
      const savedItems = JSON.parse(
        localStorage.getItem("fitlog_items") || "[]",
      );
      const itemFolders = savedItems.map((it) => it.folder).filter(Boolean);
      const itemStyles = savedItems.flatMap((it) =>
        Array.isArray(it.styles) ? it.styles : it.style ? [it.style] : [],
      );

      const customFolders = JSON.parse(
        localStorage.getItem("fitlog_custom_folders") || "[]",
      );
      const customStyles = JSON.parse(
        localStorage.getItem("fitlog_custom_styles") || "[]",
      );

      const mergedFolders = Array.from(
        new Set(["None", ...itemFolders, ...customFolders]),
      ).filter((f) => f !== "All");

      const mergedStyles = Array.from(
        new Set([...DEFAULT_STYLES, ...itemStyles, ...customStyles]),
      ).filter((s) => s !== "None" && s !== "All");

      setFolders(mergedFolders);
      setStyles(mergedStyles);
    } catch (e) {
      console.error("폴더/스타일 동기화 실패:", e);
    }
  }, [isFormOpen]);

  const selectedStyles = Array.isArray(formData.styles)
    ? formData.styles
    : formData.style && formData.style !== "None"
      ? [formData.style]
      : [];

  const handleToggleStyle = (st) => {
    if (st === "None") {
      setFormData((prev) => ({ ...prev, styles: [], style: "None" }));
      return;
    }

    const exists = selectedStyles.includes(st);
    const updatedStyles = exists
      ? selectedStyles.filter((s) => s !== st)
      : [...selectedStyles, st];

    setFormData((prev) => ({
      ...prev,
      styles: updatedStyles,
      style: updatedStyles[0] || "None",
    }));
  };

  // 새 Style 추가
  const handleAddNewStyle = () => {
    const trimmed = newStyleInput.trim();
    if (!trimmed) {
      setIsAddingStyle(false);
      return;
    }

    if (!styles.includes(trimmed)) {
      const updatedList = [...styles, trimmed];
      setStyles(updatedList);

      const customOnly = updatedList.filter((s) => !DEFAULT_STYLES.includes(s));
      localStorage.setItem("fitlog_custom_styles", JSON.stringify(customOnly));
    }

    if (!selectedStyles.includes(trimmed)) {
      const updatedSelected = [...selectedStyles, trimmed];
      setFormData((prev) => ({
        ...prev,
        styles: updatedSelected,
        style: updatedSelected[0] || "None",
      }));
    }

    setNewStyleInput("");
    setIsAddingStyle(false);
  };

  // 커스텀 Style 삭제 핸들러
  const handleDeleteStyle = (e, targetStyle) => {
    e.stopPropagation();
    if (DEFAULT_STYLES.includes(targetStyle)) return;

    const updatedStyles = styles.filter((s) => s !== targetStyle);
    setStyles(updatedStyles);

    const customOnly = updatedStyles.filter((s) => !DEFAULT_STYLES.includes(s));
    localStorage.setItem("fitlog_custom_styles", JSON.stringify(customOnly));

    const nextSelected = selectedStyles.filter((s) => s !== targetStyle);
    setFormData((prev) => ({
      ...prev,
      styles: nextSelected,
      style: nextSelected[0] || "None",
    }));
  };

  // 새 Folder 추가
  const handleAddNewFolder = () => {
    const trimmed = newFolderInput.trim();
    if (!trimmed) {
      setIsAddingFolder(false);
      return;
    }

    if (!folders.includes(trimmed)) {
      const updatedList = [...folders, trimmed];
      setFolders(updatedList);

      const customOnly = updatedList.filter((f) => f !== "None" && f !== "All");
      localStorage.setItem("fitlog_custom_folders", JSON.stringify(customOnly));
    }

    setFormData((prev) => ({ ...prev, folder: trimmed }));
    setNewFolderInput("");
    setIsAddingFolder(false);
  };

  // 커스텀 Folder 삭제 핸들러
  const handleDeleteFolder = (e, targetFolder) => {
    e.stopPropagation();
    if (targetFolder === "None" || targetFolder === "All") return;

    const updatedFolders = folders.filter((f) => f !== targetFolder);
    setFolders(updatedFolders);

    const customOnly = updatedFolders.filter(
      (f) => f !== "None" && f !== "All",
    );
    localStorage.setItem("fitlog_custom_folders", JSON.stringify(customOnly));

    if (formData.folder === targetFolder) {
      setFormData((prev) => ({ ...prev, folder: "None" }));
    }
  };

  // 🔥 URL 입력 후 ADD 클릭 시: og:image & og:title 자동 스크랩 및 콘솔 확인
  const onAddUrlSubmit = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const inputUrl = urlInput.trim();
    setIsFetchingOg(true);
    setIsFormOpen(true);

    if (typeof handleAddUrl === "function") {
      handleAddUrl(e);
    }

    try {
      const ogData = await fetchOgData(inputUrl);

      // 🔥 최종 확보된 이미지 링크 콘솔 확인
      console.log("📦 [HeroSection 폼에 전달될 이미지 링크]:", ogData.imageUrl);

      setFormData((prev) => {
        const nextTitle = prev.title?.trim() ? prev.title : ogData.title || "";
        const scrapedImg = ogData.imageUrl || "";

        // 디테일 이미지 배열 첫 번째 자리에 대입
        const nextDetailImages = scrapedImg
          ? [scrapedImg]
          : prev.detailImages || [];

        return {
          ...prev,
          url: inputUrl,
          title: nextTitle,
          previewImage: scrapedImg,
          imageUrl: scrapedImg,
          detailImages: nextDetailImages,
        };
      });
    } catch (err) {
      console.warn("OG 메타데이터 가져오기 실패:", err);
    } finally {
      setIsFetchingOg(false);
    }
  };

  // 🔥 저장 버튼 로직 (비로그인 시 차단 후 로그인 페이지로 이동)
  const onSaveClick = () => {
    // 🔒 로그인 체크 가드
    const isLoggedIn = localStorage.getItem("fitlog_logged_in") === "true";
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    const trimmedTitle = formData.title?.trim();

    if (!hasUrl && !trimmedTitle) {
      alert("링크가 없는 경우 상품명은 필수 항목입니다.");
      return;
    }

    const finalTitle = trimmedTitle || "Untitled";
    const finalIsOwned = formData.isOwned || "Want";

    const resolvedStyles =
      Array.isArray(formData.styles) && formData.styles.length > 0
        ? formData.styles
        : formData.style && formData.style !== "None"
          ? [formData.style]
          : [];

    // 🔥 메인 이미지 및 디테일 이미지 목록 추출
    const finalImage = formData.previewImage || formData.imageUrl || "";
    const finalDetailImages =
      Array.isArray(formData.detailImages) && formData.detailImages.length > 0
        ? formData.detailImages
        : finalImage
          ? [finalImage]
          : [];

    const newId = Date.now();
    const newItem = {
      id: newId,
      title: finalTitle,
      isOwned: finalIsOwned,
      memo: formData.memo || "",
      folder: formData.folder || "None",
      category: formData.category || "Top",
      styles: resolvedStyles,
      style: resolvedStyles[0] || "None",
      imageUrl: finalImage || finalDetailImages[0] || "",
      detailImages: finalDetailImages,
      url: formData.url || "",
    };

    try {
      const currentItems = JSON.parse(
        localStorage.getItem("fitlog_items") || "[]",
      );
      const updatedItems = [newItem, ...currentItems];
      localStorage.setItem("fitlog_items", JSON.stringify(updatedItems));
      window.dispatchEvent(new Event("fitlog_storage_updated"));
    } catch (err) {
      console.error(err);
    }

    if (typeof handleSaveItem === "function") {
      setFormData((prev) => ({
        ...prev,
        title: finalTitle,
        isOwned: finalIsOwned,
      }));
    }

    setIsFormOpen(false);
    setIsSavedModalOpen(true);
  };

  return (
    <section className="w-full pt-[120px] bg-gradient-to-b from-base-pink via-base-pink/50 to-white pb-20 px-6 flex flex-col items-center overflow-hidden">
      {/* 1. 상단 라벨 & 메인 슬로건 이미지 쇼쇼쇽 */}
      <ScrollFadeIn
        delay={100}
        className="w-full flex flex-col items-center text-center"
      >
        <p className="caption3 text-accent-pink">Add New Item</p>

        <div className="relative mb-10 w-full sm:w-[80%] max-w-[1000px] flex justify-center">
          <img
            src={main_slogan}
            alt="What's in My Closet?"
            className="w-full object-contain pointer-events-none select-none"
          />
        </div>
      </ScrollFadeIn>

      {/* 2. URL 입력 검색바 쇼쇼쇽 */}
      <ScrollFadeIn
        delay={200}
        className="w-full max-w-3xl flex flex-col items-center"
      >
        <form
          onSubmit={onAddUrlSubmit}
          className="w-full flex items-center border-b border-black pb-2 mb-3"
        >
          <input
            type="text"
            placeholder="소장 중이거나 갖고싶은 아이템 링크를 붙여넣어 보세요!"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            disabled={isFetchingOg}
            className="w-full bg-transparent outline-none body4 text-black placeholder:text-light-text px-2 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isFetchingOg}
            className="bg-black text-white px-[15px] py-[10px] body4 flex items-center gap-[5px] hover:bg-black/80 transition-colors shrink-0 cursor-pointer disabled:opacity-60"
          >
            {isFetchingOg ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>불러오는 중...</span>
              </>
            ) : (
              <>
                <Plus size={20} strokeWidth={1.5} />
                <span>ADD</span>
              </>
            )}
          </button>
        </form>

        {!isFormOpen && (
          <button
            type="button"
            onClick={() => {
              // 🔒 링크 없이 추가할 때도 비로그인 시 로그인 페이지로 유도
              const isLoggedIn =
                localStorage.getItem("fitlog_logged_in") === "true";
              if (!isLoggedIn) {
                alert("로그인이 필요한 서비스입니다.");
                navigate("/login");
                return;
              }
              handleOpenWithoutLink();
            }}
            className="caption3 text-light-text underline hover:text-black transition-colors cursor-pointer"
          >
            or add without a link
          </button>
        )}
      </ScrollFadeIn>

      {/* 3. 등록 폼 영역  */}
      {isFormOpen && (
        <ScrollFadeIn delay={150} className="w-full max-w-3xl">
          <div
            className={`w-full bg-white rounded-lg shadow-sm border border-gray/40 overflow-hidden mt-6 p-6 transition-all duration-300 ${
              isFetchingOg ? "opacity-90 ring-2 ring-accent-pink/30" : ""
            }`}
          >
            {/* 링크 프리뷰 카드 */}
            {hasUrl && (
              <div className="border border-gray/30 rounded-lg overflow-hidden mb-8 bg-white shadow-2xs relative">
                {/* 상단 로딩 프로그레스 바 */}
                {isFetchingOg && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-accent-pink/20 overflow-hidden z-20">
                    <div className="w-full h-full bg-accent-pink animate-pulse" />
                  </div>
                )}

                <div className="bg-[#FAFAFA] px-4 py-3 border-b border-gray/20 flex justify-between items-center select-none">
                  <span className="body4 text-dark-gray flex items-center gap-2">
                    Product Preview
                  </span>
                  <a
                    href={formData.url}
                    target="_blank"
                    rel="noreferrer"
                    className="caption3 text-black hover:text-accent-pink flex items-center gap-1"
                  >
                    <span className="body4 text-[14px]">OPEN</span>
                    <ExternalLink size={18} strokeWidth={1.5} />
                  </a>
                </div>

                <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 bg-white">
                  {/* 스크랩된 대표 이미지 썸네일 */}
                  <div className="w-full sm:w-32 aspect-square rounded-md overflow-hidden bg-gray-100 shrink-0 border border-gray/20 flex items-center justify-center relative">
                    {formData.previewImage ? (
                      <img
                        src={formData.previewImage}
                        alt="Scraped OG"
                        className={`w-full h-full object-cover transition-opacity duration-500 ${
                          isFetchingOg ? "opacity-60 blur-2xs" : "opacity-100"
                        }`}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-stone-50">
                        <Loader2
                          size={24}
                          className="animate-spin text-accent-pink"
                        />
                        <span className="caption3 text-dark-gray text-[11px] px-1 animate-pulse">
                          이미지 탐색 중...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 텍스트 정보 */}
                  <div className="flex flex-col justify-center overflow-hidden w-full gap-1">
                    <h4 className="body2 font-semibold text-black truncate">
                      {formData.title ||
                        (isFetchingOg
                          ? "상품 정보를 읽어오는 중..."
                          : "상품명이 지정되지 않았습니다")}
                    </h4>
                    {isFetchingOg && (
                      <p className="caption3 text-dark-gray animate-pulse duration-75">
                        잠시만 기다려주세요. 썸네일과 제목을 채우고 있어요
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-5 px-2">
              {/* IsOwned */}
              <div className="flex items-center">
                <span className="w-32 body4 text-black">IsOwned</span>
                <div className="flex gap-2">
                  {["Want", "Have"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, isOwned: status })
                      }
                      className={`px-4 py-1 rounded-full caption3 transition-colors cursor-pointer ${
                        formData.isOwned === status
                          ? "bg-accent-pink text-white"
                          : "border border-gray text-dark-gray bg-white hover:border-black"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Name */}
              <div className="flex items-center">
                <span className="w-32 body4 text-black flex items-center gap-1">
                  Product Name
                  {!hasUrl && (
                    <span className="text-accent-pink font-bold">*</span>
                  )}
                </span>
                <input
                  type="text"
                  value={formData.title}
                  placeholder={
                    hasUrl
                      ? "상품명을 입력해주세요"
                      : "상품명을 입력해주세요 (필수)"
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="flex-1 bg-transparent border-b border-dotted border-gray py-1 body4 outline-none text-black placeholder:text-light-text focus:border-black"
                />
              </div>

              {/* Memo */}
              <div className="flex items-center">
                <span className="w-32 body4 text-black">Memo</span>
                <input
                  type="text"
                  value={formData.memo}
                  placeholder="저장 이유, 코디 팁, 사이즈 등을 메모해보세요"
                  onChange={(e) =>
                    setFormData({ ...formData, memo: e.target.value })
                  }
                  className="flex-1 bg-transparent border-b border-dotted border-gray py-1 body4 outline-none text-black placeholder:text-light-text focus:border-black"
                />
              </div>

              {/* Folder */}
              <div className="flex items-start">
                <span className="w-32 body4 text-black leading-[28px]">
                  Folder
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {folders.map((f) => {
                    const isCustom = f !== "None" && f !== "All";
                    const isSelected = formData.folder === f;

                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFormData({ ...formData, folder: f })}
                        className={`group relative px-3 py-1 rounded-full caption3 cursor-pointer transition-colors flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-accent-pink text-white font-medium"
                            : "border border-gray text-dark-gray bg-white hover:border-black"
                        }`}
                      >
                        <span>{f}</span>
                        {isCustom && (
                          <span
                            onClick={(e) => handleDeleteFolder(e, f)}
                            className={`p-0.5 rounded-full hover:bg-black/20 transition-all ${
                              isSelected
                                ? "text-white"
                                : "text-dark-gray hover:text-black"
                            }`}
                            title="폴더 삭제"
                          >
                            <X size={11} strokeWidth={2.5} />
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {isAddingFolder ? (
                    <div className="flex items-center gap-1 border border-black rounded-full px-2.5 py-0.5 bg-white">
                      <input
                        type="text"
                        value={newFolderInput}
                        autoFocus
                        placeholder="폴더명"
                        onChange={(e) => setNewFolderInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddNewFolder();
                          }
                          if (e.key === "Escape") {
                            setIsAddingFolder(false);
                            setNewFolderInput("");
                          }
                        }}
                        className="caption3 outline-none bg-transparent w-20 text-black placeholder:text-gray"
                      />
                      <button
                        type="button"
                        onClick={handleAddNewFolder}
                        className="text-accent-pink hover:text-black cursor-pointer"
                      >
                        <Check size={14} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingFolder(false);
                          setNewFolderInput("");
                        }}
                        className="text-dark-gray hover:text-black cursor-pointer"
                      >
                        <X size={12} strokeWidth={2} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingFolder(true)}
                      className="w-7 h-7 rounded-full border border-dashed border-gray flex items-center justify-center text-dark-gray hover:text-black hover:border-black transition-colors cursor-pointer"
                    >
                      <Plus size={14} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="flex items-center">
                <span className="w-32 body4 text-black">Category</span>
                <div className="flex flex-wrap gap-2">
                  {["Top", "Bottom", "Outer", "Shoes", "Acc"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, category: cat })
                      }
                      className={`px-4 py-1 rounded-full caption3 transition-colors cursor-pointer ${
                        formData.category === cat
                          ? "bg-accent-pink text-white"
                          : "border border-gray text-dark-gray bg-white hover:border-black"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div className="flex items-start">
                <span className="w-32 body4 text-black leading-[28px]">
                  Style
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStyle("None")}
                    className={`px-3 py-1 rounded-full caption3 cursor-pointer transition-colors ${
                      selectedStyles.length === 0
                        ? "bg-accent-pink text-white"
                        : "border border-gray text-dark-gray bg-white hover:border-black"
                    }`}
                  >
                    None
                  </button>

                  {styles.map((st) => {
                    const isCustom = !DEFAULT_STYLES.includes(st);
                    const isSelected = selectedStyles.includes(st);

                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleToggleStyle(st)}
                        className={`group relative px-3 py-1 rounded-full caption3 cursor-pointer transition-colors flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-accent-pink text-white font-medium shadow-2xs"
                            : "border border-gray text-dark-gray bg-white hover:border-black"
                        }`}
                      >
                        <span>#{st}</span>
                        {isCustom && (
                          <span
                            onClick={(e) => handleDeleteStyle(e, st)}
                            className={`p-0.5 rounded-full hover:bg-black/20 transition-all ${
                              isSelected
                                ? "text-white"
                                : "text-dark-gray hover:text-black"
                            }`}
                            title="스타일 삭제"
                          >
                            <X size={11} strokeWidth={2.5} />
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {isAddingStyle ? (
                    <div className="flex items-center gap-1 border border-black rounded-full px-2.5 py-0.5 bg-white">
                      <input
                        type="text"
                        value={newStyleInput}
                        autoFocus
                        placeholder="스타일명"
                        onChange={(e) => setNewStyleInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddNewStyle();
                          }
                          if (e.key === "Escape") {
                            setIsAddingStyle(false);
                            setNewStyleInput("");
                          }
                        }}
                        className="caption3 outline-none bg-transparent w-20 text-black placeholder:text-gray"
                      />
                      <button
                        type="button"
                        onClick={handleAddNewStyle}
                        className="text-accent-pink hover:text-black cursor-pointer"
                      >
                        <Check size={14} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingStyle(false);
                          setNewStyleInput("");
                        }}
                        className="text-dark-gray hover:text-black cursor-pointer"
                      >
                        <X size={12} strokeWidth={2} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingStyle(true)}
                      className="w-7 h-7 rounded-full border border-dashed border-gray flex items-center justify-center text-dark-gray hover:text-black hover:border-black transition-colors cursor-pointer"
                    >
                      <Plus size={14} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end items-center gap-3 pt-6 mt-4 border-t border-gray/30">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="body4 text-dark-gray hover:text-black px-4 py-[7px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSaveClick}
                className="bg-black text-white px-4 py-[7px] rounded-xs body4 font-medium flex items-center gap-2 hover:bg-black/85 transition-colors tracking-wider cursor-pointer"
              >
                SAVE
              </button>
            </div>
          </div>
        </ScrollFadeIn>
      )}

      {/* 저장 완료 모달 */}
      {isSavedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-pink-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-base-pink/50 text-accent-pink flex items-center justify-center mb-4">
              <CheckCircle2 size={26} strokeWidth={2} />
            </div>

            <h3 className="body2 font-bold text-black mb-1.5">
              아이템이 저장되었습니다!
            </h3>
            <p className="body4 text-dark-gray mb-6">
              저장한 아이템으로 나만의 룩북을 만들어보세요.
            </p>

            <div className="flex gap-2.5 w-full">
              <button
                type="button"
                onClick={() => setIsSavedModalOpen(false)}
                className="flex-1 py-2.5 rounded-full border border-[#EBEBEB] text-dark-gray body4 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                머무르기
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSavedModalOpen(false);
                  navigate("/newLookbook");
                }}
                className="flex-1 py-2.5 rounded-full bg-black text-white body4 font-medium flex items-center justify-center gap-1.5 hover:bg-black/85 transition-colors cursor-pointer shadow-sm"
              >
                <span>룩북 만들기</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
