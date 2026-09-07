import { MoveRight } from "lucide-react";
import logoImg from "../../../img/Logo1.png";
import { Link, useNavigate } from "react-router-dom";

export default function ClosetSection({ items, setIsFormOpen }) {
  const navigate = useNavigate();

  const emptyCardTemplates = [
    {
      width: "w-[210px]",
      height: "h-[270px]",
      translate: "-translate-y-4",
      circle: "w-10 h-10 text-xl",
      textSize: "text-[11px]",
    },
    {
      width: "w-[280px]",
      height: "h-[370px]",
      translate: "translate-y-3",
      circle: "w-11 h-11 text-2xl",
      textSize: "text-[12px]",
    },
    {
      width: "w-[180px]",
      height: "h-[210px]",
      translate: "-translate-y-8",
      circle: "w-9 h-9 text-lg",
      textSize: "text-[10px]",
    },
    {
      width: "w-[220px]",
      height: "h-[310px]",
      translate: "translate-y-8",
      circle: "w-10 h-10 text-xl",
      textSize: "text-[11px]",
    },
    {
      width: "w-[230px]",
      height: "h-[290px]",
      translate: "-translate-y-2",
      circle: "w-10 h-10 text-xl",
      textSize: "text-[11px]",
    },
  ];

  return (
    <section className="w-full py-24 relative flex flex-col justify-center  overflow-hidden">
      <div className="absolute left-6 top-8  z-0 w-[300px]">
        <img src={logoImg} alt="Logo" />
      </div>

      <div className=" w-fullmb-16 relative z-10 flex items-center gap-[5px] lg:px-[180px] sm:px-[100px] px-[50px]">
        <h2 className="display1 text-black leading-none font-normal">
          My Closet <span className="font-light">—</span>
        </h2>

        <span className="body4 text-dark-gray tracking-tight">
          Collect what you want
        </span>
      </div>

      <div className="w-full overflow-hidden py-6 cursor-pointer">
        <div className="animate-marquee flex items-center gap-10">
          {items.length === 0
            ? [...Array(2)].map((_, loopIdx) => (
                <div
                  key={loopIdx}
                  className="flex items-center gap-10 shrink-0"
                >
                  {emptyCardTemplates.map((tpl, i) => (
                    <div
                      key={i}
                      onClick={() => setIsFormOpen(true)}
                      className={`${tpl.width} ${tpl.height} ${tpl.translate} bg-white border border-gray/50  flex flex-col items-center justify-center hover:border-accent-pink hover:shadow-md transition-all duration-300`}
                    >
                      <div
                        className={`${tpl.circle} rounded-full border border-dashed border-accent-pink flex items-center justify-center text-accent-pink font-light mb-2`}
                      >
                        +
                      </div>

                      <span
                        className={`${tpl.textSize} text-accent-pink tracking-tight font-sans`}
                      >
                        Add Your Item
                      </span>
                    </div>
                  ))}
                </div>
              ))
            : [...items, ...items].map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => navigate(`/itemDetail/${item.id}`)}
                  className="w-56 h-72 bg-white border border-gray/50 overflow-hidden flex-shrink-0 group hover:border-black hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="w-full h-4/5 bg-background overflow-hidden flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="caption3 text-light-text">No Image</span>
                    )}
                  </div>

                  <div className="p-3 bg-white border-t border-gray/20">
                    <p className="caption3 truncate text-black">{item.title}</p>
                  </div>
                </div>
              ))}
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto px-6 mt-12 flex justify-end">
        <Link
          to="/archive"
          className="display3 text-dark-gray hover:text-black transition-colors flex items-center gap-2"
        >
          View More
          <MoveRight strokeWidth={1} />
        </Link>
      </div>
    </section>
  );
}
