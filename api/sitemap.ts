import axios from "axios";

async function fetchPublicIds() {
  const baseUrl = "https://api-gugunan.kro.kr";

  try {
    const response = await axios
      .get(`${baseUrl}/public/ids`)
      .then((res) => res.data);

    return response.data; // 여기서 바로 data.data 반환
  } catch (error) {
    console.error("Failed to fetch public IDs:", error);
    return [];
  }
}

export default async function handler(req: any, res: any) {
  const siteUrl = "https://gugunan.ddns.net";
  // 여기서 동적으로 가져올 데이터 (예: DB에서 questionId 리스트 가져오기)
  const publicIds = await fetchPublicIds();

  const importantRoutes = ["/", "/balance", "/predict"];

  const staticRoutes = [
    "/login",
    "/join",
    "/contact",
    "/setting",
    "/mypage",
    "/my-games",
    "/my-games#my-participations",
  ];

  const importantUrls = importantRoutes.map(
    (path) => `
    <url>
      <loc>${siteUrl}${path}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>1.0</priority>
    </url>`
  );

  const staticUrls = staticRoutes.map(
    (path) => `
    <url>
      <loc>${siteUrl}${path}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.8</priority>
    </url>`
  );

  // 동적 페이지 URL 생성 (balance/public/:questionId)
  const dynamicUrls = publicIds.map(
    (id: string) =>
      `<url>
      <loc>${siteUrl}/balance/public/${id}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.8</priority>
    </url>`
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${[
      ...importantUrls,
      ...staticUrls,
      ...dynamicUrls, // 이제 문자열이 아니라 배열이므로 올바르게 들어감
    ].join("")}
  </urlset>`;

  // XML 형식으로 응답
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.status(200).send(sitemap);
}
