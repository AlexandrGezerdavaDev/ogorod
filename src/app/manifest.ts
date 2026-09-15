import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OGOROD",
    short_name: "OGOROD",
    description: "Город у кишені: рослини, полив, календар і сканування камерою.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F7F2",
    theme_color: "#4F7A55",
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
