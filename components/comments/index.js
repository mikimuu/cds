import siteMetadata from '@/data/siteMetadata'
// import dynamic from 'next/dynamic'

// 動的インポートから直接インポートに変更
import Utterances from '@/components/comments/Utterances'
import Giscus from '@/components/comments/Giscus'
import Disqus from '@/components/comments/Disqus'

const Comments = ({ frontMatter }) => {
  const comment = siteMetadata?.comment
  if (!comment || Object.keys(comment).length === 0) return <></>
  return (
    <div id="comment">
      {siteMetadata.comment && siteMetadata.comment.provider === 'giscus' && <Giscus />}
      {siteMetadata.comment && siteMetadata.comment.provider === 'utterances' && (
        <Utterances />
      )}
      {siteMetadata.comment && siteMetadata.comment.provider === 'disqus' && (
        <Disqus frontMatter={frontMatter} />
      )}
    </div>
  )
}

export default Comments
