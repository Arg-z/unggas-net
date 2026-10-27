import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE = "https://unggas.net";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const diskusi = await prisma.discussion.findMany({
    where: { isHidden: false },
    select: { id: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 5000,
  });

  return [
    {
      url: BASE,
      lastModified: diskusi[0]?.createdAt ?? new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    ...diskusi.map((d) => ({
      url: `${BASE}/t/${d.id}`,
      lastModified: d.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
