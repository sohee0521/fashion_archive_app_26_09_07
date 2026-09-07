import React from "react";
import { Link } from "react-router-dom";

export default function StyleSection() {
  return (
    <section className="w-full   lg:px-[180px] sm:px-[100px] px-[50px] py-24  flex flex-col relative">
      <div className="text-center mb-16">
        <h2 className="display1 font-normal leading-tight mb-2">
          What styles do you love?
        </h2>

        <p className="body4 text-dark-gray">See what you’ve been saving</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-10 items-center">
        <div className="w-full flex gap-[60px]">
          {/* Favorite Style */}
          <div className="w-[50%] flex flex-col gap-[10px]">
            <h3 className="display3 text-accent-pink  mb-1">Favorite Style</h3>

            <div className="space-y-3 body4 text-black ">
              {[
                { name: "Y2K", value: "00%" },
                { name: "Casual", value: "00%" },
                { name: "Minimal", value: "00%" },
                { name: "Hip", value: "00%" },
                { name: "Feminine", value: "00%" },
              ].map((style) => (
                <div key={style.name} className="flex items-baseline w-full">
                  <span className="whitespace-nowrap">{style.name}</span>

                  <span className="flex-1 border-b border-dotted border-gray mx-3 -translate-y-1" />

                  <span className="text-dark-gray whitespace-nowrap">
                    {style.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Most Saved */}
          <div className=" h-full flex flex-col gap-[10px]">
            <h3 className="display3 text-accent-pink  mb-1">Most Saved</h3>

            <div className="flex flex-wrap gap-2 ">
              {["TOP", "OUTER", "ACC"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1 border border-dark-gray rounded-full body4 text-black "
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* See More Insight */}

        <Link
          to="/data"
          className=" z-10 bg-black !text-white px-[20px] px-[20px] py-[10px] display3 flex items-center gap-3 shrink-0 hover:bg-white hover:!text-black border border-black transition-all duration-200"
        >
          See More Insight
          <span className="font-light">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
