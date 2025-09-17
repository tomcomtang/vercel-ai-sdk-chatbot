/** @type {import('next').NextConfig} */
const nextConfig = {
  // 输出静态文件到 out 目录
  output: 'export',
  // 禁用图片优化（静态导出不支持）
  images: {
    unoptimized: true
  },
  // 禁用服务端功能（静态导出不支持）
  trailingSlash: true,
  // 确保所有页面都是静态的
  distDir: 'out',
  // 跳过尾随斜杠重定向
  skipTrailingSlashRedirect: true
}

module.exports = nextConfig
