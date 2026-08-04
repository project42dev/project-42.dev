import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://project-42.dev";
  return ["", "/about", "/releases", "/roadmap", "/legal-transparency"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date("2026-07-27"),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
