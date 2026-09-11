import React, { useState, useEffect, useMemo, useRef } from "react";
import { Folder, Shirt, Tag } from "lucide-react";
import hanger from "../../img/hanger.svg";

import StyleDonutChart from "./component/StyleDonutChart";
import CategoryBarChart from "./component/CategoryBarChart";
import HallOfFame from "./component/HallOfFame";

const CATEGORIES = ["Top", "Bottom", "Outer", "Shoes", "Acc"];

const FIXED_STYLE_COLORS = [
  "#222222",
  "#FF73C0",
  "#FFC4E5",
  "#FFEBF3",
  "#D1D1D6",
];

const getMainDetailImage = (targetItem) => {
  if (!targetItem) return "";
  return targetItem.detailImages?.[0] || targetItem.imageUrl || "";
};

export default function Data() {
  const [items, setItems] = useState([]);
  const [lookbooks, setLookbooks] = useState([]);
  const [folders, setFolders] = useState([]);

  // 각 섹션별 스크롤 노출 상태
  const [isStyleVisible, setIsStyleVisible] = useState(false);
  const [isCategoryVisible, setIsCategoryVisible] = useState(false);
  const [isHallOfFameVisible, setIsHallOfFameVisible] = useState(false);

  const styleSectionRef = useRef(null);
  const categorySectionRef = useRef(null);
  const hallOfFameSectionRef = useRef(null);

  useEffect(() => {
    try {
      const savedItems = JSON.parse(
        localStorage.getItem("fitlog_items") || "[]",
      );
      const savedLookbooks = JSON.parse(
        localStorage.getItem("fitlog_lookbooks") || "[]",
      );
      const customFolders = JSON.parse(
        localStorage.getItem("fitlog_custom_folders") || "[]",
      );

      setItems(savedItems);
      setLookbooks(savedLookbooks);
      setFolders(["None", ...customFolders]);
    } catch (e) {
      console.error("데이터 로드 실패:", e);
    }
  }, []);

  // 스크롤 감지 Observer 설정
  useEffect(() => {
    const observerOptions = { root: null, threshold: 0.2 };

    const createObserver = (setter) =>
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          setter(entry.isIntersecting);
        });
      }, observerOptions);

    const styleObserver = createObserver(setIsStyleVisible);
    const categoryObserver = createObserver(setIsCategoryVisible);
    const hallOfFameObserver = createObserver(setIsHallOfFameVisible);

    if (styleSectionRef.current) styleObserver.observe(styleSectionRef.current);
    if (categorySectionRef.current)
      categoryObserver.observe(categorySectionRef.current);
    if (hallOfFameSectionRef.current)
      hallOfFameObserver.observe(hallOfFameSectionRef.current);

    return () => {
      if (styleSectionRef.current)
        styleObserver.unobserve(styleSectionRef.current);
      if (categorySectionRef.current)
        categoryObserver.unobserve(categorySectionRef.current);
      if (hallOfFameSectionRef.current)
        hallOfFameObserver.unobserve(hallOfFameSectionRef.current);
    };
  }, []);

  const totalItems = items.length;
  const totalLooks = lookbooks.length;
  const totalFolders = Math.max(0, folders.length - 1);

  const uniqueStylesCount = useMemo(() => {
    const styleSet = new Set();
    items.forEach((it) => {
      const styles = Array.isArray(it.styles)
        ? it.styles
        : it.style
          ? [it.style]
          : [];
      styles.forEach((s) => s && s !== "None" && styleSet.add(s));
    });
    return styleSet.size;
  }, [items]);

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

    let processedData = [];
    if (sortedEntries.length <= 4) {
      processedData = sortedEntries.map((entry, idx) => ({
        name: entry.name,
        count: entry.count,
        percent: Math.round((entry.count / totalCount) * 100),
        color: FIXED_STYLE_COLORS[idx],
      }));
    } else {
      const top3 = sortedEntries.slice(0, 3);
      const others = sortedEntries.slice(3);
      const othersCount = others.reduce((acc, cur) => acc + cur.count, 0);

      processedData = top3.map((entry, idx) => ({
        name: entry.name,
        count: entry.count,
        percent: Math.round((entry.count / totalCount) * 100),
        color: FIXED_STYLE_COLORS[idx],
      }));

      processedData.push({
        name: "Others",
        count: othersCount,
        percent: Math.round((othersCount / totalCount) * 100),
        color: FIXED_STYLE_COLORS[4],
      });
    }

    return processedData;
  }, [items]);

  const categoryStats = useMemo(() => {
    const countMap = { Top: 0, Bottom: 0, Outer: 0, Shoes: 0, Acc: 0 };
    const total = items.length;

    items.forEach((it) => {
      const cat = it.category || "Top";
      if (countMap[cat] !== undefined) {
        countMap[cat] += 1;
      }
    });

    return CATEGORIES.map((cat) => ({
      name: cat,
      count: countMap[cat],
      percent: total === 0 ? 0 : Math.round((countMap[cat] / total) * 100),
    }));
  }, [items]);

  const hallOfFameItems = useMemo(() => {
    const usageMap = {};
    lookbooks.forEach((lb) => {
      (lb.items || []).forEach((lbItem) => {
        const id = lbItem.id;
        usageMap[id] = (usageMap[id] || 0) + 1;
      });
    });

    const sorted = [...items].sort((a, b) => {
      const countA = usageMap[a.id] || 0;
      const countB = usageMap[b.id] || 0;
      return countB - countA;
    });

    return sorted.slice(0, 3).map((item, idx) => ({
      rank: idx + 1,
      id: item.id,
      title: item.title || item.name || "Untitled",
      img: getMainDetailImage(item),
      count: `${usageMap[item.id] || 0}개의 코디에 활용`,
    }));
  }, [items, lookbooks]);

  const { topFolderName, folderItemCount, folderPreviewImages } =
    useMemo(() => {
      if (items.length === 0)
        return {
          topFolderName: "폴더 없음",
          folderItemCount: 0,
          folderPreviewImages: [],
        };

      const folderMap = {};
      items.forEach((it) => {
        const f = it.folder || "None";
        if (f !== "None") {
          if (!folderMap[f]) folderMap[f] = [];
          folderMap[f].push(it);
        }
      });

      let bestFolder = "기본 폴더";
      let maxLen = -1;
      Object.keys(folderMap).forEach((f) => {
        if (folderMap[f].length > maxLen) {
          maxLen = folderMap[f].length;
          bestFolder = f;
        }
      });

      const targetItems = folderMap[bestFolder] || [];
      const previewImgs = targetItems
        .slice(0, 2)
        .map((it) => getMainDetailImage(it));

      return {
        topFolderName: maxLen === -1 ? "기본 폴더" : bestFolder,
        folderItemCount: maxLen === -1 ? 0 : maxLen,
        folderPreviewImages: previewImgs,
      };
    }, [items]);

  const summaryStatsData = [
    {
      label: "TOTAL ITEMS",
      value: totalItems,
      icon: (
        <img src={hanger} alt="hanger" className="w-7 h-7 opacity-60 mb-1.5" />
      ),
    },
    {
      label: "TOTAL LOOKS",
      value: totalLooks,
      icon: <Shirt className="w-7 h-7 stroke-[1.5] text-light-text mb-1.5" />,
    },
    {
      label: "TOTAL FOLDERS",
      value: totalFolders,
      icon: <Folder className="w-7 h-7 stroke-[1.5] text-light-text mb-1.5" />,
    },
    {
      label: "STYLE TAGS",
      value: uniqueStylesCount,
      icon: <Tag className="w-7 h-7 stroke-[1.5] text-light-text mb-1.5" />,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white text-black flex flex-col pt-[80px] pb-24">
      <section className="w-full bg-black pt-16 pb-12 lg:px-[100px] xl:px-[180px] px-[50px] relative overflow-hidden flex items-baseline gap-4">
        <div className="relative z-10 flex items-baseline gap-4">
          <h1 className="display1 text-accent-pink font-normal leading-none italic select-none">
            My Style
          </h1>
          <span className="body4 text-gray select-none">
            All your pieces, all in one place.
          </span>
        </div>
      </section>

      <main className="w-full flex flex-col gap-14 pt-[50px] lg:px-[100px] xl:px-[180px] px-[50px]">
        {/* 요약 배너 박스 */}
        <div className="w-full bg-base-pink border border-pink-100 rounded-2xl px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="flex flex-col text-left">
            <span className="display2 h-[32px] text-black font-serif leading-tight">
              &ldquo;
            </span>
            <h3 className="display2 italic text-black font-normal tracking-tight">
              All About Your Style.
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-10 text-center w-full md:w-auto divide-x divide-pink-100">
            {summaryStatsData.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center"
              >
                {stat.icon}
                <span className="body4 text-medium text-dark-gray mb-2">
                  {stat.label}
                </span>
                <span className="body1 text-black font-normal">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 01 Favorite Style 섹션 */}
        <div ref={styleSectionRef}>
          <StyleDonutChart styleStats={styleStats} isVisible={isStyleVisible} />
        </div>

        {/* 02 Category Breakdown 섹션 */}
        <div ref={categorySectionRef}>
          <CategoryBarChart
            categoryStats={categoryStats}
            isVisible={isCategoryVisible}
          />
        </div>

        {/* 3 Hall of Fame 섹션 */}
        <div ref={hallOfFameSectionRef}>
          <HallOfFame
            hallOfFameItems={hallOfFameItems}
            topFolderName={topFolderName}
            folderItemCount={folderItemCount}
            folderPreviewImages={folderPreviewImages}
            isVisible={isHallOfFameVisible}
          />
        </div>
      </main>
    </div>
  );
}
