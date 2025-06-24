import NextImage from 'next/image'

const Image = ({ src, alt, width, height, ...rest }) => {
  // 外部URLかどうかの判定
  const isExternal = src && (src.startsWith('http') || src.startsWith('https'))
  
  return (
    <div className="relative overflow-hidden">
      <NextImage 
        src={src} 
        alt={alt || ''} 
        width={width || 700} 
        height={height || 400}
        quality={80}
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='100%25' height='100%25' fill='%23111111'/%3E%3C/svg%3E"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 700px"
        style={{ maxWidth: '100%', height: 'auto' }}
        unoptimized={isExternal}
        {...rest} 
      />
    </div>
  )
}

export default Image
