/** @type {import('next').NextConfig} */
const nextConfig = {
  // можно убрать позже — это только чтобы обойти ошибку кеша на Windows
  webpack(config) {
    config.cache = false; // отключаем кэш вебпака
    return config;
  },
};

module.exports = nextConfig;
