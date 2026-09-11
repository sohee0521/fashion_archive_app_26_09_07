import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Folder } from "lucide-react";
import hanger from "../../../img/hanger.svg";

export default function HallOfFame({
  hallOfFameItems,
  topFolderName,
  folderItemCount,
  folderPreviewImages,
  isVisible,
}) {
  const navigate = useNavigate();

  // 🔥 아카이브 페이지로 폴더 선택 상태를 넘겨주는 함수
  const handleMoveToFolder = () => {
    navigate("/archive", { state: { selectedFolder: topFolderName } });
  };

  return (
    <div
      className={`w-full flex flex-col gap-6 transition-all duration-700 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="border-b border-[#F0F0F0] pb-3">
        <h2 className="display2 text-black">3 Hall of Fame</h2>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-10 items-stretch">
        {/* Most Used Saved (Top 3) */}
        <div className="2xl:col-span-7 flex flex-col gap-3">
          <span className="body2 text-accent-pink font-medium">
            Most Used Saved
          </span>
          <span className="caption3 text-dark-gray -mt-2">
            &apos;MY LOOK&apos; 코디에 가장 많이 조립된 아이템
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-1">
            {hallOfFameItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/itemDetail/${item.id}`)}
                className="rounded-sm border border-[#EBEBEB] flex flex-col cursor-pointer hover:border-accent-pink transition-all shadow-2xs group overflow-hidden bg-white"
              >
                <div className="w-full aspect-[4/5] bg-[#FAFAFA] flex items-center justify-center border-b border-gray/10">
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <img
                      src={hanger}
                      alt="no image"
                      className="w-8 h-8 opacity-30"
                    />
                  )}
                </div>
                <div className="px-3.5 py-3 flex flex-col">
                  <span className="caption1 text-black font-medium">
                    {item.rank}
                  </span>
                  <span className="caption2 text-black truncate mt-0.5 font-medium">
                    {item.title}
                  </span>
                  <span className="text-dark-gray mt-1 caption3">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Preference Folder */}
        <div className="2xl:col-span-5 flex flex-col gap-3">
          <span className="body2 text-accent-pink font-medium">
            Top Preference Folder
          </span>
          <span className="caption3 text-dark-gray -mt-2">
            가장 많은 아이템이 담긴 폴더
          </span>

          <div className="flex items-center justify-between mt-1 flex-1">
            {/* 🔥 폴더 카드 전체 영역에 호버 시 이미지 확대(group-hover) 및 클릭 시 폴더 상태 전달 적용 */}
            <div
              onClick={handleMoveToFolder}
              className="w-[300px] h-[360px] p-5 flex flex-col justify-end relative group shrink-0 cursor-pointer overflow-hidden rounded-2xl"
            >
              <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center pointer-events-none w-[160px] h-[150px]">
                {/* 뒤쪽 카드 */}
                <div className="absolute right-0 top-3 w-[200px] h-[260px] bg-[#EAEAEA] rounded-lg shadow-sm border border-gray/30 transform rotate-6 translate-x-12 overflow-hidden transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                  {folderPreviewImages[1] && (
                    <img
                      src={folderPreviewImages[1]}
                      alt=""
                      className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                </div>
                {/* 앞쪽 카드 */}
                <div className="absolute left-0 top-0 w-[200px] h-[260px] bg-[#F5F5F5] rounded-lg shadow-md border border-gray/30 transform translate-x-[-40px] -rotate-4 overflow-hidden z-10 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2">
                  {folderPreviewImages[0] ? (
                    <img
                      src={folderPreviewImages[0]}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-100">
                      <img src={hanger} alt="" className="w-7 h-7 opacity-30" />
                    </div>
                  )}
                </div>
              </div>

              {/* 하단 연핑크 폴더 바 */}
              <div className="relative z-20 bg-[#FFF0F5] border border-pink-100/80 rounded-sm p-3.5 flex items-center gap-3 shadow-2xs transition-transform duration-300 group-hover:translate-y-[-2px]">
                <div className="w-9 h-9 rounded-full bg-white text-accent-pink flex items-center justify-center shrink-0 shadow-2xs">
                  <Folder size={17} strokeWidth={1.8} />
                </div>
                <div className="flex flex-col truncate">
                  <h4 className="caption2 text-black font-medium truncate leading-tight">
                    {topFolderName}
                  </h4>
                  <span className="text-dark-gray caption3">
                    {folderItemCount} ITEMS
                  </span>
                </div>
              </div>
            </div>

            {/* View Folder 버튼 클릭 시에도 동일한 폴더 상태 전달 */}
            <div
              onClick={handleMoveToFolder}
              className="flex items-center gap-[5px] cursor-pointer text-black hover:text-accent-pink transition-colors"
            >
              <span className="display3">View Folder</span>
              <ArrowRight size={20} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
