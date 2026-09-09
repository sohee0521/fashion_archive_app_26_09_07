import { useState, useEffect } from "react";
import HeroSection from "./component/HeroSection";
import ClosetSection from "./component/ClosetSection";
import LookbookSection from "./component/LookbookSection";
import StyleSection from "./component/StyleSection";
import { compressImage } from "../../utils/compressImage";

// 초기 폼 상태 상수 (styles 배열 추가)
const INITIAL_FORM_DATA = {
  title: "",
  isOwned: "Have",
  memo: "",
  folder: "None",
  category: "Top",
  style: "None",
  styles: [], // 🔥 다중 스타일 지원
  previewImage: "",
  url: "",
};

export default function Home() {
  // URL 입력창 및 폼 오픈 상태
  const [urlInput, setUrlInput] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // 로컬스토리지 아이템 목록
  const [items, setItems] = useState([]);

  // 신규 등록 폼 State
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  // 로컬스토리지 불러오기
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

  // 1. URL 추가 핸들러
  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    let targetUrl = urlInput.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    setFormData({
      ...INITIAL_FORM_DATA,
      url: targetUrl,
    });

    setIsFormOpen(true);
  };

  // 2. 링크 없이 추가
  const handleOpenWithoutLink = () => {
    setFormData(INITIAL_FORM_DATA);
    setIsFormOpen(true);
  };

  // 3. 로컬 이미지 직접 업로드
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 🔥 원본 대신 압축된 Base64로 설정
      const compressed = await compressImage(file, 600, 0.7);
      setFormData((prev) => ({
        ...prev,
        previewImage: compressed,
      }));
    } catch (err) {
      console.error("이미지 압축 실패:", err);
    }
  };

  // 4. 아이템 저장 (🔥 detailImages 및 styles 배열 저장 보강)
  const handleSaveItem = () => {
    if (!formData.title.trim()) {
      alert("상품 제목을 입력해주세요.");
      return;
    }

    // 스타일 배열 확정 (styles 우선, 없을 시 단수 style 참조)
    const resolvedStyles =
      Array.isArray(formData.styles) && formData.styles.length > 0
        ? formData.styles
        : formData.style && formData.style !== "None"
          ? [formData.style]
          : [];

    const newItem = {
      id: Date.now(),
      title: formData.title,
      isOwned: formData.isOwned,
      memo: formData.memo,
      folder: formData.folder || "None",
      category: formData.category || "Top",
      // 🔥 스타일 복수/단수형 동시 대응
      styles: resolvedStyles,
      style: resolvedStyles[0] || "None",
      // 🔥 대표 이미지 및 디테일 이미지 목록 동기화
      imageUrl: formData.previewImage || "",
      detailImages: formData.previewImage ? [formData.previewImage] : [],
      url: formData.url || "",
    };

    const updated = [newItem, ...items];
    setItems(updated);
    localStorage.setItem("fitlog_items", JSON.stringify(updated));

    setIsFormOpen(false);
    setUrlInput("");
    setFormData(INITIAL_FORM_DATA);
  };

  return (
    <div className="w-full min-h-screen bg-white text-black flex flex-col items-center overflow-x-hidden">
      {/* 1. 히어로 및 상품 추가 섹션 */}
      <HeroSection
        urlInput={urlInput}
        setUrlInput={setUrlInput}
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        formData={formData}
        setFormData={setFormData}
        handleAddUrl={handleAddUrl}
        handleOpenWithoutLink={handleOpenWithoutLink}
        handleImageUpload={handleImageUpload}
        handleSaveItem={handleSaveItem}
      />

      {/* 2. My Closet 무한 롤링 섹션 */}
      <ClosetSection items={items} setIsFormOpen={setIsFormOpen} />

      {/* 3. My LookBook 섹션 */}
      <LookbookSection />

      {/* 4. What styles do you love? 통계 섹션 */}
      <StyleSection />
    </div>
  );
}
