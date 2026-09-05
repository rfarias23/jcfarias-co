import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * Only the home page for now. /insights and /insights/[slug] are noindex
 * placeholders (spec 010) and join the sitemap when their design ships (spec 014).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url + "/", lastModified: new Date() }];
}
