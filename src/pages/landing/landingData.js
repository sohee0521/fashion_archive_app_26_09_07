// src/pages/landing/landingData.js
export const LANDING_MOCK_DATA = {
  // 1. HOW IT WORKS 섹션
  howItWorks: {
    singleProduct: {
      siteUrl: "https://Fitlog.co.kr/product...",
      title: "Fleece Zip Jacket (Pink)",
      memo: "개강 꾸안꾸로 입기좋은 집업",
      image:
        "https://hugyourskin.kr/web/product/big/202608/83bc7093e58f3ac5e0051f0ea3a980c1.jpg",
    },
    archiveGrid: [
      "https://hugyourskin.kr/web/product/big/202608/19a1cb4c379a9b7ce9324d4ca0337de9.jpg",
      "https://hugyourskin.kr/web/product/big/202605/06a71d4b090d1744e250a7d5a4199670.jpg",
      "https://hugyourskin.kr/web/product/big/202608/a4abe33d6ab68cfb56333364117a104a.jpg",
      "https://binary01.co.kr/web/product/small/202608/664b1b7f8c92160dc708e67d66bf05a2.jpg",
    ],
  },

  // 2. MY LOOKBOOK 섹션
  lookbook: {
    title: "Autumn Daily Look",
    subItemImages: [
      "https://hugyourskin.kr/web/product/big/202608/19a1cb4c379a9b7ce9324d4ca0337de9.jpg",
      "https://cdn.shopify.com/s/files/1/0596/8704/3156/files/IMG26SUM_0146.jpg?v=1779766925",
    ],
    slots: {
      top: "https://hugyourskin.kr/web/product/big/202608/19a1cb4c379a9b7ce9324d4ca0337de9.jpg",
      outer:
        "https://cdn.shopify.com/s/files/1/0596/8704/3156/files/IMG_4041_a621ccae-9ab2-40bf-a3b7-fe70089a889e.jpg?v=1771301385",
      bottom:
        "https://hugyourskin.kr/web/product/big/202608/a4abe33d6ab68cfb56333364117a104a.jpg",
      acc: "https://cdn.shopify.com/s/files/1/0596/8704/3156/files/IMG26SUM_0426.jpg?v=1779773827",
      shoes:
        "https://cdn.shopify.com/s/files/1/0596/8704/3156/files/IMG_5750_cd27f19e-5ead-4bf0-a505-0ac885a84f45.jpg?v=1738730738",
    },
  },

  // 3. STYLE INSIGHTS 섹션 (새 My Style 디자인 반영)
  insights: {
    summary: {
      items: 42,
      looks: 12,
      folders: 6,
      tags: 18,
    },
    styles: [
      { name: "Y2K", percent: "32%", color: "bg-[#1C1C1E]" },
      { name: "Feminine", percent: "24%", color: "bg-accent-pink" },
      { name: "Casual", percent: "18%", color: "bg-pink-300" },
      { name: "Others", percent: "14%", color: "bg-stone-200" },
    ],

    hallOfFame: [
      {
        id: 1,
        title: "보부상 레더숄더백",
        count: "9개의 코디",
        img: "https://cdn.shopify.com/s/files/1/0596/8704/3156/files/IMG_2420.jpg?v=1733814457",
      },
      {
        id: 2,
        title: "레이어드용 베이직 탑 ",
        count: "7개의 코디",
        img: "https://cdn.shopify.com/s/files/1/0596/8704/3156/files/IMG26SUM_0146.jpg?v=1779766925",
      },
      {
        id: 3,
        title: "운동화느낌 구두",
        count: "6개의 코디",
        img: "https://cdn.shopify.com/s/files/1/0596/8704/3156/files/IMG_5750_cd27f19e-5ead-4bf0-a505-0ac885a84f45.jpg?v=1738730738",
      },
    ],
  },
};
