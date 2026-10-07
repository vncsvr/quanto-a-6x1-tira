import localFont from "next/font/local";

// Substitutas livres das fontes oficiais (Transducer e Gotham são pagas), servidas pelo próprio site.
// O nome da família fica fixo para o canvas do story.
export const archivo = localFont({
  src: "./fonts/archivo.woff2",
  weight: "100 900",
  variable: "--font-archivo",
  declarations: [
    { prop: "font-family", value: "Archivo" },
    { prop: "font-stretch", value: "62% 125%" },
  ],
});

export const montserrat = localFont({
  src: "./fonts/montserrat.woff2",
  weight: "100 900",
  variable: "--font-montserrat",
  declarations: [{ prop: "font-family", value: "Montserrat" }],
});
