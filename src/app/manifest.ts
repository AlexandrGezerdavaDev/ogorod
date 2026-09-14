import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OGOROD",
    short_name: "OGOROD",
    description: "Город у кишені: рослини, полив, календар і сканування камерою.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#6B9E6B",
    lang: "uk",
    orientation: "portrait-primary",
    categories: ["lifestyle", "utilities"],
    icons: [
      {
        src: "/brand/ogorod-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  }
}
