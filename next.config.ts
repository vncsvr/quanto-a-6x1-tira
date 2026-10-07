import type { NextConfig } from "next";

// Export estático. Padrão: GitHub Pages (main:/docs) em /quanto-a-6x1-tira/; na Vercel, BASE_PATH= (raiz).
const base = process.env.BASE_PATH ?? "/quanto-a-6x1-tira";
const nextConfig: NextConfig = {
  output: "export",
  basePath: base,
  env: { BASE: base },
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
};

export default nextConfig;
