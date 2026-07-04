import type { MetadataRoute } from "next";

const routes = [
  "",
  "/events",
  "/events/football-skills-clinic",
  "/training-services",
  "/pricing-packages",
  "/contact-us",
  "/booking",
  "/baseball-training",
  "/football-training",
  "/basketball-training",
  "/soccer-training",
  "/personal-training",
  "/privacy",
  "/tos",
  "/accessibility",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `https://www.trainingaio.com${r}`,
    changeFrequency: r === "/events" ? "weekly" : "monthly",
  }));
}
