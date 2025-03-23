/* eslint-disable react/display-name */
import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import Image from './Image'
import CustomLink from './Link'
import TOCInline from './TOCInline'
import Pre from './Pre'
import { BlogNewsletterForm } from './NewsletterForm'

export const MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  BlogNewsletterForm: BlogNewsletterForm,
  wrapper: ({ components, layout, ...rest }) => {
    const Layout = require(`../layouts/${layout}`).default
    return <Layout {...rest} />
  },
}

// クライアントサイドでのみMDXコンポーネントを読み込む
const MDXLayoutRenderer = dynamic(
  async () => {
    const { getMDXComponent } = await import('mdx-bundler/client')
    return function MDXLayoutRenderer({ layout, mdxSource, rawContent, ...rest }) {
      const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])
      return (
        <MDXLayout
          layout={layout}
          components={MDXComponents}
          rawContent={rawContent}
          {...rest}
        />
      )
    }
  },
  { ssr: false }
)

export { MDXLayoutRenderer }
