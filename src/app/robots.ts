import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/"],
            },
            {
                userAgent: ["Googlebot", "Applebot", "Bingbot"],
                allow: ["/"],
            },
        ],
        sitemap: "https://www.sigma-ta.com/sitemap.xml",
    };
}