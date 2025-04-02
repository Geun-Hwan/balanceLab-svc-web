import { VercelRequest, VercelResponse } from "@vercel/node";
import { IAPI_RESPONSE, instance } from "@api/api";

const fetchPublicIds = async (): Promise<string[]> => {
  try {
    const response = await instance
      .get<IAPI_RESPONSE<string[]>>("/public/ids")
      .then((res) => res.data);

    return response.data.data; // 여기서 바로 data.data 반환
  } catch (error) {
    console.error("Failed to fetch public IDs:", error);
    return [];
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const siteUrl = "https://gugunan.ddns.net";

  // 여기서 동적으로 가져올 데이터 (예: DB에서 questionId 리스트 가져오기)
  const publicIds = await fetchPublicIds();

  const staticRoutes = [
    "/",
    "/login",
    "/join",
    "/contact",
    "/setting",
    "/balance",
    "/predict",
    "/mypage",
    "/my-games",
  ];

  // 동적 페이지 URL 생성 (balance/public/:questionId)
  const dynamicUrls = publicIds
    .map(
      (id: string) =>
        `<url><loc>${siteUrl}/balance/public/${id}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`
    )
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${[...staticRoutes, ...dynamicUrls]
        .map(
          (path) => `
        <url>
          <loc>${siteUrl}${path}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <priority>0.8</priority>
        </url>`
        )
        .join("")}
    </urlset>`;

  // XML 형식으로 응답
  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(sitemap);
}
