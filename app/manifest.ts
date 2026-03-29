import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "M. Brugnara GmbH",
    short_name: "Brugnara",
    description: "Ihr Spezialist für Eisenwaren, Haushalt und mehr in Meran. La vostra ferramenta a Merano.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#772322",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
