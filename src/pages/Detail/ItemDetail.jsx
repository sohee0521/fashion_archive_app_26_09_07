import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ItemInfoSection from "./component/ItemInfoSection";
import UsedLookbookSection from "./component/UsedLookbookSection";
import { compressImage } from "../../utils/compressImage";

const STORAGE_KEYS = {
  ITEMS: "fitlog_items",
  LOOKBOOKS: "fitlog_lookbooks",
  CUSTOM_FOLDERS: "fitlog_custom_folders",
};

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [usedLookbooks, setUsedLookbooks] = useState([]);
  const [availableFolders, setAvailableFolders] = useState(["None"]);
  const [isEditing, setIsEditing] = useState(false);

  // 1. 데이터 로드 (Items, Custom Folders, Matched Lookbooks)
  // ItemDetail.jsx의 데이터 로드 useEffect 부분 수정
  useEffect(() => {
    try {
      const savedItems = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.ITEMS) || "[]",
      );
      const itemFolders = Array.isArray(savedItems)
        ? savedItems.map((it) => it.folder).filter(Boolean)
        : [];

      const customFolders = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.CUSTOM_FOLDERS) || "[]",
      );

      const mergedFolders = Array.from(
        new Set([
          "None",
          ...itemFolders,
          ...(Array.isArray(customFolders) ? customFolders : []),
        ]),
      ).filter((f) => f !== "All");
      setAvailableFolders(mergedFolders);

      if (Array.isArray(savedItems)) {
        const current = savedItems.find((it) => String(it.id) === String(id));
        if (current) {
          // 🔥 핵심: detailImages가 비어있는데 imageUrl이나 url 스크랩 이미지가 있다면 자동으로 detailImages에 넣어줌
          let images = Array.isArray(current.detailImages)
            ? [...current.detailImages]
            : [];
          if (images.length === 0 && current.imageUrl) {
            images = [current.imageUrl];
          }

          setItem({
            ...current,
            detailImages: images,
            imageUrl: images[0] || current.imageUrl || "",
          });
        }
      }

      const savedLbs = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.LOOKBOOKS) || "[]",
      );
      if (Array.isArray(savedLbs)) {
        const matched = savedLbs.filter((lb) =>
          (lb.items || []).some((it) => String(it.id) === String(id)),
        );
        setUsedLookbooks(matched);
      }
    } catch (err) {
      console.error("데이터 로드 실패:", err);
    }
  }, [id]);

  // 2. LocalStorage 동기화 공통 함수
  const syncStorage = useCallback((updatedItem) => {
    setItem(updatedItem);

    try {
      // fitlog_items 동기화
      const items = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.ITEMS) || "[]",
      );
      const updatedItems = items.map((it) =>
        String(it.id) === String(updatedItem.id) ? updatedItem : it,
      );
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(updatedItems));

      // fitlog_lookbooks 내부 아이템 동기화
      const lbs = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.LOOKBOOKS) || "[]",
      );
      const updatedLbs = lbs.map((lb) => ({
        ...lb,
        items: (lb.items || []).map((it) =>
          String(it.id) === String(updatedItem.id)
            ? { ...it, ...updatedItem, imageUrl: updatedItem.imageUrl }
            : it,
        ),
      }));
      localStorage.setItem(STORAGE_KEYS.LOOKBOOKS, JSON.stringify(updatedLbs));
    } catch (err) {
      console.error("스토리지 동기화 실패:", err);
    }
  }, []);

  // 3. 디테일 정보 수정 저장
  const handleSaveEdit = (editForm) => {
    if (!editForm.title.trim()) {
      alert("Product Name을 입력해주세요.");
      return;
    }

    const updated = {
      ...item,
      ...editForm,
      style: editForm.styles[0] || "None",
    };
    syncStorage(updated);
    setIsEditing(false);
  };

  // 🔥 4. 아이템 삭제 핸들러 추가
  const handleDeleteItem = () => {
    if (!window.confirm("이 아이템을 옷장에서 완전히 삭제하시겠습니까?"))
      return;

    try {
      // 1) fitlog_items에서 삭제
      const savedItems = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.ITEMS) || "[]",
      );
      const updatedItems = savedItems.filter(
        (it) => String(it.id) !== String(id),
      );
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(updatedItems));

      // 2) fitlog_lookbooks 내부 items에서도 해당 아이템 정리
      const savedLbs = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.LOOKBOOKS) || "[]",
      );
      const updatedLbs = savedLbs.map((lb) => ({
        ...lb,
        items: (lb.items || []).filter((it) => String(it.id) !== String(id)),
      }));
      localStorage.setItem(STORAGE_KEYS.LOOKBOOKS, JSON.stringify(updatedLbs));

      alert("아이템이 삭제되었습니다.");
      navigate("/archive");
    } catch (err) {
      console.error("아이템 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // 5. 이미지 추가/삭제 핸들러
  const handleAddDetailImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !item) return;

    try {
      const compressedImgUrl = await compressImage(file, 600, 0.7);
      const newImages = [...(item.detailImages || []), compressedImgUrl];

      syncStorage({
        ...item,
        detailImages: newImages,
        imageUrl: newImages[0],
      });
    } catch (err) {
      console.error("디테일 이미지 압축 실패:", err);
    }
    e.target.value = "";
  };

  const handleRemoveDetailImage = (targetIdx) => {
    if (!item) return;
    const newImages = (item.detailImages || []).filter(
      (_, idx) => idx !== targetIdx,
    );
    syncStorage({
      ...item,
      detailImages: newImages,
      imageUrl: newImages[0] || "",
    });
  };

  if (!item) {
    return (
      <div className="w-full min-h-screen pt-[120px] flex flex-col items-center justify-center text-center">
        <p className="body2 text-dark-gray mb-4">아이템을 찾을 수 없습니다.</p>
        <button
          type="button"
          onClick={() => navigate("/archive")}
          className="border border-black px-4 py-2 body4 hover:bg-black hover:text-white transition-colors cursor-pointer"
        >
          아카이브로 돌아가기
        </button>
      </div>
    );
  }

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
            Curate your wardrobe, piece by piece.
          </span>
        </div>
      </section>

      {/* 본체 */}
      <main className="flex-1 w-full px-8 sm:px-16 lg:px-[180px] py-12 flex flex-col gap-16">
        <ItemInfoSection
          item={item}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          availableFolders={availableFolders}
          setAvailableFolders={setAvailableFolders}
          onSave={handleSaveEdit}
          onDelete={handleDeleteItem} // 🔥 삭제 핸들러 전달
          onAddImage={handleAddDetailImage}
          onRemoveImage={handleRemoveDetailImage}
        />
        <UsedLookbookSection lookbooks={usedLookbooks} />
      </main>
    </div>
  );
}
