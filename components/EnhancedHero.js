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
  
  // モバイル検出
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // シェーダーエフェクトの初期化
  useEffect(() => {
    if (!canvasRef.current) return
    
    // シーン、カメラ、レンダラーの初期化
    const scene = new THREE.Scene()
    sceneRef.current = scene
    
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    cameraRef.current = camera
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer
    
    // 背景画像のテクスチャ読み込み
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load('/static/images/home.jpg', (texture) => {
      textureRef.current = texture
      
      // 平面ジオメトリの作成
      const geometry = new THREE.PlaneGeometry(2, 2)
      const material = new THREE.MeshBasicMaterial({ map: texture })
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)
      
      // エフェクトコンポーザーの設定
      const composer = new EffectComposer(renderer)
      composerRef.current = composer
      
      // レンダーパス
      const renderPass = new RenderPass(scene, camera)
      composer.addPass(renderPass)
      
      // コズミックエフェクトパス
      const cosmicPass = new ShaderPass(CosmicEffectShader)
      cosmicPass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight)
      cosmicPassRef.current = cosmicPass
      composer.addPass(cosmicPass)
      
      // レンズ歪みエフェクトパス
      const lensPass = new ShaderPass(LensDistortionShader)
      lensPassRef.current = lensPass
      composer.addPass(lensPass)
      
      // アニメーション開始
      animate(0)
    })
    
    // アニメーションループ
    const animate = (time) => {
      time *= 0.001 // 秒単位に変換
      
      if (cosmicPassRef.current) {
        cosmicPassRef.current.uniforms.time.value = time
        cosmicPassRef.current.uniforms.intensity.value = cosmicIntensity * 0.8
        cosmicPassRef.current.uniforms.scrollY.value = scrollY
      }
      
      if (lensPassRef.current) {
        lensPassRef.current.uniforms.time.value = time
        lensPassRef.current.uniforms.distortion.value = 0.1 + cosmicIntensity * 0.2
      }
      
      if (composerRef.current) {
        composerRef.current.render()
      }
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    // リサイズハンドラ
    const handleResize = () => {
      if (!rendererRef.current || !composerRef.current || !cosmicPassRef.current) return
      
      const width = window.innerWidth
      const height = window.innerHeight
      
      rendererRef.current.setSize(width, height)
      composerRef.current.setSize(width, height)
      
      if (cosmicPassRef.current) {
        cosmicPassRef.current.uniforms.resolution.value.set(width, height)
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
  }, [isMobile])

  return (
    <div className="relative w-full h-[100svh] overflow-hidden">
      {/* シェーダーエフェクト用キャンバス */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* パーティクルシステム */}
      <CosmicParticles 
        isReducedMotion={isReducedMotion} 
        isMobile={isMobile} 
        scrollY={scrollY} 
      />
      
      {/* ヒーロー内テキスト */}
      <div
        className="absolute inset-0 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 z-20"
        style={{
          opacity: Math.max(0, 1 - cosmicIntensity * 0.3),
          transform: `
            translateY(${Math.sin(scrollY * 0.003) * cosmicIntensity * 3}px)
            rotate(${Math.sin(scrollY * 0.002) * cosmicIntensity}deg)
          `
        }}
      >
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-[0.15em] sm:tracking-[0.2em] mb-4 sm:mb-6 md:mb-8 animate-star-twinkle">
            {title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-light tracking-wide sm:tracking-wider leading-relaxed px-4 sm:px-0">
            {description}
          </p>
        </div>
      </div>

      {/* スクロールインジケーター */}
      <div
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20"
        style={{
          opacity: Math.max(0, 1 - cosmicIntensity * 0.4),
          transform: `translateY(${Math.sin(scrollY * 0.005) * cosmicIntensity * 3}px)`
        }}
      >
        <span className="text-xs sm:text-sm font-light mb-2 sm:mb-4 text-cosmic-star">
          ✦ {scrollIndicatorText} ✦
        </span>
        <div className="relative h-16 sm:h-24 md:h-32 w-px">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-cosmic-purple/50 to-transparent"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-primary rounded-full shadow-glow"></div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedHero