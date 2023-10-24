/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "export",
  eslint: {
    dirs: ["renderer", "electron-src"],
  },
  transpilePackages: ["ui"],
};

module.exports = nextConfig;
