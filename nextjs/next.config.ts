import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/todo-nextjs",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
