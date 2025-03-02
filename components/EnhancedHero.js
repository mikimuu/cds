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
      antialias: false, // アンチエイリアスを無効化
      powerPreference: "high-performance",
      precision: isMobile ? "mediump" : "highp", // モバイルデバイスでは精度を下げる
    })
    
    // 解像度の調整（低めに設定）
    const resolution = isMobile ? 0.5 : 0.75
    renderer.setSize(window.innerWidth * resolution, window.innerHeight * resolution)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5))
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
    })
    
    // アニメーションループ
    const animate = (time) => {
      if (!composerRef.current) return
      
      // モバイルの場合は毎フレーム描画しない（最適化）
      if (isMobile && Math.floor(time / 60) % 2 !== 0) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
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
        className="absolute inset-0 flex flex-col justify-center items-center px-2 xs:px-3 sm:px-6 md:px-8 z-20 pt-16"
        style={{
          opacity: Math.max(0, 1 - cosmicIntensity * 0.3),
          transform: `
            translateY(${Math.sin(scrollY * 0.003) * cosmicIntensity * 3}px)
            rotate(${Math.sin(scrollY * 0.002) * cosmicIntensity}deg)
          `
        }}
      >
        <div className="max-w-[280px] xs:max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl mx-auto text-center text-white">
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extralight tracking-[0.08em] xs:tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] mb-2 xs:mb-3 sm:mb-4 md:mb-6 lg:mb-8 animate-star-twinkle">
            {title}
          </h1>
          <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-light tracking-wide sm:tracking-wider leading-relaxed px-1 xs:px-2 sm:px-4 md:px-0">
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
        <div className="relative h-10 xs:h-12 sm:h-16 md:h-24 lg:h-32 w-px">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-cosmic-purple/50 to-transparent"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 xs:w-1.5 sm:w-2 h-1 xs:h-1.5 sm:h-2 bg-primary rounded-full shadow-glow"></div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedHero