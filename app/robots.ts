import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/transfer-progress" },
    sitemap: "https://project-42.dev/sitemap.xml",
  };
}
