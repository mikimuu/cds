import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'

import NewsletterForm from '@/components/NewsletterForm'

const MAX_DISPLAY = 5

// pages/index.js
import { getSortedPostsData } from '../lib/posts'; // 最新のポストデータを取得する関数をインポート

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  // 最新のポストのみを取得するには配列の最初の要素のみを使用します
  const latestPost = allPostsData[0];
  return {
    props: {
      latestPost
    }
  };
}

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')

  return { props: { posts } }
}

export default function Home({ posts }) {
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
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-8 pb-8">
          <h1 className="text-3xl font-bold tracking-widest text-gray-600 dark:text-gray-100">
            最新の日記
          </h1>
          {latestPost ? (
            <article className="py-12">
              <div className="space-y-5">
                <h2 className="text-2xl font-bold leading-8 tracking-wide">
                  <a
                    href={`/blog/${latestPost.id}`}
                    className="text-stone-600 dark:text-gray-100"
                  >
                    {latestPost.title}
                  </a>
                </h2>
                <p className="text-gray-500 dark:text-gray-400">{latestPost.summary}</p>
                <div className="text-base font-medium leading-6">
                  <a
                    href={`/blog/${latestPost.id}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label={`Read "${latestPost.title}"`}
                  >
                    Read more &rarr;
                  </a>
                </div>
              </div>
            </article>
          ) : (
            <p>No latest post found.</p>
          )}
        </div>
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
