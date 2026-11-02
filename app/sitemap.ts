import type { MetadataRoute } from "next";
import { getProjects, getServiceCategories } from "@/lib/data";
import { showTeam, siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, projects] = await Promise.all([getServiceCategories(), getProjects()]);
  const paths = [
    "",
    "/about",
    "/services",
    "/portfolio",
    ...(showTeam ? ["/team"] : []),
    "/contact",
    "/faq",
    "/quote",
    "/review",
    "/privacy",
    "/terms",
    ...categories.flatMap((category) => [
      `/services/${category.slug}`,
      ...category.services.map((service) => `/services/${category.slug}/${service.slug}`),
    ]),
    ...projects.map((project) => `/portfolio/${project.slug}`),
  ];
  return paths.map((path) => ({ url: `${siteConfig.url}${path}` }));
}
