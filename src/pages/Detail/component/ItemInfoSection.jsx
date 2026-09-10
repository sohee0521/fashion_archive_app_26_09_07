import React, { useState, useEffect, useRef } from "react";
import { ArrowUpRight, Plus, Check, X, Trash2 } from "lucide-react";
import hanger from "../../../img/hanger.svg";

const DEFAULT_STYLES = ["Casual", "Feminine", "Hip", "Y2k"];
const CATEGORIES = ["Top", "Bottom", "Outer", "Shoes", "Acc"];

export default function ItemInfoSection({
  item,
  isEditing,
  setIsEditing,
  availableFolders,
  setAvailableFolders,
  onSave,
  onDelete, // 🔥 삭제 핸들러 prop 추가
  onAddImage,
  onRemoveImage,
}) {
  const fileInputRef = useRef(null);

  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderInput, setNewFolderInput] = useState("");

  const [styles, setStyles] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("fitlog_custom_styles") || "[]",
      );
      return Array.from(new Set([...DEFAULT_STYLES, ...saved]));
    } catch {
      return DEFAULT_STYLES;
    }
  });
  const [isAddingStyle, setIsAddingStyle] = useState(false);
  const [newStyleInput, setNewStyleInput] = useState("");

  const [form, setForm] = useState({
    isOwned: "Have",
    title: "",
    memo: "",
    category: "Top",
    styles: [],
    folder: "None",
  });

  const hasUrl = Boolean(item?.url && item.url.trim());

  useEffect(() => {
    if (item) {
      setForm({
        isOwned: item.isOwned || "Have",
        title: item.title || "",
        memo: item.memo || "",
        category: item.category || "Top",
        styles: Array.isArray(item.styles)
          ? item.styles
          : item.style && item.style !== "None"
            ? [item.style]
            : [],
        folder: item.folder || "None",
      });
    }
  }, [item]);

  const toggleStyle = (st) => {
    if (st === "None") return setForm((p) => ({ ...p, styles: [] }));
    setForm((p) => ({
      ...p,
      styles: p.styles.includes(st)
        ? p.styles.filter((s) => s !== st)
        : [...p.styles, st],
    }));
  };

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

    toggleStyle(trimmed);
    setNewStyleInput("");
    setIsAddingStyle(false);
  };

  const handleDeleteStyle = (e, targetStyle) => {
    e.stopPropagation();
    if (DEFAULT_STYLES.includes(targetStyle)) return;

    const updatedStyles = styles.filter((s) => s !== targetStyle);
    setStyles(updatedStyles);

    const customOnly = updatedStyles.filter((s) => !DEFAULT_STYLES.includes(s));
    localStorage.setItem("fitlog_custom_styles", JSON.stringify(customOnly));

    setForm((p) => ({
      ...p,
      styles: p.styles.filter((s) => s !== targetStyle),
    }));
  };

  const handleCreateFolder = () => {
    const trimmed = newFolderInput.trim();
    if (!trimmed) {
      setIsAddingFolder(false);
      return;
    }

    if (!availableFolders.includes(trimmed)) {
      const updatedFolders = [...availableFolders, trimmed];
      setAvailableFolders(updatedFolders);

      const customOnly = updatedFolders.filter(
        (f) => f !== "None" && f !== "All",
      );
      localStorage.setItem("fitlog_custom_folders", JSON.stringify(customOnly));
    }

    setForm((p) => ({ ...p, folder: trimmed }));
    setNewFolderInput("");
    setIsAddingFolder(false);
  };

  const handleDeleteFolder = (e, targetFolder) => {
    e.stopPropagation();
    if (targetFolder === "None" || targetFolder === "All") return;

    const updatedFolders = availableFolders.filter((f) => f !== targetFolder);
    setAvailableFolders(updatedFolders);

    const customOnly = updatedFolders.filter(
      (f) => f !== "None" && f !== "All",
    );
    localStorage.setItem("fitlog_custom_folders", JSON.stringify(customOnly));

    if (form.folder === targetFolder) {
      setForm((p) => ({ ...p, folder: "None" }));
    }
  };

  return (
    <div className="w-full flex flex-col gap-14">
      <div className="w-full flex flex-col gap-5">
        <h2 className="display2 text-accent-pink italic select-none">Info</h2>

        <div
          className={`w-full flex flex-col ${hasUrl ? "lg:flex-row" : ""} gap-10 items-stretch`}
        >
          {/* 상품 프리뷰 윈도우 (링크 있을 때만) */}
          {hasUrl && (
            <div className="w-full lg:w-[58%] border border-gray/40 rounded-sm bg-white overflow-hidden flex flex-col shadow-2xs">
              <div className="px-4 py-2.5 border-b border-gray/30 bg-[#FAFAFA] flex justify-between items-center select-none">
                <span className="caption3 text-dark-gray">Product Preview</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="caption3 text-black hover:text-accent-pink flex items-center gap-1"
                >
                  <span>OPEN</span>
                  <ArrowUpRight size={15} strokeWidth={1.5} />
                </a>
              </div>

              <div className="relative w-full h-[480px] sm:h-[560px] bg-white overflow-hidden group">
                <iframe
                  src={item.url}
                  title="Product Preview"
                  className="w-full h-full border-0 pointer-events-none"
                />
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 z-10 flex items-end justify-end p-4 bg-black/0 group-hover:bg-black/10 transition-colors"
                >
                  <span className="opacity-0 group-hover:opacity-100 bg-black/75 text-white px-3 py-1.5 rounded-full caption3 flex items-center gap-1.5 shadow-md transition-opacity">
                    <span>Visit Site</span>
                    <ArrowUpRight size={14} strokeWidth={1.5} />
                  </span>
                </a>
              </div>
            </div>
          )}

          {/* 우측 편집 영역 */}
          <div
            className={`flex flex-col justify-between py-[20px] ${
              hasUrl
                ? "flex-1"
                : "w-full max-w-3xl bg-white border border-gray/30 rounded-sm p-6 sm:p-8 shadow-2xs"
            }`}
          >
            <div className="flex-1 flex flex-col justify-start gap-5 py-1">
              {/* Want / Have */}
              <div className="flex flex-col gap-1.5">
                <span className="body4 text-dark-gray">IsOwned</span>
                <div>
                  {isEditing ? (
                    <div className="flex gap-2">
                      {["Want", "Have"].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() =>
                            setForm((p) => ({ ...p, isOwned: status }))
                          }
                          className={`px-3 py-1 rounded-full body4 cursor-pointer transition-colors ${
                            form.isOwned === status
                              ? "bg-base-pink text-accent-pink border border-accent-pink font-medium"
                              : "border border-gray text-dark-gray bg-white hover:border-black"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded-full body4 font-medium select-none bg-base-pink text-accent-pink">
                      {item.isOwned || "Have"}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Name */}
              <div className="flex flex-col gap-1.5">
                <span className="body4 text-dark-gray">Product Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, title: e.target.value }))
                    }
                    className="body2 border-b border-black outline-none bg-transparent py-0.5 text-black"
                  />
                ) : (
                  <h3 className="caption1 font-medium text-black">
                    {item.title}
                  </h3>
                )}
              </div>

              {/* Memo */}
              <div className="flex flex-col gap-1.5">
                <span className="body4 text-dark-gray">Memo</span>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={form.memo}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, memo: e.target.value }))
                    }
                    placeholder="메모를 입력하세요"
                    className="body4 border border-gray/50 rounded-xs p-2.5 outline-none bg-transparent resize-none text-black focus:border-black"
                  />
                ) : (
                  <p className="caption2 text-black leading-relaxed whitespace-pre-line">
                    {item.memo || "작성된 메모가 없습니다."}
                  </p>
                )}
              </div>

              {/* 속성 폼 */}
              <div className="flex flex-col gap-4 pt-1">
                {/* Category */}
                <div className="flex items-start">
                  <span className="w-24 text-dark-gray body4 shrink-0 leading-[28px]">
                    Category
                  </span>
                  {isEditing ? (
                    <div className="flex flex-wrap gap-1.5">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() =>
                            setForm((p) => ({ ...p, category: cat }))
                          }
                          className={`px-3 py-0.5 rounded-full caption3 transition-colors cursor-pointer ${
                            form.category === cat
                              ? "bg-accent-pink text-white"
                              : "border border-gray text-dark-gray bg-white hover:border-black"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="px-3 py-0.5 rounded-full border border-gray/70 text-black caption3">
                      {item.category || "None"}
                    </span>
                  )}
                </div>

                {/* Style */}
                <div className="flex items-start">
                  <span className="w-24 text-dark-gray body4 shrink-0 leading-[28px]">
                    Style
                  </span>
                  {isEditing ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleStyle("None")}
                        className={`px-3 py-0.5 rounded-full caption3 cursor-pointer transition-colors ${
                          form.styles.length === 0
                            ? "bg-accent-pink text-white"
                            : "border border-gray text-dark-gray bg-white hover:border-black"
                        }`}
                      >
                        None
                      </button>
                      {styles.map((st) => {
                        const isCustom = !DEFAULT_STYLES.includes(st);
                        const active = form.styles.includes(st);

                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => toggleStyle(st)}
                            className={`group relative px-3 py-0.5 rounded-full caption3 transition-colors cursor-pointer flex items-center gap-1 ${
                              active
                                ? "bg-accent-pink text-white border border-accent-pink font-medium"
                                : "border border-gray text-dark-gray bg-white hover:border-black"
                            }`}
                          >
                            <span>#{st}</span>
                            {active && <Check size={12} strokeWidth={2.5} />}
                            {isCustom && (
                              <span
                                onClick={(e) => handleDeleteStyle(e, st)}
                                className={`p-0.5 rounded-full hover:bg-black/20 transition-all ${
                                  active
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
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(form.styles.length > 0 ? form.styles : ["None"]).map(
                        (st) => (
                          <span
                            key={st}
                            className="px-3 py-0.5 rounded-full border border-gray/70 text-black caption3"
                          >
                            {st === "None" ? "None" : `#${st}`}
                          </span>
                        ),
                      )}
                    </div>
                  )}
                </div>

                {/* Folder */}
                <div className="flex items-start">
                  <span className="w-24 text-dark-gray body4 shrink-0 leading-[28px]">
                    Folder
                  </span>
                  {isEditing ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {availableFolders.map((f) => {
                        const isCustom = f !== "None" && f !== "All";
                        const isSelected = form.folder === f;

                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() =>
                              setForm((p) => ({ ...p, folder: f }))
                            }
                            className={`group relative px-3 py-0.5 rounded-full caption3 transition-colors cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-accent-pink text-white"
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
                                handleCreateFolder();
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
                            onClick={handleCreateFolder}
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
                  ) : (
                    <span className="px-3 py-0.5 rounded-full border border-gray/70 text-black caption3">
                      {item.folder || "None"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 🔥 하단 버튼 영역: Edit 모드일 때만 좌측에 Delete 버튼 노출 */}
            <div
              className={`w-full flex items-center mt-6 pt-4 border-t border-gray/20 ${
                isEditing ? "justify-between" : "justify-end"
              }`}
            >
              {/* 1. 편집 모드일 때: [좌측] Delete 버튼 */}
              {isEditing && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="flex items-center gap-1.5 text-red-500 hover:text-red-600 body4 px-1 py-1 transition-colors cursor-pointer"
                  title="아이템 삭제"
                >
                  <Trash2 size={16} strokeWidth={1.8} />
                  <span>Delete</span>
                </button>
              )}

              {/* 2. 우측 버튼들: [편집 중] Cancel / Save  vs  [평소] Edit */}
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 text-dark-gray hover:text-black body4 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => onSave(form)}
                    className="px-4 py-1 bg-black text-white rounded-xs body4 hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3.5 py-1 bg-black text-white hover:bg-black/60 transition-colors cursor-pointer rounded-xs"
                >
                  <span className="body4">Edit</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Image 섹션 */}
      <div className="w-full flex flex-col gap-4">
        <span className="body4 text-dark-gray select-none">Detail Image</span>

        <div className="flex flex-wrap items-center gap-4">
          {(item.detailImages || []).map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative w-[110px] h-[130px] sm:w-[130px] sm:h-[150px] bg-background border border-gray/40 overflow-hidden group shadow-2xs rounded-sm"
            >
              <img
                src={imgUrl}
                alt={`detail-${idx}`}
                className="w-full h-full object-cover"
              />

              {idx === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-black/60 text-white caption3 text-[10px] px-1.5 py-0.5 rounded-2xs select-none">
                  Main
                </span>
              )}

              <button
                type="button"
                onClick={() => onRemoveImage(idx)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black"
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>
          ))}

          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-[110px] h-[130px] sm:w-[130px] sm:h-[150px] border border-dashed border-accent-pink rounded-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-base-pink/30 transition-all select-none"
          >
            <div className="w-8 h-8 rounded-full border border-dashed border-accent-pink flex items-center justify-center text-accent-pink">
              <Plus size={18} strokeWidth={1.5} />
            </div>
            <span className="caption3 text-accent-pink">Add Image</span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={onAddImage}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
