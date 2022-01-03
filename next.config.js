/** @type {import('next').NextConfig} */
/* eslint-disable @typescript-eslint/no-var-requires */
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
  experimental: {
    styledComponents: true,
  },
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
  },
  images: {
    domains: ['storage.googleapis.com', 'k.kakaocdn.net'],
  },
  poweredByHeader: process.env.NODE_ENV === 'development',
  pwa: {
    buildExcludes: [/middleware-manifest\.json$/],
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching,
  },
  reactStrictMode: process.env.NODE_ENV === 'development',
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
})
