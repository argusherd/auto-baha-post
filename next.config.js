/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "export",
  eslint: {
    dirs: ["renderer", "electron-src"],
  },
};

module.exports = nextConfig;
