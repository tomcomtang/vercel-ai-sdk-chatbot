/** @type {import('next').NextConfig} */
const nextConfig = {
  // 只在生产构建时启用静态导出
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    images: { unoptimized: true },
    trailingSlash: true,
    distDir: 'out',
    skipTrailingSlashRedirect: true
  })
}

module.exports = nextConfig
