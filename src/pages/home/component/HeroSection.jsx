import React from "react";
import main_slogan from "../../../img/main_slogan.png";
import { Plus } from "lucide-react";

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
  return (
    <section className="w-full pt-[120px]  bg-gradient-to-b from-base-pink via-base-pink/50 to-white pt-16 pb-20 px-6 flex flex-col items-center">
      <p className="caption3 text-accent-pink">Add New Item</p>

      {/* 슬로건 이미지 */}
      <div className="mb-10 w-full sm:w-[70%] max-w-[1000px] flex justify-center">
        <img
          src={main_slogan}
          alt="What's in My Closet?"
          className="w-full object-contain"
        />
      </div>

      {/* URL 인풋 */}
      <form
        onSubmit={handleAddUrl}
        className="w-full max-w-3xl flex items-center border-b border-black pb-2 mb-3"
      >
        <input
          type="text"
          placeholder="Drop a Product Url Here!"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="w-full bg-transparent outline-none body4 text-black placeholder:text-light-text px-2"
        />

        <button
          type="submit"
          className="bg-black text-white px-[15px] py-[10px] body4 flex gap-[5px] hover:bg-black/80 transition-colors shrink-0 cursor-pointer"
        >
          <span>
            <Plus size={20} strokeWidth={1.5} />
          </span>
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

      {/* 제품 추가 폼 */}
      {isFormOpen && (
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-sm border border-gray/40 overflow-hidden mt-6 p-6">
          {/* PRODUCT PREVIEW */}
          <div className="border border-gray/50 rounded overflow-hidden mb-8">
            <div className="bg-white px-4 py-3 border-b border-gray/40 flex justify-between items-center">
              <span className="caption3 text-xs tracking-widest text-dark-gray">
                PRODUCT PREVIEW
              </span>

              {formData.url && (
                <a
                  href={formData.url}
                  target="_blank"
                  rel="noreferrer"
                  className="caption3 text-xs underline underline-offset-4 text-black hover:text-accent-pink flex items-center gap-1"
                >
                  OPEN ↗
                </a>
              )}
            </div>

            {/* 실제 상품 페이지 iframe 또는 이미지 */}
            {formData.url ? (
              <div className="w-full h-[700px] bg-white overflow-hidden">
                <iframe
                  src={formData.url}
                  title="Product Preview"
                  className="w-full h-full border-0"
                />
              </div>
            ) : formData.previewImage ? (
              <div className="w-full h-96 bg-white overflow-hidden flex items-center justify-center relative group">
                <img
                  src={formData.previewImage}
                  alt="Product Preview"
                  className="w-full h-full object-cover object-top"
                />
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs cursor-pointer transition-opacity">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  클릭하여 다른 이미지로 변경
                </label>
              </div>
            ) : (
              <label className="w-full h-96 bg-[#D9D9D9] flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <span className="text-transparent">Upload Image</span>
              </label>
            )}
          </div>

          {/* 하단 폼 */}
          <div className="flex flex-col gap-5 px-2">
            {/* IsOwned */}
            <div className="flex items-center">
              <span className="w-32 caption3 text-xs text-black flex items-center gap-1">
                IsOwned
                <span className="text-accent-pink font-bold">*</span>
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      isOwned: "Want",
                    })
                  }
                  className={`px-4 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                    formData.isOwned === "Want"
                      ? "bg-accent-pink text-white"
                      : "border border-gray text-dark-gray bg-white hover:border-black"
                  }`}
                >
                  Want
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      isOwned: "Have",
                    })
                  }
                  className={`px-4 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                    formData.isOwned === "Have"
                      ? "bg-accent-pink text-white"
                      : "border border-gray text-dark-gray bg-white hover:border-black"
                  }`}
                >
                  Have
                </button>
              </div>
            </div>

            {/* Product Name */}
            <div className="flex items-center">
              <span className="w-32 caption3 text-xs text-black flex items-center gap-1">
                Product Name
                <span className="text-accent-pink font-bold">*</span>
              </span>

              <input
                type="text"
                value={formData.title}
                placeholder="상품 제목을 입력해주세요"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                className="flex-1 bg-transparent border-b border-dotted border-gray py-1 text-xs outline-none text-black placeholder:text-light-text focus:border-black"
              />
            </div>

            {/* Memo */}
            <div className="flex items-center">
              <span className="w-32 caption3 text-xs text-black">Memo</span>

              <input
                type="text"
                value={formData.memo}
                placeholder="저장 이유, 코디 팁, 사이즈 등을 메모해보세요"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    memo: e.target.value,
                  })
                }
                className="flex-1 bg-transparent border-b border-dotted border-gray py-1 text-xs outline-none text-black placeholder:text-light-text focus:border-black"
              />
            </div>

            {/* Folder */}
            <div className="flex items-center">
              <span className="w-32 caption3 text-xs text-black">Folder</span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      folder: "None",
                    })
                  }
                  className={`px-4 py-1 rounded-full text-xs cursor-pointer ${
                    formData.folder === "None"
                      ? "bg-accent-pink text-white"
                      : "border border-gray text-dark-gray"
                  }`}
                >
                  None
                </button>

                <button
                  type="button"
                  className="w-10 h-6 rounded-full border border-dashed border-gray flex items-center justify-center text-gray hover:text-black hover:border-black text-sm cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center">
              <span className="w-32 caption3 text-xs text-black">Category</span>

              <div className="flex flex-wrap gap-2">
                {["Top", "Bottom", "Outer", "Shoes", "Acc"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        category: cat,
                      })
                    }
                    className={`px-4 py-1 rounded-full text-xs transition-colors cursor-pointer ${
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
            <div className="flex items-center">
              <span className="w-32 caption3 text-xs text-black">Style</span>

              <div className="flex flex-wrap items-center gap-2">
                {["None", "Casual", "Feminine", "Hip", "Y2k"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        style: st,
                      })
                    }
                    className={`px-4 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                      formData.style === st
                        ? "bg-accent-pink text-white"
                        : "border border-gray text-dark-gray bg-white hover:border-black"
                    }`}
                  >
                    {st}
                  </button>
                ))}

                <button
                  type="button"
                  className="w-10 h-6 rounded-full border border-dashed border-gray flex items-center justify-center text-gray hover:text-black hover:border-black text-sm cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-end items-center gap-3 pt-6 mt-4 border-t border-gray/30">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-dark-gray hover:text-black px-3 py-2 cursor-pointer"
            >
              취소
            </button>

            <button
              type="button"
              onClick={handleSaveItem}
              className="bg-black text-white px-5 py-2 rounded-sm text-xs font-medium flex items-center gap-2 hover:bg-black/85 transition-colors tracking-wider cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              SAVE
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
