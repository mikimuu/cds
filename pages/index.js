import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'
import Image from '@/components/Image'
import NewsletterForm from '@/components/NewsletterForm'
import { useMemo } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import DummyImage from '@/components/dummyimage'; // エイリアスパスを適切に設定してください



const MAX_DISPLAY = 5
function extractTextFromMDX(mdxContent) {
  return mdxContent
    .replace(/<[^>]*>/g, '') // HTMLタグを削除
    .replace(/\n/g, ' ') // 改行をスペースに置換
    .replace(/#.*/g, '') // ヘッダーを削除
    .trim();
}


import { getFileBySlug } from '../lib/mdx';

export async function getStaticProps() {
  // 全てのフロントマターを取得します
  const allPostsFrontMatter = await getAllFilesFrontMatter('blog');

  // 最新のポストのslugを取得します
  const latestPostSlug = allPostsFrontMatter.length > 0 ? allPostsFrontMatter[0].slug : "";

  // 最新のポストのMDXコンテンツを取得します
  const latestPostContent = latestPostSlug ? await getFileBySlug('blog', latestPostSlug) : {};

  const latestPostText = latestPostContent.mdxSource ? extractTextFromMDX(latestPostContent.mdxSource) : '';

  // propsとして返します
  return {
    props: {
      latestPost: {
        ...latestPostContent.frontMatter, // メタデータ
        content: latestPostContent.mdxSource, // トランスパイルされたMDXコンテンツ
      },
      posts: allPostsFrontMatter.slice(1), // 最新のポストを除くその他のポスト
      latestPostText,
    },
  };
}


export default function Home({ latestPost, posts ,latestPostText}) {
  // MDXコンポーネントをレンダリングする際に、スコープに Image コンポーネントを含める
  const LatestPostComponent = useMemo(() => {
    if (!latestPost.content) return null;
    // スコープに DummyImage を追加
    return getMDXComponent(latestPost.content, { Image});
  }, [latestPost.content]);
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-8 pb-8 md:space-y-5">
          <h1 className=" truncate text-3xl font-mono py-10 tracking-widest text-gray-600 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14  skew-y-6 ">
            あわわわ
          </h1>
          <p className=" text-4xl font-mono tracking-widest leading-7 text-gray-500 dark:text-gray-400 rotate-3">
            {siteMetadata.description}
          </p>
        </div>
        
      <div className="latest-post">
        <h2 className=' text-xl font-mono text-cyan-800 dark:text-gray-50 '>最新の日記　ここバグってるけど気にしないでください。修正中です。読みずらかったら一番下の続きを読むを押せばちゃんと読めます。</h2>
        {latestPost && (
          <article>
            <h3>
              <Link href={`/blog/${latestPost.slug}`}>
                <a>{latestPost.title}</a>
              </Link>
            </h3>
            {/* MDXコンポーネントをレンダリング */}
            <LatestPostComponent />
      <Link href={`/blog/${latestPost.slug}`}>
        <a>続きを読む &rarr;</a>
      </Link>
          </article>
        )}
      </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
            const { slug, date, title, summary, tags } = frontMatter
            return (
              <li key={slug} className="py-12">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0 hover:scale-105">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-wide">
                            <Link
                              href={`/blog/${slug}`}
                              className=" text-stone-600 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                      <div className="text-base font-medium leading-6">
                        <Link
                          href={`/blog/${slug}`}
                          className=" text-slate-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read "${title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="all posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
    </>
  )
}
