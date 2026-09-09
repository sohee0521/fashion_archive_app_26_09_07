import React, { useState, useEffect } from "react";
import main_slogan from "../../../img/main_slogan.png";
import { Plus, Check, X } from "lucide-react";

const DEFAULT_STYLES = ["Casual", "Feminine", "Hip", "Y2k"];

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
  const [folders, setFolders] = useState(["None"]);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderInput, setNewFolderInput] = useState("");

  const [styles, setStyles] = useState(DEFAULT_STYLES);
  const [isAddingStyle, setIsAddingStyle] = useState(false);
  const [newStyleInput, setNewStyleInput] = useState("");

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

  return (
    <section className="w-full pt-[120px] bg-gradient-to-b from-base-pink via-base-pink/50 to-white pb-20 px-6 flex flex-col items-center">
      <p className="caption3 text-accent-pink">Add New Item</p>

      <div className="mb-10 w-full sm:w-[70%] max-w-[1000px] flex justify-center">
        <img
          src={main_slogan}
          alt="What's in My Closet?"
          className="w-full object-contain"
        />
      </div>

      <form
        onSubmit={handleAddUrl}
        className="w-full max-w-3xl flex items-center border-b border-black pb-2 mb-3"
      >
        <input
          type="text"
          placeholder="상품 링크를 붙여넣어보세요!"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="w-full bg-transparent outline-none body4 text-black placeholder:text-light-text px-2"
        />
        <button
          type="submit"
          className="bg-black text-white px-[15px] py-[10px] body4 flex gap-[5px] hover:bg-black/80 transition-colors shrink-0 cursor-pointer"
        >
          <Plus size={20} strokeWidth={1.5} />
          ADD
        </button>
      </form>

      {!isFormOpen && (
        <button
          type="button"
          onClick={handleOpenWithoutLink}
          className="caption3 text-light-text underline hover:text-black transition-colors cursor-pointer"
        >
          or add without a link
        </button>
      )}

      {isFormOpen && (
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-sm border border-gray/40 overflow-hidden mt-6 p-6">
          {/* 🔥 링크(formData.url)가 있을 때만 프리뷰 큰 박스 렌더링, 없으면 통째로 미표시 */}
          {Boolean(formData.url && formData.url.trim()) && (
            <div className="border border-gray/50 rounded overflow-hidden mb-8">
              <div className="bg-white px-4 py-3 border-b border-gray/40 flex justify-between items-center select-none">
                <span className="caption3 tracking-widest text-dark-gray">
                  PRODUCT PREVIEW
                </span>
                <a
                  href={formData.url}
                  target="_blank"
                  rel="noreferrer"
                  className="caption3 underline underline-offset-4 text-black hover:text-accent-pink flex items-center gap-1"
                >
                  OPEN ↗
                </a>
              </div>

              <div className="w-full h-[700px] bg-white overflow-hidden">
                <iframe
                  src={formData.url}
                  title="Product Preview"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-5 px-2">
            {/* IsOwned */}
            <div className="flex items-center">
              <span className="w-32 caption3 text-black flex items-center gap-1">
                IsOwned <span className="text-accent-pink font-bold">*</span>
              </span>
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
              <span className="w-32 caption3 text-black flex items-center gap-1">
                Product Name{" "}
                <span className="text-accent-pink font-bold">*</span>
              </span>
              <input
                type="text"
                value={formData.title}
                placeholder="상품 제목을 입력해주세요"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="flex-1 bg-transparent border-b border-dotted border-gray py-1 body4 outline-none text-black placeholder:text-light-text focus:border-black"
              />
            </div>

            {/* Memo */}
            <div className="flex items-center">
              <span className="w-32 caption3 text-black">Memo</span>
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
              <span className="w-32 caption3 text-black leading-[28px]">
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
              <span className="w-32 caption3 text-black">Category</span>
              <div className="flex flex-wrap gap-2">
                {["Top", "Bottom", "Outer", "Shoes", "Acc"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
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
              <span className="w-32 caption3 text-black leading-[28px]">
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
              onClick={handleSaveItem}
              className="bg-black text-white px-4 py-[7px] rounded-xs body4 font-medium flex items-center gap-2 hover:bg-black/85 transition-colors tracking-wider cursor-pointer"
            >
              SAVE
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
