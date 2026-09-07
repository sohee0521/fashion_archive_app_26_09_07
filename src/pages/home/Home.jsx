import { useState, useEffect } from "react";
import HeroSection from "./component/HeroSection";
import ClosetSection from "./component/ClosetSection";
import LookbookSection from "./component/LookbookSection";
import StyleSection from "./component/StyleSection";

export default function Home() {
  // URL 입력창 및 폼 오픈 상태
  const [urlInput, setUrlInput] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // 로컬스토리지 아이템 목록
  const [items, setItems] = useState([]);

  // 신규 등록 폼 State
  const [formData, setFormData] = useState({
    title: "",
    isOwned: "Have",
    memo: "",
    folder: "None",
    category: "Top",
    style: "None",
    previewImage: "",
    url: "",
  });

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
      title: "",
      isOwned: "Have",
      memo: "",
      folder: "None",
      category: "Top",
      style: "None",
      previewImage: "",
      url: targetUrl,
    });

    setIsFormOpen(true);
  };

  // 2. 링크 없이 추가
  const handleOpenWithoutLink = () => {
    setFormData({
      title: "",
      isOwned: "Have",
      memo: "",
      folder: "None",
      category: "Top",
      style: "None",
      previewImage: "",
      url: "",
    });

    setIsFormOpen(true);
  };

  // 3. 로컬 이미지 직접 업로드
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          previewImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 4. 아이템 저장
  const handleSaveItem = () => {
    if (!formData.title.trim()) {
      alert("상품 제목을 입력해주세요.");
      return;
    }

    const newItem = {
      id: Date.now(),
      title: formData.title,
      isOwned: formData.isOwned,
      memo: formData.memo,
      folder: formData.folder,
      category: formData.category,
      style: formData.style,
      imageUrl: formData.previewImage || "",
      url: formData.url,
    };

    const updated = [newItem, ...items];
    setItems(updated);
    localStorage.setItem("fitlog_items", JSON.stringify(updated));

    setIsFormOpen(false);
    setUrlInput("");
    setFormData({
      title: "",
      isOwned: "Have",
      memo: "",
      folder: "None",
      category: "Top",
      style: "None",
      previewImage: "",
      url: "",
    });
  };

  return (
    <div className="w-full min-h-screen bg-white text-black  flex flex-col items-center overflow-x-hidden">
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
