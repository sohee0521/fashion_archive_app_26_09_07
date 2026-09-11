import topImg from "../../../img/top.png";
import bottomImg from "../../../img/bottom.png";
import outerImg from "../../../img/outer.png";
import shoesImg from "../../../img/shoes.png";
import accImg from "../../../img/acc.png";

const CATEGORY_ICONS = {
  Top: topImg,
  Bottom: bottomImg,
  Outer: outerImg,
  Shoes: shoesImg,
  Acc: accImg,
};

export default function CategoryBarChart({ categoryStats, isVisible }) {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="border-b border-[#F0F0F0] pb-3">
        <h2 className="display2 text-black">02 Category Breakdown</h2>
        <span className="caption3 text-dark-gray">
          내 아카이브 내 카테고리 구성비
        </span>
      </div>

      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-8 flex flex-col gap-6 shadow-2xs">
        {categoryStats.map((cat) => (
          <div key={cat.name} className="flex items-center gap-4 sm:gap-6">
            <div className="w-28 flex items-center gap-2.5">
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <img
                  src={CATEGORY_ICONS[cat.name]}
                  alt={cat.name}
                  className="w-full h-full object-contain opacity-70"
                />
              </div>
              <span className="body4 text-dark-gray font-medium tracking-wider">
                {cat.name}
              </span>
            </div>

            <div className="flex-1 bg-[#F0F0F0] h-4 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-black h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: isVisible ? `${cat.percent}%` : "0%",
                }}
              />
            </div>
            <span className="w-12 text-right body4 font-medium text-black">
              {cat.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
