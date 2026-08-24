import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ifrllc.vercel.app";
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: .3 },
    { url: `${base}/disclaimer`, changeFrequency: "yearly", priority: .3 },
  ];
}
