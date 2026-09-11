import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "./component/HeroSection";
import ClosetSection from "./component/ClosetSection";
import LookbookSection from "./component/LookbookSection";
import StyleSection from "./component/StyleSection";
import { compressImage } from "../../utils/compressImage";

const INITIAL_FORM_DATA = {
  title: "",
  isOwned: "Have",
  memo: "",
  folder: "None",
  category: "Top",
  style: "None",
  styles: [],
  previewImage: "",
  url: "",
};

export default function Home() {
  const navigate = useNavigate();

  // 🔥 로그인 상태 확인 (localStorage의 "fitlog_logged_in" 기준)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [urlInput, setUrlInput] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  useEffect(() => {
    // 로그인 여부 체크
    const loggedIn = localStorage.getItem("fitlog_logged_in") === "true";
    setIsLoggedIn(loggedIn);

    // 아이템 로드
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

  // 🔥 로그인 체크 래퍼 함수 (로그인 안 되어있으면 차단 후 로그인 페이지로 이동)
  const checkLoginBeforeAction = (actionCallback) => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    actionCallback();
  };

  // 1. URL 추가 핸들러 (로그인 체크 제거 -> 비로그인도 폼 열림 허용)
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

  // 2. 링크 없이 추가 (로그인 체크 제거)
  const handleOpenWithoutLink = () => {
    setFormData(INITIAL_FORM_DATA);
    setIsFormOpen(true);
  };

  // 3. 로컬 이미지 직접 업로드 (로그인 체크 제거)
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 600, 0.7);
      setFormData((prev) => ({
        ...prev,
        previewImage: compressed,
      }));
    } catch (err) {
      console.error("이미지 압축 실패:", err);
    }
  };
  // 4. 아이템 저장
  const handleSaveItem = () => {
    checkLoginBeforeAction(() => {
      if (!formData.title.trim()) {
        alert("상품 제목을 입력해주세요.");
        return;
      }

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
        styles: resolvedStyles,
        style: resolvedStyles[0] || "None",
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
    });
  };

  return (
    <div className="w-full min-h-screen bg-white text-black flex flex-col items-center overflow-x-hidden">
      {/* 🔥 1. 로그인 상태가 아닐 때만 랜딩(히어로) 섹션 노출 */}

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
      <ClosetSection
        items={items}
        setIsFormOpen={() => {
          checkLoginBeforeAction(() => {
            setIsFormOpen(true);
          });
        }}
      />
      {/* 3. My LookBook 섹션 */}
      <LookbookSection />

      {/* 4. What styles do you love? 통계 섹션 */}
      <StyleSection />
    </div>
  );
}
