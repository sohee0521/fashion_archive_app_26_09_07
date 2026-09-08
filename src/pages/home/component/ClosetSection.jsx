import { MoveRight } from "lucide-react";
import logoImg from "../../../img/Logo1.png";
import { Link, useNavigate } from "react-router-dom";
import hanger from "../../../img/hanger.svg";

export default function ClosetSection({ items, setIsFormOpen }) {
  const navigate = useNavigate();

  // 캡처 속 5개 카드의 크기 및 위치 규격 (불변 유지)
  const emptyCardTemplates = [
    {
      width: "w-[210px]",
      height: "h-[270px]",
      translate: "-translate-y-4",
      circle: "w-10 h-10 text-xl",
      textSize: "caption3",
    },
    {
      width: "w-[280px]",
      height: "h-[370px]",
      translate: "translate-y-3",
      circle: "w-11 h-11 text-2xl",
      textSize: "caption3",
    },
    {
      width: "w-[180px]",
      height: "h-[210px]",
      translate: "-translate-y-8",
      circle: "w-9 h-9 text-lg",
      textSize: "caption3",
    },
    {
      width: "w-[220px]",
      height: "h-[310px]",
      translate: "translate-y-8",
      circle: "w-10 h-10 text-xl",
      textSize: "caption3",
    },
    {
      width: "w-[230px]",
      height: "h-[290px]",
      translate: "-translate-y-2",
      circle: "w-10 h-10 text-xl",
      textSize: "caption3",
    },
  ];

  // 등록된 아이템 개수가 템플릿(5개)보다 많아지면 템플릿을 자동으로 순환 반복
  const totalSlots = Math.max(emptyCardTemplates.length, items.length);

  return (
    <section className="w-full py-24 relative flex flex-col justify-center overflow-hidden">
      {/* 배경 은은한 로고 */}
      <div className="absolute left-6 top-8 z-0 w-[300px] pointer-events-none select-none opacity-40">
        <img src={logoImg} alt="Logo" />
      </div>

      {/* 헤더 타이틀 */}
      <div className="w-full mb-16 relative z-10 flex items-center gap-[5px] lg:px-[180px] sm:px-[100px] px-[50px]">
        <h2 className="display1 text-black leading-none font-normal">
          My Closet <span className="font-light">—</span>
        </h2>
        <span className="body4 text-dark-gray tracking-tight">
          Collect what you want
        </span>
      </div>

      {/* 무한 롤링 트랙 */}
      <div className="w-full overflow-hidden py-6 cursor-pointer">
        <div className="animate-marquee flex items-center gap-10">
          {[...Array(2)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center gap-10 shrink-0">
              {Array.from({ length: totalSlots }).map((_, slotIdx) => {
                const tpl =
                  emptyCardTemplates[slotIdx % emptyCardTemplates.length];
                const item = items[slotIdx];

                return (
                  <div
                    key={`${loopIdx}-${slotIdx}`}
                    onClick={() => {
                      if (item) {
                        navigate(`/itemDetail/${item.id}`);
                      } else {
                        setIsFormOpen(true);
                      }
                    }}
                    className={`${tpl.width} ${tpl.height} ${tpl.translate} bg-white border border-gray/50 flex-shrink-0 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 hover:border-accent-pink hover:shadow-md group`}
                  >
                    {item ? (
                      // 1. 아이템이 채워진 슬롯
                      item.imageUrl ? (
                        // 1-A. 이미지가 있을 때
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        // 1-B. 이미지가 없을 때: 캡처와 똑같은 핑크 삼각 옷걸이 + 핑크 상품명
                        <div className="w-full h-full bg-base-pink/60 flex flex-col items-center justify-center gap-2.5 p-4 text-center select-none">
                          {/* 핑크색 옷걸이 벡터 아이콘 */}
                          <img src={hanger} alt="Hanger" />

                          <span className="caption3 text-accent-pink tracking-tight font-normal line-clamp-2">
                            {item.title}
                          </span>
                        </div>
                      )
                    ) : (
                      // 2. 빈 슬롯 (+ Add Your Item)
                      <>
                        <div
                          className={`${tpl.circle} rounded-full border border-dashed border-accent-pink flex items-center justify-center text-accent-pink font-light mb-2 group-hover:scale-110 transition-transform`}
                        >
                          +
                        </div>
                        <span
                          className={`${tpl.textSize} text-accent-pink tracking-tight font-sans`}
                        >
                          Add Your Item
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 우측 하단 View More */}
      <div className="w-full mx-auto pr-[50px] sm:pr-[100px] md:pr-[180px] mt-12 flex justify-end">
        <Link
          to="/archive"
          className="display3 hover:!text-accent-pink transition-colors flex items-center gap-2"
        >
          View More
          <MoveRight strokeWidth={1.2} />
        </Link>
      </div>
    </section>
  );
}
