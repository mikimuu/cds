'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { CatmullRomCurve3 } from 'three/src/extras/curves/CatmullRomCurve3.js'
import { TubeGeometry } from 'three/src/geometries/TubeGeometry.js'

const CosmicParticles = ({ isReducedMotion, isMobile, scrollY }) => {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const particlesRef = useRef(null)
  const meteorsRef = useRef([])
  const animationFrameRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // パフォーマンス設定
    const quality = {
      particleCount: isMobile ? 1000 : 2000,
      meteorCount: isMobile ? 3 : 7,
      resolution: isMobile ? 0.5 : 1,
      animationSpeed: isReducedMotion ? 0.5 : 1
    }

    // シーン、カメラ、レンダラーの初期化
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    )
    camera.position.z = 500
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // 星のパーティクルシステム
    const createStarParticles = () => {
      const geometry = new THREE.BufferGeometry()
      const vertices = []
      const sizes = []
      const colors = []
      const opacities = []
      const twinkleFactors = []

      // 星の色のバリエーション
      const starColors = [
        new THREE.Color(0xFFFFFF), // 白
        new THREE.Color(0xCCCCFF), // 青白
        new THREE.Color(0xFFCCAA), // 橙
        new THREE.Color(0xAAFFFF), // 水色
        new THREE.Color(0xFFAACC)  // ピンク
      ]

      for (let i = 0; i < quality.particleCount; i++) {
        // ランダムな位置（球状に分布）
        const radius = Math.random() * 1000 + 200
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        
        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.sin(phi) * Math.sin(theta)
        const z = radius * Math.cos(phi)
        
        vertices.push(x, y, z)
        
        // サイズのバリエーション
        const size = Math.random() * 3 + 0.5
        sizes.push(size)
        
        // 色のバリエーション
        const color = starColors[Math.floor(Math.random() * starColors.length)]
        colors.push(color.r, color.g, color.b)
        
        // 透明度のバリエーション
        opacities.push(Math.random() * 0.5 + 0.5)
        
        // きらめき係数
        twinkleFactors.push(Math.random() * 2 + 0.5)
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
      geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
      geometry.setAttribute('opacity', new THREE.Float32BufferAttribute(opacities, 1))
      geometry.setAttribute('twinkleFactor', new THREE.Float32BufferAttribute(twinkleFactors, 1))

      // シェーダーマテリアル
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          pixelRatio: { value: renderer.getPixelRatio() }
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          attribute float opacity;
          attribute float twinkleFactor;
          uniform float time;
          uniform float pixelRatio;
          varying vec3 vColor;
          varying float vOpacity;
          
          void main() {
            vColor = color;
            
            // きらめき効果
            float twinkle = sin(time * twinkleFactor) * 0.5 + 0.5;
            vOpacity = opacity * twinkle;
            
            // スクロールに応じた動き
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vOpacity;
          
          void main() {
            // 円形の点
            float distance = length(gl_PointCoord - vec2(0.5));
            if (distance > 0.5) discard;
            
            // 星のグロー効果
            float intensity = 1.0 - distance * 2.0;
            intensity = pow(intensity, 1.5);
            
            gl_FragColor = vec4(vColor, vOpacity * intensity);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })

      const particles = new THREE.Points(geometry, material)
      scene.add(particles)
      particlesRef.current = particles
    }

    // 流星の作成
    const createMeteors = () => {
      const meteors = []
      
      for (let i = 0; i < quality.meteorCount; i++) {
        createMeteor(meteors)
      }
      
      meteorsRef.current = meteors
    }
    
    // 個別の流星を作成
    const createMeteor = (meteors) => {
      // 流星の軌跡のジオメトリ
      const points = []
      const length = Math.random() * 100 + 50
      
      for (let i = 0; i < 20; i++) {
        const t = i / 19
        points.push(new THREE.Vector3(t * length, 0, 0))
      }
      
      const curve = new CatmullRomCurve3(points)
      const geometry = new TubeGeometry(curve, 20, 0.8, 8, false)
      
      // 流星のマテリアル
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(0xFFFFFF) },
          headPosition: { value: 0 }
        },
        vertexShader: `
          uniform float time;
          uniform float headPosition;
          varying float vPosition;
          
          void main() {
            vPosition = position.x / ${length.toFixed(1)};
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          uniform float headPosition;
          varying float vPosition;
          
          void main() {
            // 流星の頭部と尾部の効果
            float tailFactor = smoothstep(headPosition - 0.05, headPosition, vPosition);
            float headGlow = smoothstep(headPosition - 0.1, headPosition, vPosition) * 
                            (1.0 - smoothstep(headPosition, headPosition + 0.01, vPosition));
            
            // 尾部のグラデーション
            float tailGradient = 1.0 - vPosition;
            
            vec3 finalColor = color * mix(tailGradient * 0.5, 1.0, headGlow * 5.0);
            float alpha = tailFactor * mix(tailGradient, 1.0, headGlow * 3.0);
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      })
      
      const meteor = new THREE.Mesh(geometry, material)
      
      // ランダムな位置と方向
      meteor.position.set(
        Math.random() * 2000 - 1000,
        Math.random() * 1000 + 500,
        Math.random() * -500 - 100
      )
      
      meteor.rotation.set(
        0,
        0,
        Math.random() * Math.PI * 2
      )
      
      meteor.scale.set(1, 1, 1)
      
      // 流星のアニメーション情報
      meteor.userData = {
        speed: Math.random() * 0.4 + 0.2,
        lifeTime: 0,
        maxLifeTime: Math.random() * 8 + 4,
        active: false,
        delay: Math.random() * 10
      }
      
      scene.add(meteor)
      meteors.push(meteor)
    }

    // アニメーションループ
    const animate = (time) => {
      time *= 0.001 * quality.animationSpeed // 秒単位に変換

      // 星のアニメーション
      if (particlesRef.current) {
        particlesRef.current.material.uniforms.time.value = time
        
        // スクロールに応じた回転
        particlesRef.current.rotation.y = scrollY * 0.0001
        particlesRef.current.rotation.x = scrollY * 0.00005
      }
      
      // 流星のアニメーション
      meteorsRef.current.forEach((meteor, index) => {
        const userData = meteor.userData
        
        // 遅延後にアクティブ化
        if (!userData.active) {
          userData.delay -= 0.016
          if (userData.delay <= 0) {
            userData.active = true
          } else {
            return
          }
        }
        
        userData.lifeTime += 0.016
        
        // 流星の頭部位置のアニメーション
        const headPosition = (userData.lifeTime / userData.maxLifeTime)
        meteor.material.uniforms.headPosition.value = headPosition
        
        // ライフタイム終了後にリセット
        if (userData.lifeTime >= userData.maxLifeTime) {
          userData.lifeTime = 0
          userData.maxLifeTime = Math.random() * 8 + 4
          userData.active = false
          userData.delay = Math.random() * 5
          
          // 新しい位置に移動
          meteor.position.set(
            Math.random() * 2000 - 1000,
            Math.random() * 1000 + 500,
            Math.random() * -500 - 100
          )
        }
      })

      // レンダリング
      renderer.render(scene, camera)
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // リサイズハンドラ
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return
      
      const width = window.innerWidth
      const height = window.innerHeight
      
      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
      
      rendererRef.current.setSize(width, height)
    }

    // 初期化
    createStarParticles()
    createMeteors()
    
    // イベントリスナー
    window.addEventListener('resize', handleResize)
    
    // アニメーション開始
    animate(0)

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', handleResize)
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      
      // メモリリーク防止
      if (particlesRef.current) {
        particlesRef.current.geometry.dispose()
        particlesRef.current.material.dispose()
        scene.remove(particlesRef.current)
      }
      
      meteorsRef.current.forEach(meteor => {
        meteor.geometry.dispose()
        meteor.material.dispose()
        scene.remove(meteor)
      })
    }
  }, [isReducedMotion, isMobile, scrollY])

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-10 pointer-events-none"
      aria-hidden="true"
    />
  )
}

export default CosmicParticles 