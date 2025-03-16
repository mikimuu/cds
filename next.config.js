const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  eslint: {
    dirs: ['pages', 'components', 'lib', 'layouts', 'scripts'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.google-analytics.com *.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob: *.google-analytics.com",
              "font-src 'self'",
              "frame-src 'self' https: *.spotify.com *.youtube.com *.google.com *.music.apple.com",
              "connect-src 'self' *.google-analytics.com *.doubleclick.net",
              "media-src 'self' https:",
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
            ].join('; '),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
  webpack: (config, { dev, isServer }) => {
    // Shader files loader
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader'],
    })

    // MDX optimization
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        {
          loader: '@mdx-js/loader',
          options: {
            providerImportSource: '@mdx-js/react',
            // Remove direct requires of ESM modules
            remarkPlugins: [],
            rehypePlugins: [],
          },
        },
      ],
    })

    if (!dev && !isServer) {
      // Preact in production
      Object.assign(config.resolve.alias, {
        'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      })

      // Additional production optimizations
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        innerGraph: true,
        concatenateModules: true,
      }
    }

    return config
  },
}

module.exports = withBundleAnalyzer(nextConfig)
