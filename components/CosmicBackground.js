'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader'
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry'

/**
 * FullScreenQuad ヘルパークラス
 * （ポストプロセス用フルスクリーン描画）
 */
class FullScreenQuad {
  constructor(material) {
    this._mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    this._scene = new THREE.Scene()
    this._camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this._scene.add(this._mesh)
  }
  render(renderer) {
    renderer.render(this._scene, this._camera)
  }
}

/**
 * 自前実装の GodRaysPass クラス
 * ・tDiffuse を入力テクスチャとして、光源位置からの放射光（God Rays）を計算
 * ・シンプルなループ処理で放射光らしさを表現
 */
class GodRaysPass {
  constructor(lightPositionOnScreen, options = {}) {
    this.uniforms = {
      tDiffuse: { value: null },
      lightPositionOnScreen: { value: lightPositionOnScreen.clone() },
      exposure: { value: options.exposure !== undefined ? options.exposure : 0.69 },
      decay: { value: options.decay !== undefined ? options.decay : 0.93 },
      density: { value: options.density !== undefined ? options.density : 0.96 },
      weight: { value: options.weight !== undefined ? options.weight : 0.4 },
      numSamples: { value: options.numSamples !== undefined ? options.numSamples : 100 }
    }

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 lightPositionOnScreen;
        uniform float exposure;
        uniform float decay;
        uniform float density;
        uniform float weight;
        uniform int numSamples;
        varying vec2 vUv;
        void main() {
          // 光源位置からのテクスチャ座標のずれを計算
          vec2 deltaTextCoord = (vUv - lightPositionOnScreen) * density / float(numSamples);
          vec2 textCoord = vUv;
          float illuminationDecay = 1.0;
          vec4 color = vec4(0.0);
          // 最大 100 回のサンプリングループ（numSamples 未満の場合は break）
          for (int i = 0; i < 100; i++) {
            if (i >= numSamples) break;
            textCoord -= deltaTextCoord;
            vec4 sample = texture2D(tDiffuse, textCoord);
            sample *= illuminationDecay * weight;
            color += sample;
            illuminationDecay *= decay;
          }
          color *= exposure;
          gl_FragColor = color;
        }
      `
    })

    this.fsQuad = new FullScreenQuad(this.material)
    this.enabled = true
    this.renderToScreen = false
    this.needsSwap = true
  }

  render(renderer, writeBuffer, readBuffer) {
    this.uniforms.tDiffuse.value = readBuffer.texture
    if (this.renderToScreen) {
      renderer.setRenderTarget(null)
      this.fsQuad.render(renderer)
    } else {
      renderer.setRenderTarget(writeBuffer)
      if (this.clear) renderer.clear()
      this.fsQuad.render(renderer)
    }
  }

  setSize(width, height) {
    // サイズ変更に応じた処理（必要なら実装）
  }
}

/**
 * CosmicDance コンポーネント
 * - 複数のポストプロセス、カスタムシェーダー、各種オブジェクト群により
 *   宇宙を感じさせる最高のビジュアルを実現
 */
const CosmicDance = ({ isReducedMotion, isMobile }) => {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const composerRef = useRef(null)
  const animationFrameRef = useRef(null)
  const timeRef = useRef(0)
  const particleSystemRef = useRef(null)
  const hypercubeRef = useRef(null)
  const orbitsRef = useRef([])

  useEffect(() => {
    if (!containerRef.current) return

    // パフォーマンス設定
    const quality = {
      particleCount: isMobile ? 1000 : 2000, // パーティクル数を削減（元: 3000-5000）
      spiralCount: isMobile ? 3 : 5,         // 渦巻きの数を削減（元: 5-8）
      resolution: isMobile ? 0.5 : 0.75,     // 解像度を下げる（元: 0.75-1.0）
      bloomStrength: isMobile ? 0.5 : 0.75,  // ブルームエフェクトを弱める
      samples: isMobile ? 2 : 4              // サンプル数を減らす
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
      2000
    )
    camera.position.z = 800
    camera.position.y = 50
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      powerPreference: "high-performance",
      precision: isMobile ? "mediump" : "highp", // モバイルでは精度を下げる
    })
    renderer.setSize(window.innerWidth * quality.resolution, window.innerHeight * quality.resolution)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2)) // ピクセル比を制限
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // ====================================================
    // 2. コントロール (OrbitControls)
    // ====================================================
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // ====================================================
    // 3. ポストプロセッシングの設定
    // ====================================================
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // UnrealBloomPass
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      quality.bloomStrength,
      0.5,
      0.85
    )
    composer.addPass(bloomPass)

    // FilmPass と GlitchPass
    composer.addPass(new FilmPass(0.35, 0.75, 2048, false))
    const glitchPass = new GlitchPass()
    glitchPass.goWild = false
    composer.addPass(glitchPass)

    // RGBShiftPass
    const rgbShiftPass = new ShaderPass(RGBShiftShader)
    rgbShiftPass.uniforms.amount.value = 0.0015
    composer.addPass(rgbShiftPass)

    // AfterimagePass
    const afterimagePass = new AfterimagePass(0.95)
    composer.addPass(afterimagePass)

    // クロマシフト（レンズ歪み）用シェーダー
    const chromaShader = {
      uniforms: {
        tDiffuse: { value: null },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        uniform float time;
        varying vec2 vUv;
        void main(){
          float aberration = 0.005 + 0.005 * sin(time * 2.0);
          vec2 redUV = vUv + vec2(aberration, 0.0);
          vec2 blueUV = vUv - vec2(aberration, 0.0);
          vec4 red = texture2D(tDiffuse, redUV);
          vec4 blue = texture2D(tDiffuse, blueUV);
          vec4 green = texture2D(tDiffuse, vUv);
          gl_FragColor = vec4(red.r, green.g, blue.b, 1.0);
        }
      `
    }
    const chromaPass = new ShaderPass(chromaShader)
    composer.addPass(chromaPass)

