import NextImage from 'next/image'

// 通常のimg要素を使用するようにコンポーネントを変更
// eslint-disable-next-line jsx-a11y/alt-text
const Image = ({ src, alt, width, height, ...rest }) => (
  <img 
    src={src} 
    alt={alt || ''} 
    width={width} 
    height={height} 
    loading="eager" 
    {...rest} 
  />
)

export default Image
