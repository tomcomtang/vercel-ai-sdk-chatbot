/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',  // 启用静态导出
  images: {
    unoptimized: true  // 静态导出时需要禁用图片优化
  },
  trailingSlash: true,  // 添加尾部斜杠，提高兼容性
};

module.exports = nextConfig;
