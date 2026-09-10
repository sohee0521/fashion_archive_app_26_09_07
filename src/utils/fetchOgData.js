// src/utils/fetchOgData.js

export async function fetchOgData(targetUrl) {
  console.log("🔍 [1. fetchOgData 실행됨] 입력된 URL:", targetUrl);

  if (!targetUrl || typeof targetUrl !== "string") {
    return { imageUrl: "", title: "" };
  }

  let normalizedUrl = targetUrl.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  // 🔥 링크 메타데이터만 전문적으로 추출해주는 무료 공용 API 활용 (CORS 우회용)
  // microlink.io 같은 서비스는 서버 대 서버로 안전하게 OG 태그를 긁어와서 JSON으로 줍니다.
  const apiEndpoint = `https://api.microlink.io?url=${encodeURIComponent(normalizedUrl)}`;

  try {
    console.log("🚀 [Microlink API 호출중]:", apiEndpoint);
    const res = await fetch(apiEndpoint);

    if (!res.ok) {
      console.warn("⚠️ API 응답 실패:", res.status);
      return { imageUrl: "", title: "" };
    }

    const json = await res.json();
    console.log("📦 [Microlink API 응답 데이터]:", json);

    if (json.status === "success" && json.data) {
      const ogTitle = json.data.title || "";
      const ogImage = json.data.image?.url || "";

      console.log("✨ [스크랩 성공] 제목:", ogTitle);
      console.log("✨ [스크랩 성공] 이미지:", ogImage);

      return {
        imageUrl: ogImage,
        title: ogTitle,
      };
    }

    return { imageUrl: "", title: "" };
  } catch (err) {
    console.warn("❌ OG 스크랩 에러 발생:", err.message);
    return { imageUrl: "", title: "" };
  }
}
