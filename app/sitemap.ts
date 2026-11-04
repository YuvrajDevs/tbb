import type { MetadataRoute } from "next";
import { cases } from "@/lib/cases/hollow-pines";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/cases`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/terms`, changeFrequency: "yearly", priority: 0.3 },
    ...Object.keys(cases).map((id) => ({ url: `${SITE}/case/${id}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
