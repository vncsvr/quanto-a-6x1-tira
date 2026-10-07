import localFont from "next/font/local";

// Fontes servidas pelo próprio site (nada de CDN). O nome da família fica fixo para o canvas do story.
export const bricolage = localFont({
  src: "./fonts/bricolage.woff2",
  weight: "200 800",
  variable: "--font-bricolage",
  declarations: [{ prop: "font-family", value: "Bricolage Grotesque" }],
});

export const dmSans = localFont({
  src: "./fonts/dmsans.woff2",
  weight: "100 1000",
  variable: "--font-dm-sans",
  preload: false,
  declarations: [{ prop: "font-family", value: "DM Sans" }],
});
