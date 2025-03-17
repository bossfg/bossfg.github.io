/** @type {import('next').NextConfig} */
const nextConfig = {
  // 只在生产环境使用静态导出
  ...(process.env.NODE_ENV === "production" ? { output: "export" } : {}),
  images: {
    unoptimized: true,
  },
  // 只在生产环境使用 basePath 和 assetPrefix
  ...(process.env.NODE_ENV === "production"
    ? {
        basePath: "/malaysia-stock-info",
        assetPrefix: "/malaysia-stock-info/",
      }
    : {}),
};

module.exports = nextConfig;
