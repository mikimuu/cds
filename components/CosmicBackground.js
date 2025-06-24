'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'

/**
 * CosmicDance コンポーネント
 * - パフォーマンス最適化済みの宇宙シーン
 * - 動的解像度スケーリング
 * - FPSモニタリング
 */
const CosmicDance = ({ isReducedMotion, isMobile }) => {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const composerRef = useRef(null)
  const animationFrameRef = useRef(null)
  const timeRef = useRef(0)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const fpsRef = useRef(60)
  const qualityRef = useRef({
    resolution: isMobile ? 0.3 : 0.6,
    particleCount: isMobile ? 500 : 1500,
    spiralCount: isMobile ? 2 : 4,
    bloomStrength: isMobile ? 0.4 : 0.6,
    samples: isMobile ? 1 : 2
  })

  useEffect(() => {
    if (!containerRef.current) return

    // パフォーマンスモニタリング
    function updateFPS() {
      const now = performance.now()
      frameCountRef.current++

      if (now - lastTimeRef.current >= 1000) {
        fpsRef.current = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current))
        frameCountRef.current = 0
        lastTimeRef.current = now

        // 動的解像度スケーリング
        if (fpsRef.current < 25 && qualityRef.current.resolution > 0.3) {
          qualityRef.current.resolution = Math.max(0.3, qualityRef.current.resolution - 0.1)
          onResize()
        } else if (fpsRef.current > 45 && qualityRef.current.resolution < (isMobile ? 0.5 : 0.8)) {
          qualityRef.current.resolution = Math.min(isMobile ? 0.5 : 0.8, qualityRef.current.resolution + 0.05)
          onResize()
        }
      }
    }

    // ====================================================
    // 1. 基本セットアップ (シーン, カメラ, レンダラー)
    // ====================================================
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000510)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    )
    camera.position.z = 500
    camera.position.y = 0
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
      precision: "mediump",
      stencil: false,
      depth: false,
      logarithmicDepthBuffer: false
    })
    renderer.setSize(
      window.innerWidth * qualityRef.current.resolution,
      window.innerHeight * qualityRef.current.resolution,
      false
    )
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // ====================================================
    // 2. コントロール (OrbitControls)
    // ====================================================
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enableZoom = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.2

    // ====================================================
    // 3. ポストプロセッシングの設定
    // ====================================================
    const composer = new EffectComposer(renderer)
    composerRef.current = composer

    // RenderPass
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // UnrealBloomPass
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      qualityRef.current.bloomStrength,
      0.5,
      0.85
    )
    composer.addPass(bloomPass)

    // デスクトップのみ追加エフェクト
    if (!isMobile) {
      // FilmPass (デスクトップのみ)
      composer.addPass(new FilmPass(0.2, 0.2, 648, false))
    }

    // ====================================================
    // 4. 星のパーティクルシステム
    // ====================================================
    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = qualityRef.current.particleCount
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1500
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1500
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1500
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      size: isMobile ? 1.5 : 2,
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    })

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particleSystem)

    // ====================================================
    // 5. アンビエントライト
    // ====================================================
    scene.add(new THREE.AmbientLight(0x202040))

    // ====================================================
    // 6. アニメーションループ
    // ====================================================
    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate)
      
      // FPSモニタリングと動的解像度調整
      updateFPS()

      // スキップフレーム（モバイル最適化）
      if (isMobile && frameCountRef.current % 3 !== 0) return

      // パーティクルアニメーション
      particleSystem.rotation.y += 0.0001

      // コントロール更新
      controls.update()

      // レンダリング
      composer.render()
    }

    animate()

    // ====================================================
    // リサイズ対応
    // ====================================================
    function onResize() {
      const width = window.innerWidth * qualityRef.current.resolution
      const height = window.innerHeight * qualityRef.current.resolution

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height, false)
      composer.setSize(width, height)
    }

    window.addEventListener('resize', onResize)

    // ====================================================
    // クリーンアップ
    // ====================================================
    return () => {
      window.removeEventListener('resize', onResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      // メモリリーク防止
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose())
          } else {
            obj.material.dispose()
          }
        }
      })

      renderer.dispose()
      composer.dispose()
      
      // DOM要素のクリーンアップ
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [isReducedMotion, isMobile])

  return <div ref={containerRef} className="fixed inset-0 -z-10" />
}

export default CosmicDance
