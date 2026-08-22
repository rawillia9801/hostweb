import type { MetadataRoute } from "next";

const paths = [
  "",
  "/hosting",
  "/hosting/shared",
  "/hosting/wordpress",
  "/hosting/cloud",
  "/hosting/vps",
  "/domains",
  "/email",
  "/websites",
  "/websites/ai-builder",
  "/websites/migration",
  "/security",
  "/support",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return paths.map((path, index) => ({
    url: `https://hostmyweb.co${path}`,
    lastModified: now,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : path === "/hosting/shared" || path === "/domains" ? 0.9 : 0.7,
  }));
}
