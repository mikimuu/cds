import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'

const Tag = ({ text }) => {
  return (
    <Link
      href={`/tags/${kebabCase(text)}`}
      className="
        inline-block 
        bg-cosmic-blue/70 hover:bg-cosmic-blue 
        text-white 
        text-xs leading-tight
        rounded-full 
        px-2.5 py-1 
        font-medium 
        transition-colors duration-150
        shadow-sm
        whitespace-nowrap
      "
    >
      {text}
    </Link>
  )
}

export default Tag
