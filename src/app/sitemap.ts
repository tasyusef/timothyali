import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.timothyali.com";

  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/blog/starting-with-less`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/blog/the-designers-moment`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/work/xrpcafe`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
    { url: `${base}/work/firstledger`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
    { url: `${base}/work/firststrike`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
    { url: `${base}/work/gridform`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
    { url: `${base}/work/do-androids-dream`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
    { url: `${base}/work/jade-aesthetics`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
  ];
}
