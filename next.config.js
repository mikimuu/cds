const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self' https://disqus.com https://c.disquscdn.com https://analytics.google.com/　https://www.google-analytics.com https://www.googletagmanager.com https://analytics.us.umami.is ;
  script-src 'self' 'unsafe-inline' 'unsafe-eval' platform.twitter.com syndication.twitter.com giscus.app vitals.vercel-insights.com https://worthhearing.disqus.com https://analytics.google.com/　https://www.google-analytics.com https://www.googletagmanager.com https://analytics.us.umami.is;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data: www.googletagmanager.com ;
  media-src 'none';
  connect-src 'self';
  font-src 'self';
  frame-src 'self' https://note.com https://platform.twitter.com https://open.spotify.com giscus.app https://embed.music.apple.com https://www.youtube.com https://bandcamp.com;
`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ' ').trim() // 改行を削除して整形
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  eslint: {
    dirs: ['pages', 'components', 'lib', 'layouts', 'scripts'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    if (!dev && !isServer) {
      // Replace React with Preact only in client production build
      Object.assign(config.resolve.alias, {
        'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      })
    }

    return config
  },
})
