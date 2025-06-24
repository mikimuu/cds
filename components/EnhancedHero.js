'use client'

import { useState, useEffect, useRef } from 'react'
import Image from './Image'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { CosmicEffectShader } from './customShaders/CosmicEffectShader'
import { LensDistortionShader } from './customShaders/LensDistortionShader'
import CosmicParticles from './CosmicParticles'

const EnhancedHero = ({ title, description, scrollIndicatorText = "Scroll to the Cosmos" }) => {
  const [scrollY, setScrollY] = useState(0)
  const [cosmicIntensity, setCosmicIntensity] = useState(0)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  const canvasRef = useRef(null)
  const rendererRef = useRef(null)
  const composerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const textureRef = useRef(null)
  const animationFrameRef = useRef(null)
  const cosmicPassRef = useRef(null)
  const lensPassRef = useRef(null)

  // スクロール位置の監視
  useEffect(() => {
    const handleScroll = () => {
      const newScrollY = window.scrollY
      setScrollY(newScrollY)
      
      // スクロールに応じたコズミック強度の計算
      const maxIntensity = 0.8
      const scrollThreshold = window.innerHeight * 0.8
      const newIntensity = Math.min(maxIntensity, newScrollY / scrollThreshold)
      setCosmicIntensity(newIntensity)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // 縮小モーションの設定
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)
    
    const handleReducedMotionChange = (e) => {
      setIsReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleReducedMotionChange)
    return () => mediaQuery.removeEventListener('change', handleReducedMotionChange)
  }, [])
  
  // モバイルデバイスの検出を追加
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // 初期チェックと画面サイズ変更時の処理
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // 画像のプリロード処理
  useEffect(() => {
    const imageUrl = isMobile 
      ? '/static/images/hero-mobile.webp' 
      : '/static/images/hero.webp';
    
    // プリロードリンクを作成
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = imageUrl;
    document.head.appendChild(preloadLink);
    
    return () => {
      if (document.head.contains(preloadLink)) {
        document.head.removeChild(preloadLink);
      }
    };
  }, [isMobile]);
  
  // シェーダーエフェクトの初期化
  useEffect(() => {
    if (canvasRef.current && !rendererRef.current) {
      // シーン、カメラ、レンダラーの初期化
      const scene = new THREE.Scene()
      sceneRef.current = scene
      
      // カメラの設定を画面アスペクト比に合わせて調整
      const aspect = window.innerWidth / window.innerHeight
      const camera = new THREE.OrthographicCamera(
        -aspect,  // left
        aspect,   // right
        1,        // top
        -1,       // bottom
        0,        // near
        1         // far
      )
      cameraRef.current = camera
      
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
        precision: isMobile ? "mediump" : "highp",
      })
      
      // デバイスに応じた品質設定
      const getOptimalSettings = () => {
        const width = window.innerWidth
        const height = window.innerHeight
        const hasLowPerformance = navigator.hardwareConcurrency <= 4
        const hasHighDPI = window.devicePixelRatio > 1.5
        const isSmallScreen = width < 768
        
        // 大画面では常にフル解像度
        const isLargeScreen = width >= 1280
        
        return {
          // 大画面ではフルサイズ、それ以外はデバイス性能に応じて調整
          resolution: isLargeScreen ? 1.0 :
                     isSmallScreen ? 0.5 :
                     hasLowPerformance ? 0.75 : 0.9,
          // 大画面では常にネイティブピクセル比を使用
          pixelRatio: isLargeScreen ? window.devicePixelRatio :
                     isSmallScreen ? 1 :
                     (hasHighDPI && hasLowPerformance) ? 1.5 :
                     Math.min(window.devicePixelRatio, 2),
          frameSkip: isSmallScreen ? 2 :
                    hasLowPerformance ? 1 : 0
        }
      }

      const settings = getOptimalSettings()
      const width = window.innerWidth
      const height = window.innerHeight
      
      renderer.setSize(
        Math.round(width * settings.resolution),
        Math.round(height * settings.resolution)
      )
      renderer.setPixelRatio(settings.pixelRatio)
      rendererRef.current = renderer
      rendererRef.current.frameSkip = settings.frameSkip
      
      // 背景画像のテクスチャ読み込み
      const textureLoader = new THREE.TextureLoader()
      
      // WebP画像の選択（モバイルとデスクトップで異なる最適化バージョンを使用）
      const imageUrl = isMobile 
        ? '/static/images/hero-mobile.webp' 
        : '/static/images/hero.webp';

      textureLoader.load(
        imageUrl,
        (texture) => {
          textureRef.current = texture
          
          // テクスチャのアスペクト比を計算
          const imageAspect = texture.image.width / texture.image.height
          const screenAspect = window.innerWidth / window.innerHeight
          
          // 画面を完全に覆うようにスケーリング
          let scaleX, scaleY
          if (screenAspect > imageAspect) {
            // 画面の方が横長: 幅に合わせる
            scaleX = aspect * 2
            scaleY = (aspect * 2) * (imageAspect / screenAspect)
          } else {
            // 画面の方が縦長: 高さに合わせる
            scaleX = 2 * (screenAspect / imageAspect)
            scaleY = 2
          }
          
          // 画面を完全に覆う平面ジオメトリの作成
          const geometry = new THREE.PlaneGeometry(scaleX, scaleY)
          const material = new THREE.MeshBasicMaterial({
            map: texture,
          })
          
          const mesh = new THREE.Mesh(geometry, material)
          // 中心に配置
          mesh.position.z = 0
          scene.add(mesh)
          
          // エフェクトコンポーザーの設定（簡略版）
          const composer = new EffectComposer(renderer)
          composerRef.current = composer
          
          // 基本レンダーパス
          const renderPass = new RenderPass(scene, camera)
          composer.addPass(renderPass)
          
          // コズミックエフェクトパス（シンプル化）
          const cosmicPass = new ShaderPass(CosmicEffectShader)
          cosmicPass.uniforms.intensity.value = 0
          cosmicPassRef.current = cosmicPass
          composer.addPass(cosmicPass)
          
          // レンズ歪みパス（シンプル化）
          const lensPass = new ShaderPass(LensDistortionShader)
          lensPass.uniforms.distortion.value = 0.3
          lensPass.renderToScreen = true
          lensPassRef.current = lensPass
          composer.addPass(lensPass)
          
          // アニメーションスタート
          animate(0)
        },
        undefined,
        (err) => console.error('Error loading texture:', err)
      )
      
      // アニメーションループ
      const animate = (time) => {
        if (!composerRef.current) return
        
        // フレームスキップによる最適化
        if (rendererRef.current?.frameSkip > 0 && 
            Math.floor(time / 60) % rendererRef.current.frameSkip !== 0) {
          animationFrameRef.current = requestAnimationFrame(animate)
          return
        }

        // パフォーマンス監視（Chrome Performance API）
        if ('performance' in window && 'memory' in performance) {
          const memory = performance.memory
          if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
            // メモリ使用量が高い場合、エフェクトを簡略化
            if (cosmicPassRef.current) {
              cosmicPassRef.current.enabled = false
            }
          }
        }
        
        // コズミックエフェクトの強度更新
        if (cosmicPassRef.current) {
          cosmicPassRef.current.uniforms.intensity.value = cosmicIntensity
          cosmicPassRef.current.uniforms.time.value = time * 0.0005
        }
        
        // レンズ歪みエフェクトの更新
        if (lensPassRef.current) {
          lensPassRef.current.uniforms.time.value = time * 0.0002
        }
        
        // レンダリング
        composerRef.current.render()
        
        // 次のフレーム
        animationFrameRef.current = requestAnimationFrame(animate)
      }
      
      // リサイズハンドラ
      const handleResize = () => {
        if (!rendererRef.current || !composerRef.current || !cosmicPassRef.current || !cameraRef.current) return
        
        const viewWidth = window.innerWidth
        const viewHeight = window.innerHeight
        const aspect = viewWidth / viewHeight
        
        // カメラのアスペクト比を更新
        const camera = cameraRef.current
        camera.left = -aspect
        camera.right = aspect
        camera.updateProjectionMatrix()
        
        // レンダラーとコンポーザーのサイズを更新
        const settings = getOptimalSettings()
        
        // 新しいサイズを計算
        const newWidth = Math.round(viewWidth * settings.resolution)
        const newHeight = Math.round(viewHeight * settings.resolution)
        
        rendererRef.current.setSize(newWidth, newHeight)
        composerRef.current.setSize(newWidth, newHeight)
        
        // メッシュのスケールを更新
        if (sceneRef.current) {
          sceneRef.current.traverse((object) => {
            if (object.isMesh) {
              if (textureRef.current) {
                const imageAspect = textureRef.current.image.width / textureRef.current.image.height
                const screenAspect = viewWidth / viewHeight
                
                if (screenAspect > imageAspect) {
                  object.scale.set(aspect * 2, (aspect * 2) * (imageAspect / screenAspect), 1)
                } else {
                  object.scale.set(2 * (screenAspect / imageAspect), 2, 1)
                }
              }
            }
          })
        }
        
        if (cosmicPassRef.current) {
          cosmicPassRef.current.uniforms.resolution.value.set(viewWidth, viewHeight)
        }
      }
      
      window.addEventListener('resize', handleResize)
      
      // クリーンアップ
      return () => {
        window.removeEventListener('resize', handleResize)
        
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        
        if (textureRef.current) {
          textureRef.current.dispose()
        }
        
        scene.traverse((object) => {
          if (object.isMesh) {
            object.geometry.dispose()
            object.material.dispose()
          }
        })
        
        if (rendererRef.current) {
          rendererRef.current.dispose()
        }
      }
    }
  }, [isMobile])

  return (
    <div className="relative w-full h-[100svh] overflow-hidden">
      {/* シェーダーエフェクト用キャンバス */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        aria-hidden="true"
      />
      
      {/* パーティクルシステム */}
      <CosmicParticles 
        isReducedMotion={isReducedMotion} 
        isMobile={isMobile} 
        scrollY={scrollY} 
      />
      
      {/* ヒーロー内テキスト */}
      <div
        className="absolute inset-0 flex flex-col justify-center items-center z-20 
          px-4 sm:px-6 md:px-8 lg:px-12
          pt-16 sm:pt-20 md:pt-24 lg:pt-28
          pb-24 sm:pb-28 md:pb-32 lg:pb-36"
        style={{
          opacity: Math.max(0, 1 - cosmicIntensity * 0.3),
          transform: `
            translateY(${Math.sin(scrollY * 0.003) * cosmicIntensity * 3}px)
            rotate(${Math.sin(scrollY * 0.002) * cosmicIntensity}deg)
          `,
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div className="w-full max-w-4xl mx-auto text-center">
          <div className="relative">
            <h1 className="
              text-white font-extralight
              text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
              tracking-[0.08em] xs:tracking-[0.1em] sm:tracking-[0.12em] md:tracking-[0.15em]
              leading-[1.2] xs:leading-[1.3] sm:leading-[1.4]
              mb-4 xs:mb-5 sm:mb-6 md:mb-8 lg:mb-10
              animate-star-twinkle
              [text-wrap:balance]
            ">
              {title}
            </h1>
            <div className="
              absolute -inset-x-6 sm:-inset-x-8 md:-inset-x-10 top-1/2 -translate-y-1/2 
              h-full max-h-24 sm:max-h-32 md:max-h-40
              bg-gradient-to-r from-transparent via-white/5 to-transparent 
              opacity-0 group-hover:opacity-100
              blur-2xl
              transition-opacity duration-1000
              pointer-events-none
            " />
          </div>
          
          <p className="
            text-white/90 font-light
            text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl
            tracking-wide sm:tracking-wider
            leading-relaxed sm:leading-relaxed
            max-w-prose mx-auto
            [text-wrap:pretty]
          ">
            {description}
          </p>
        </div>
      </div>

      {/* スクロールインジケーター */}
      <div
        className="
          absolute left-1/2 -translate-x-1/2
          bottom-6 xs:bottom-8 sm:bottom-10 md:bottom-12 lg:bottom-16
          flex flex-col items-center z-20
          transition-all duration-700 ease-out
        "
        style={{
          opacity: Math.max(0, 1 - cosmicIntensity * 0.4),
          transform: `translateY(${Math.sin(scrollY * 0.005) * cosmicIntensity * 3}px)`
        }}
      >
        <span className="
          text-cosmic-star
          text-sm sm:text-base md:text-lg
          font-light
          tracking-wider
          mb-3 sm:mb-4 md:mb-5
          flex items-center gap-2 sm:gap-3
        ">
          <span className="animate-pulse-slow">✦</span>
          {scrollIndicatorText}
          <span className="animate-pulse-slow">✦</span>
        </span>
        
        <div className="
          relative
          h-12 xs:h-16 sm:h-20 md:h-24 lg:h-32
          w-px
        ">
          <div className="
            absolute inset-0
            bg-gradient-to-b from-primary/90 via-cosmic-purple/60 to-transparent
            animate-pulse-slow
          " />
          <div className="
            absolute top-0 left-1/2 -translate-x-1/2
            w-1.5 sm:w-2 md:w-2.5
            h-1.5 sm:h-2 md:h-2.5
            bg-primary rounded-full
            shadow-glow
            animate-bounce-slow
          " />
        </div>
      </div>
    </div>
  )
}

export default EnhancedHero
