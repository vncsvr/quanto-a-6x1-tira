import type { NextConfig } from "next";

// Export estático para o GitHub Pages pessoal (main:/docs), servido em /quanto-a-6x1-tira/.
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/quanto-a-6x1-tira",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
};

export default nextConfig;
