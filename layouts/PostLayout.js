import Link from '@/components/Link'
import { BlogSEO } from '@/components/SEO'
import Image from '@/components/Image'
import siteMetadata from '@/data/siteMetadata'
import Comments from '@/components/comments'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import RelatedPosts from '@/components/RelatedPosts'
import ArticleChat from '@/components/ArticleChat'
import { useEffect, useState } from 'react'
import formatDate from '@/lib/utils/formatDate'

const editUrl = (fileName) => `${siteMetadata.siteRepo}/blob/master/data/blog/${fileName}`
const discussUrl = (slug) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(
    `${siteMetadata.siteUrl}/blog/${slug}`
  )}`


export default function PostLayout({ frontMatter, authorDetails, next, prev, children, allPosts, rawContent }) {
  const { slug, fileName, date, title, images, tags } = frontMatter

  return (
    <>
      <BlogSEO
        url={`${siteMetadata.siteUrl}/blog/${slug}`}
        authorDetails={authorDetails}
        {...frontMatter}
      />
      <ScrollTopAndComment />
      
      {/* DESIGN MASTERS: 4人の巨匠の統合哲学 */}
      <article className="m-article">
        <div className="m-container">
          
          {/* ヘッダー - ポール・ランドの明快な情報階層 */}
          <header className="m-article-header">
            <div className="m-grid">
              <div className="m-sidebar">
                <div className="m-divider m-divider-lg" />
              </div>
              
              <div className="m-content">
                {/* 情報階層 1: メタデータ */}
                <div className="m-block">
                  <div className="m-caption m-text-light">
                    <time dateTime={date}>{formatDate(date)}</time>
                  </div>
                </div>
                
                {/* 情報階層 2: タイトル */}
                <div className="m-block">
                  <h1 className="m-article-title">
                    {title}
                  </h1>
                </div>
                
                {/* 情報階層 3: 著者情報 - ウィリアム・モリスの丁寧さ */}
                {authorDetails && authorDetails.length > 0 && (
                  <div className="m-block">
                    <div className="m-author-info">
                      {authorDetails.map((author) => (
                        <div key={author.name} className="m-author">
                          {author.avatar && (
                            <Image
                              src={author.avatar}
                              width={40}
                              height={40}
                              alt={author.name}
                              className="m-author-avatar"
                            />
                          )}
                          <div className="m-author-details">
                            <div className="m-caption">
                              {author.name}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="m-accent" />
            </div>
          </header>
          {/* メインコンテンツ - ディーター・ラムスの読みやすさ設計 */}
          <main className="m-article-main">
            <div className="m-grid">
              <div className="m-sidebar" />
              
              <div className="m-content">
                {/* 記事本文 - 4人の巨匠の統合タイポグラフィ */}
                <div className="m-article-content">
                  {children}
                </div>
                
                {/* 記事チャット */}
                <div className="m-block">
                  <ArticleChat articleContent={rawContent} />
                </div>
                
                {/* 記事アクション */}
                <div className="m-block">
                  <div className="m-article-actions">
                    {process.env.NODE_ENV === 'development' && (
                      <Link href={`/blog/edit/${slug}`} className="m-action-link">
                        記事を編集
                      </Link>
                    )}
                    <Link href={discussUrl(slug)} rel="nofollow" className="m-action-link">
                      Twitterで議論
                    </Link>
                    <Link href={editUrl(fileName)} className="m-action-link">
                      GitHubで表示
                    </Link>
                  </div>
                </div>
                
                {/* コメント */}
                {siteMetadata.comments && (
                  <div className="m-block" id="comment">
                    <Comments frontMatter={frontMatter} />
                  </div>
                )}
              </div>
              
              <div className="m-accent" />
            </div>
          </main>
          {/* フッター - 4人の巨匠の統合情報整理 */}
          <footer className="m-article-footer">
            <div className="m-grid">
              <div className="m-sidebar">
                <div className="m-divider m-divider-md" />
              </div>
              
              <div className="m-content">
                {/* タグ */}
                {tags && tags.length > 0 && (
                  <div className="m-block">
                    <div className="m-caption m-text-light m-mb-2">
                      Tags
                    </div>
                    <div className="m-tags">
                      {tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/tags/${tag}`}
                          className="m-tag"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* ナビゲーション */}
                {(next || prev) && (
                  <div className="m-block">
                    <div className="m-article-nav">
                      {prev && (
                        <div className="m-nav-item">
                          <div className="m-caption m-text-light m-mb-1">
                            Previous
                          </div>
                          <Link href={`/blog/${prev.slug}`} className="m-nav-link">
                            {prev.title}
                          </Link>
                        </div>
                      )}
                      {next && (
                        <div className="m-nav-item">
                          <div className="m-caption m-text-light m-mb-1">
                            Next
                          </div>
                          <Link href={`/blog/${next.slug}`} className="m-nav-link">
                            {next.title}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* 戻るリンク */}
                <div className="m-block">
                  <Link href="/blog" className="m-back-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    記事一覧に戻る
                  </Link>
                </div>
                
                {/* 関連記事 */}
                <div className="m-block">
                  <RelatedPosts currentPost={frontMatter} allPosts={allPosts} />
                </div>
              </div>
              
              <div className="m-accent" />
            </div>
          </footer>
        </div>
      </article>
    </>
  )
}
