import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";

export default function StyleSection() {
  const [items, setItems] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    try {
      const savedItems = JSON.parse(
        localStorage.getItem("fitlog_items") || "[]",
      );
      setItems(Array.isArray(savedItems) ? savedItems : []);
    } catch (e) {
      setItems([]);
    }
  }, []);

  // 🔥 스크롤 진입/이탈 시마다 상태를 토글하여 매번 애니메이션 재실행
  useEffect(() => {
    const observerOptions = {
      root: null,
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false); // 화면에서 벗어나면 초기화 -> 다시 들어올 때 애니메이션 재발동!
        }
      });
    }, observerOptions);

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const styleStats = useMemo(() => {
    const countMap = {};
    let totalCount = 0;

    items.forEach((it) => {
      const styles = Array.isArray(it.styles)
        ? it.styles
        : it.style
          ? [it.style]
          : [];
      styles.forEach((s) => {
        if (!s || s === "None") return;
        countMap[s] = (countMap[s] || 0) + 1;
        totalCount += 1;
      });
    });

    if (totalCount === 0) return [];

    const sortedEntries = Object.keys(countMap)
      .map((name) => ({ name, count: countMap[name] }))
      .sort((a, b) => b.count - a.count);

    return sortedEntries.slice(0, 5).map((entry) => ({
      name: entry.name,
      value: `${Math.round((entry.count / totalCount) * 100)}%`,
    }));
  }, [items]);

  const mostSavedCategories = useMemo(() => {
    const countMap = {};
    items.forEach((it) => {
      const cat = it.category;
      if (cat) {
        countMap[cat] = (countMap[cat] || 0) + 1;
      }
    });

    const sortedCats = Object.keys(countMap)
      .map((cat) => ({ cat, count: countMap[cat] }))
      .sort((a, b) => b.count - a.count);

    return sortedCats.slice(0, 3).map((item) => item.cat.toUpperCase());
  }, [items]);

  return (
    <section
      ref={sectionRef}
      className="w-full lg:px-[180px] sm:px-[100px] px-[50px] py-24 flex flex-col relative"
    >
      <div
        className={`text-center mb-16 transition-all duration-700 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h2 className="display1 font-normal leading-tight mb-2">
          What styles do you love?
        </h2>
        <p className="body4 text-dark-gray">See what you’ve been saving</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-10 items-center">
        <div className="w-full flex gap-[60px]">
          <div
            className={`w-[50%] flex flex-col gap-[10px] transition-all duration-700 delay-150 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h3 className="display3 text-accent-pink mb-1">Favorite Style</h3>

            <div className="space-y-3 body4 text-black">
              {styleStats.length === 0 ? (
                <div className="body4 text-dark-gray py-2">
                  등록된 스타일 태그가 없습니다.
                </div>
              ) : (
                styleStats.map((style) => (
                  <div key={style.name} className="flex items-baseline w-full">
                    <span className="whitespace-nowrap">{style.name}</span>
                    <span className="flex-1 border-b border-dotted border-gray mx-3 -translate-y-1" />
                    <span className="text-dark-gray whitespace-nowrap">
                      {style.value}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div
            className={`h-full flex flex-col gap-[10px] transition-all duration-700 delay-300 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h3 className="display3 text-accent-pink mb-1">Most Saved</h3>

            <div className="flex flex-wrap gap-2">
              {mostSavedCategories.length === 0 ? (
                <span className="body4 text-dark-gray">데이터 없음</span>
              ) : (
                mostSavedCategories.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1 border border-dark-gray rounded-full body4 text-black"
                  >
                    {tag}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-700 delay-450 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            to="/data"
            className="z-10 bg-black !text-white px-[20px] py-[10px] display3 flex items-center gap-3 shrink-0 hover:bg-white hover:!text-black border border-black transition-all duration-200"
          >
            See More Insight
            <span>
              <MoveRight strokeWidth={1.2} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
