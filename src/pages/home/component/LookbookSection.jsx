import { Link, useNavigate } from "react-router-dom";
import PaperOpen from "../../../img/paper_open.png";
import PaperClose from "../../../img/paper_close.png";
import Stars from "../../../img/stars.png";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";

export default function LookbookSection() {
  const navigate = useNavigate();

  return (
    <section className="w-full lg:px-[180px] sm:px-[100px] px-[50px] py-[100px] bg-[linear-gradient(to_bottom,#ffffff_0%,var(--color-background)_10%,var(--color-background)_90%,#ffffff_100%)] flex flex-col md:flex-row items-center justify-between gap-16">
      <div className="flex flex-col items-center md:items-start gap-4">
        <div className="">
          <div className="relative left-[200px] top-[50px] z-0">
            <img src={Stars} alt="Stars" />
          </div>

          <h2 className="display1 leading-none font-normal">
            My LookBook <span className="font-light">—</span>
          </h2>
        </div>

        <p className="body4 text-dark-gray">Mix, match, and make your look.</p>

        <Link
          to="/lookbook"
          className="border border-black px-6 py-2 display3  flex items-center shrink-0 hover:bg-black hover:text-white transition-all duration-200 mt-6 inline-flex items-center gap-2"
        >
          Creat New Look
          <span className="font-light">&rarr;</span>
        </Link>
      </div>

      <div className="relative flex items-center gap-6">
        <div className="w-[40px] h-[40px] bg-white flex justify-center items-center rounded-full shadow-sm">
          <ChevronLeft strokeWidth={0.8} size={32} />
        </div>

        <div className="relative w-[300px] h-[405px] flex items-center justify-center select-none">
          <img
            src={PaperOpen}
            alt="Opened Lookbook Note"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md"
          />

          <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between items-center text-center">
            <div className="w-full flex justify-start pt-2">
              <span className="display3 text-xl italic tracking-wide text-black">
                LOOK 01
              </span>
            </div>

            <div
              onClick={() => navigate("/lookbook")}
              className="flex flex-col items-center justify-center gap-2 cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-full border border-dashed border-accent-pink flex items-center justify-center text-accent-pink text-2xl font-light group-hover:scale-110 transition-transform">
                +
              </div>

              <span className="text-[12px] text-accent-pink tracking-tight">
                Add Your Item
              </span>
            </div>

            <span className="caption3 text-xs text-dark-gray pb-2">
              No looks created yet
            </span>
          </div>
        </div>

        <div className="relative w-[190px] h-[260px] hidden sm:block opacity-90 select-none">
          <img
            src={PaperClose}
            alt="Closed Lookbook Note"
            className="w-full h-full object-contain pointer-events-none drop-shadow-sm rotate-2"
          />
        </div>

        <div className="w-[40px] h-[40px] bg-white flex justify-center items-center rounded-full shadow-sm">
          <ChevronRight strokeWidth={0.8} size={32} />
        </div>
      </div>
    </section>
  );
}
