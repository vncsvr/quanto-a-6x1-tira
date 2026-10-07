import type { Metadata, Viewport } from "next";
import { bricolage, dmSans } from "./fonts";
import "./globals.css";

const descricao =
  "Coloque sua data de nascimento e veja quantos dias livres a escala 6x1 tira de você até a aposentadoria. A conta roda no seu celular: nada é enviado nem guardado.";

export const metadata: Metadata = {
  title: "Quanto a 6x1 tira da sua vida?",
  description: descricao,
  openGraph: {
    title: "Quanto a 6x1 tira da sua vida?",
    description: "Faça a conta em 10 segundos. Nada é enviado nem guardado.",
    images: ["https://vncsvr.github.io/quanto-a-6x1-tira/og.png"],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%23FFC93C'/></svg>",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#55B8F0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${bricolage.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