    // ボリューメトリック・ネビュラシェーダー
    const nebulaUniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    }
    const nebulaShader = {
      uniforms: nebulaUniforms,
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        varying vec2 vUv;

        float random (vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) +
                 (c - a) * u.y * (1.0 - u.x) +
                 (d - b) * u.x * u.y;
        }

        void main() {
          vec2 uv = vUv * 4.0;
          float n = noise(uv + time * 0.1);
          vec3 nebulaColor = mix(vec3(0.0, 0.0, 0.2), vec3(0.2, 0.1, 0.5), n);
          gl_FragColor = vec4(nebulaColor, 0.25);
        }
      `
    }
    const nebulaPass = new ShaderPass(nebulaShader)
    composer.addPass(nebulaPass)

    // 進化版レンズ歪みシェーダー
    const enhancedLensDistortionShader = {
      uniforms: {
        tDiffuse: { value: null },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        time: { value: 0 },
        distortion: { value: 0.15 },
        lensCenter: { value: new THREE.Vector2(0.5, 0.5) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        uniform float time;
        uniform float distortion;
        uniform vec2 lensCenter;
        varying vec2 vUv;

        void main(){
          vec2 uv = vUv;
          vec2 delta = uv - lensCenter;
          float dist = length(delta);
          float effect = distortion * (1.0 + 0.5 * sin(time + dist * 10.0));
          vec2 distortedUV = uv + normalize(delta) * effect * dist;
          vec4 color = texture2D(tDiffuse, distortedUV);
          gl_FragColor = color;
        }
      `
    }
    const enhancedLensDistortionPass = new ShaderPass(enhancedLensDistortionShader)
    composer.addPass(enhancedLensDistortionPass)

    // GodRays 用のオクルージョンレンダーターゲット
    const occlusionRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)
    const occlusionComposer = new EffectComposer(renderer, occlusionRenderTarget)
    // 自前実装の GodRaysPass を使用
    // ※ここでは例として、スクリーン中央（0.5, 0.5）を光源位置としています
    const lightPositionOnScreen = new THREE.Vector2(0.5, 0.5)
    const godRaysPass = new GodRaysPass(lightPositionOnScreen, {
      exposure: 0.69,
      decay: 0.93,
      density: 0.96,
      weight: 0.4,
      numSamples: 100
    })
    composer.addPass(godRaysPass)

    // 最終出力パス
    composer.addPass(new ShaderPass(CopyShader))

    // ====================================================
    // 4. 背景レイヤー: Raymarchingでフラクタル背景
    // ====================================================
    const bgScene = new THREE.Scene()
    const bgCamera = new THREE.Camera()
    bgCamera.position.z = 1

    const bgGeometry = new THREE.PlaneGeometry(2, 2)
    const bgMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        void main(){
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;

        // Mandelbulb風フラクタルの簡易Raymarching
        float mandelbulb(vec3 p) {
          float power = 8.0;
          vec3 z = p;
          float dr = 1.0;
          float r = 0.0;
          for(int i = 0; i < 5; i++) {
            r = length(z);
            if(r > 2.0) break;
            float theta = acos(z.z / r);
            float phi = atan(z.y, z.x);
            dr = pow(r, power - 1.0) * power * dr + 1.0;
            float zr = pow(r, power);
            theta *= power;
            phi *= power;
            z = zr * vec3(sin(theta) * cos(phi),
                          sin(theta) * sin(phi),
                          cos(theta)) + p;
          }
          return 0.5 * log(r) * r / dr;
        }

        float raymarch(vec3 ro, vec3 rd) {
          float t = 0.0;
          for(int i = 0; i < 64; i++){
            vec3 pos = ro + rd * t;
            float dist = mandelbulb(pos);
            if(dist < 0.001){
              return t;
            }
            t += dist * 0.5;
            if(t > 100.0) break;
          }
          return t;
        }

        void main(){
          vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
          uv.x *= resolution.x / resolution.y;
          vec3 ro = vec3(0.0, 0.0, -3.5);
          vec3 rd = normalize(vec3(uv.xy, 1.5));

          float a = time * 0.2;
          mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
          rd.xy = rot * rd.xy;

          float t = raymarch(ro, rd);
          if(t > 50.0) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
          }

          vec3 pos = ro + rd * t;
          float colorFactor = length(pos.xy) * 0.3;
          vec3 col = vec3(
            0.5 + 0.5 * sin(colorFactor + time),
            0.5 + 0.5 * sin(colorFactor + time * 2.0),
            0.5 + 0.5 * sin(colorFactor + time * 3.0)
          );
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      depthWrite: false,
      depthTest: false
    })
    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial)
    bgScene.add(bgMesh)

    // ====================================================
    // 5. GodRays 用ライトソース (ブラックホール)
    // ====================================================
    const blackHole = new THREE.Mesh(
      new THREE.SphereGeometry(15, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    )
    blackHole.position.set(0, 0, -500)
    scene.add(blackHole)

    const occlusionScene = new THREE.Scene()
    const blackHoleOcclusion = blackHole.clone()
    blackHoleOcclusion.material = new THREE.MeshBasicMaterial({ color: 0xffffff })
    occlusionScene.add(blackHoleOcclusion)

    // ====================================================
    // 6. 量子粒子システム
    // ====================================================
    class QuantumParticleSystem {
      constructor(count = 2000) { // パーティクル数を削減
        this.particles = new THREE.BufferGeometry()
        this.positions = new Float32Array(count * 3)
        this.entangledPairs = new Map()

        for (let i = 0; i < count; i++) {
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(2 * Math.random() - 1)
          const r = 500 * Math.cbrt(Math.random())
          this.positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
          this.positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
          this.positions[i * 3 + 2] = r * Math.cos(phi)
          if (i % 2 === 0 && i < count - 1) {
            this.entangledPairs.set(i, i + 1)
            this.entangledPairs.set(i + 1, i)
          }
        }

        this.particles.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
        this.material = new THREE.PointsMaterial({
          size: 0.8,
          color: 0x00ffff,
          blending: THREE.AdditiveBlending,
          transparent: true,
          opacity: 0.7
        })
        this.mesh = new THREE.Points(this.particles, this.material)
        scene.add(this.mesh)
      }

      update(time) {
        const pos = this.particles.attributes.position.array
        for (let i = 0; i < pos.length; i += 3) {
          const pairIndex = this.entangledPairs.get(i / 3)
          if (pairIndex !== undefined) {
            pos[i] = pos[pairIndex * 3] + Math.sin(time) * 5
            pos[i + 1] = pos[pairIndex * 3 + 1] + Math.cos(time) * 5
            pos[i + 2] = pos[pairIndex * 3 + 2] + Math.sin(time * 0.5) * 5
          }
          if (Math.random() < 0.0001) {
            pos[i] += (Math.random() - 0.5) * 50
            pos[i + 1] += (Math.random() - 0.5) * 50
            pos[i + 2] += (Math.random() - 0.5) * 50
          }
        }
        this.particles.attributes.position.needsUpdate = true
      }
    }
    const quantumParticles = new QuantumParticleSystem(10000)

    // ====================================================
    // 7. 中景: 星のパーティクルフィールド
    // ====================================================
    const particleCount = 5000
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesPositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      particlesPositions[i * 3] = (Math.random() - 0.5) * 2000
      particlesPositions[i * 3 + 1] = (Math.random() - 0.5) * 2000
      particlesPositions[i * 3 + 2] = (Math.random() - 0.5) * 2000
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3))
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      transparent: true,
      opacity: 0.7
    })
    const starField = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(starField)

    // ====================================================
    // 8. 前景オブジェクト: 螺旋アーム、中央パルスオブジェクト、トーラス、メビウス帯、4次元超立方体
    // ====================================================
    const spiralGroup = new THREE.Group()
    scene.add(spiralGroup)
    const armCount = 8
    const arms = []
    function generateSpiralPoints(time, armIndex) {
      const points = []
      const segments = 200
      for (let i = 0; i < segments; i++) {
        const t = i / (segments - 1)
        const angle = t * Math.PI * 6 + (armIndex / armCount) * Math.PI * 2 + time * 0.5
        const radius = 50 + 300 * t + 20 * Math.sin(time + t * 10)
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        const z = 50 * Math.sin(t * Math.PI * 4 + time)
        points.push(new THREE.Vector3(x, y, z))
      }
      return points
    }
    for (let i = 0; i < armCount; i++) {
      const points = generateSpiralPoints(0, i)
      const curve = new THREE.CatmullRomCurve3(points)
      const tubeGeom = new THREE.TubeGeometry(curve, 400, 2, 16, false)
      const tubeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(i / armCount, 0.7, 0.5),
        emissive: 0x111111,
        roughness: 0.3,
        metalness: 0.1
      })
      const armMesh = new THREE.Mesh(tubeGeom, tubeMat)
      spiralGroup.add(armMesh)
      arms.push({ curve, mesh: armMesh, armIndex: i })
    }

    // 中央パルスオブジェクト（パラメトリックジオメトリ）
    const centralParametric = new ParametricGeometry((u, v, target) => {
      const theta = u * Math.PI * 2 - Math.PI
      const phi = v * Math.PI - Math.PI / 2
      const r = 20 + 5 * Math.sin(8 * theta + 3 * phi)
      const x = r * Math.cos(phi) * Math.cos(theta)
      const y = r * Math.cos(phi) * Math.sin(theta)
      const z = r * Math.sin(phi)
      target.set(x, y, z)
    }, 128, 128)
    const centralMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0xff6600) },
        emissive: { value: new THREE.Color(0xff2200) },
        cameraPosition: { value: camera.position }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main(){
          vNormal = normalMatrix * normal;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform vec3 emissive;
        uniform vec3 cameraPosition;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main(){
          float pulse = sin(time * 2.0) * 0.5 + 0.5;
          vec3 viewDir = normalize(cameraPosition - vWorldPos);
          float fresnel = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), 3.0);
          vec3 finalColor = mix(color, emissive, pulse * 0.5 + fresnel * 0.3);
          finalColor += 0.2 * vec3(
            sin(time + vWorldPos.x * 0.1),
            sin(time + vWorldPos.y * 0.1),
            sin(time + vWorldPos.z * 0.1)
          );
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      lights: false
    })
    const centralMesh = new THREE.Mesh(centralParametric, centralMaterial)
    scene.add(centralMesh)

    // トーラス
    const torusGeometry = new THREE.TorusGeometry(50, 15, 16, 100)
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: 0x3399ff,
      emissive: 0x001133,
      roughness: 0.4,
      metalness: 0.2
    })
    const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial)
    torusMesh.position.set(-300, 100, -200)
    scene.add(torusMesh)

    // メビウス帯
    const mobiusParametric = new ParametricGeometry((u, t, target) => {
      u = u * Math.PI * 2
      t = t * 2 - 1
      const a = 50
      const x = (a + t * Math.cos(u / 2)) * Math.cos(u)
      const y = (a + t * Math.cos(u / 2)) * Math.sin(u)
      const z = t * Math.sin(u / 2)
      target.set(x, y, z)
    }, 100, 20)
    const mobiusMaterial = new THREE.MeshStandardMaterial({
      color: 0xff66cc,
      emissive: 0x330033,
      roughness: 0.5,
      metalness: 0.1,
      side: THREE.DoubleSide
    })
    const mobiusMesh = new THREE.Mesh(mobiusParametric, mobiusMaterial)
    mobiusMesh.position.set(300, -100, 100)
    scene.add(mobiusMesh)

    // 4次元超立方体（ワイヤーフレーム表示）
    class Hypercube {
      constructor() {
        this.geometry = new THREE.BufferGeometry()
        this.vertices = new Float32Array(16 * 3)
        const edges = []
        const d4Vertices = []

        for (let i = 0; i < 16; i++) {
          const x = (i & 1) ? 1 : -1
          const y = (i & 2) ? 1 : -1
          const z = (i & 4) ? 1 : -1
          const w = (i & 8) ? 1 : -1
          d4Vertices.push([x, y, z, w])
        }

        for (let i = 0; i < 16; i++) {
          for (let j = i + 1; j < 16; j++) {
            if (this.hammingDistance(i, j) === 1) {
              edges.push(i, j)
            }
          }
        }
        this.geometry.setIndex(edges)
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.vertices, 3))
        this.material = new THREE.LineBasicMaterial({
          color: 0x00ff88,
          transparent: true,
          opacity: 0.6
        })
        this.mesh = new THREE.LineSegments(this.geometry, this.material)
        scene.add(this.mesh)

        const animateVertices = (time) => {
          const angle = time * 0.2
          const rot = [
            [Math.cos(angle), -Math.sin(angle), 0, 0],
            [Math.sin(angle), Math.cos(angle), 0, 0],
            [0, 0, Math.cos(angle * 0.7), -Math.sin(angle * 0.7)],
            [0, 0, Math.sin(angle * 0.7), Math.cos(angle * 0.7)]
          ]
          for (let i = 0; i < 16; i++) {
            const v = d4Vertices[i]
            const r = [
              rot[0][0] * v[0] + rot[0][1] * v[1] + rot[0][2] * v[2] + rot[0][3] * v[3],
              rot[1][0] * v[0] + rot[1][1] * v[1] + rot[1][2] * v[2] + rot[1][3] * v[3],
              rot[2][0] * v[0] + rot[2][1] * v[1] + rot[2][2] * v[2] + rot[2][3] * v[3],
              rot[3][0] * v[0] + rot[3][1] * v[1] + rot[3][2] * v[2] + rot[3][3] * v[3]
            ]
            const scale = 100
            this.vertices[i * 3] = r[0] * scale / (1 + r[3] * 0.01)
            this.vertices[i * 3 + 1] = r[1] * scale / (1 + r[3] * 0.01)
            this.vertices[i * 3 + 2] = r[2] * scale / (1 + r[3] * 0.01)
          }
          this.geometry.attributes.position.needsUpdate = true
        }

        const update = () => {
          requestAnimationFrame(update)
          animateVertices(performance.now() * 0.001)
        }
        update()
      }

      hammingDistance(a, b) {
        let xor = a ^ b
        let d = 0
        while (xor > 0) {
          d += xor & 1
          xor >>= 1
        }
        return d
      }
    }
    new Hypercube()

    // ====================================================
    // 9. ライト & N体シミュレーション
    // ====================================================
    scene.add(new THREE.AmbientLight(0x404040))
    const pointLight = new THREE.PointLight(0xffffff, 1.2, 2000)
    pointLight.position.set(200, 200, 200)
    scene.add(pointLight)

    const bodyGroup = new THREE.Group()
    scene.add(bodyGroup)
    const bodies = []
    const N = 80
    const G = 0.1
    const softening = 20
    for (let i = 0; i < N; i++) {
      const mass = THREE.MathUtils.randFloat(5, 20)
      const r = Math.cbrt(mass) * 2
      const geometry = new THREE.SphereGeometry(r, 16, 16)
      const color = new THREE.Color().setHSL(Math.random(), 0.8, 0.5)
      const material = new THREE.MeshStandardMaterial({
        color,
        emissive: color.clone().multiplyScalar(0.3),
        roughness: 0.3,
        metalness: 0.1
      })
      const mesh = new THREE.Mesh(geometry, material)
      const position = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(800),
        THREE.MathUtils.randFloatSpread(800),
        THREE.MathUtils.randFloatSpread(800)
      )
      mesh.position.copy(position)
      bodyGroup.add(mesh)
      const velocity = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(1),
        THREE.MathUtils.randFloatSpread(1),
        THREE.MathUtils.randFloatSpread(1)
      )
      bodies.push({
        mesh,
        mass,
        position,
        velocity,
        acceleration: new THREE.Vector3()
      })
    }

    function updateNBody(deltaTime) {
      for (let i = 0; i < bodies.length; i++) {
        bodies[i].acceleration.set(0, 0, 0)
      }
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const A = bodies[i]
          const B = bodies[j]
          const diff = new THREE.Vector3().subVectors(B.position, A.position)
          const distSq = diff.lengthSq() + softening * softening
          const forceMag = (G * A.mass * B.mass) / distSq
          diff.normalize()
          const force = diff.multiplyScalar(forceMag)
          A.acceleration.add(force.clone().divideScalar(A.mass))
          B.acceleration.sub(force.clone().divideScalar(B.mass))
        }
      }
      for (let i = 0; i < bodies.length; i++) {
        bodies[i].velocity.add(bodies[i].acceleration.clone().multiplyScalar(deltaTime))
        bodies[i].position.add(bodies[i].velocity.clone().multiplyScalar(deltaTime))
        bodies[i].mesh.position.copy(bodies[i].position)
      }
    }

    // ====================================================
    // 10. アニメーションループ
    // ====================================================
    const clock = new THREE.Clock()

    function animate() {
      const time = timeRef.current
      timeRef.current += 0.005 * (isReducedMotion ? 0.3 : 1.0)
      
      // 描画のスキップ（さらなる最適化として、毎フレーム描画しない）
      if (isMobile && timeRef.current % 2 === 0) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      // 背景更新
      bgMaterial.uniforms.time.value = time

      // 各シェーダー更新
      chromaPass.uniforms.time.value = time
      nebulaUniforms.time.value = time
      enhancedLensDistortionPass.uniforms.time.value = time

      // 量子粒子更新
      quantumParticles.update(time)

      // 中央パルスオブジェクト更新
      centralMaterial.uniforms.time.value = time
      centralMaterial.uniforms.cameraPosition.value.copy(camera.position)

      // 螺旋アーム更新
      arms.forEach(arm => {
        const newPoints = generateSpiralPoints(time, arm.armIndex)
        arm.curve.points = newPoints
        const newTubeGeom = new THREE.TubeGeometry(arm.curve, 400, 2, 16, false)
        arm.mesh.geometry.dispose()
        arm.mesh.geometry = newTubeGeom
      })
      spiralGroup.rotation.z += 0.001

      // 星フィールド回転
      starField.rotation.y += 0.0005

      // N体シミュレーション更新
      updateNBody(clock.getDelta())

      // GodRays 用のシルエットレンダリング
      blackHoleOcclusion.position.copy(blackHole.position)
      renderer.setRenderTarget(occlusionRenderTarget)
      renderer.render(occlusionScene, camera)
      renderer.setRenderTarget(null)

      controls.update()
      renderer.autoClear = false
      renderer.clear()
      renderer.render(bgScene, bgCamera)
      composer.render()

      requestAnimationFrame(animate)
    }
    animate()

    // クリックで一時的なパルス効果
    window.addEventListener('click', () => {
      centralMaterial.uniforms.time.value += 5
      setTimeout(() => {
        centralMaterial.uniforms.time.value -= 5
      }, 300)
    })

    // ====================================================
    // リサイズ対応
    // ====================================================
    function onResize() {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      composer.setSize(w, h)
      occlusionRenderTarget.setSize(w, h)
      chromaPass.uniforms.resolution.value.set(w, h)
      nebulaUniforms.resolution.value.set(w, h)
      enhancedLensDistortionPass.uniforms.resolution.value.set(w, h)
      bgMaterial.uniforms.resolution.value.set(w, h)
    }
    window.addEventListener('resize', onResize)

    // ====================================================
    // クリーンアップ処理
    // ====================================================
    return () => {
      window.removeEventListener('resize', onResize)
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
      occlusionRenderTarget.dispose()
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 -z-10" />
}

export default CosmicDance