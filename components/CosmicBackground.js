'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass'
import { LensDistortionShader } from './customShaders/LensDistortionShader'
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry'
import { Delaunay } from 'd3-delaunay';
import { Noise } from 'noisejs';

const CosmicDance = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // ================================================
    // 1. シーン・カメラ・レンダラーの初期設定
    // ================================================
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000000, 0.0005)
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    )
    camera.position.set(0, 0, 800)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    containerRef.current.appendChild(renderer.domElement)

    // ================================================
    // 2. OrbitControls（ユーザー操作）
    // ================================================
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // ================================================
    // 3. ポストプロセッシング（各種エフェクト）
    // ================================================
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.8,
      0.5,
      0.85
    )
    composer.addPass(bloomPass)
    composer.addPass(new FilmPass(0.35, 0.75, 2048, false))
    const glitchPass = new GlitchPass()
    glitchPass.goWild = false
    composer.addPass(glitchPass)
    const rgbShiftPass = new ShaderPass(RGBShiftShader)
    rgbShiftPass.uniforms.amount.value = 0.0015
    composer.addPass(rgbShiftPass)
    const afterimagePass = new AfterimagePass(0.95)
    composer.addPass(afterimagePass)
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
    composer.addPass(new ShaderPass(CopyShader)) // 最終出力パス

      // ボリューメトリック・ネビュラ用カスタムシェーダーパス
    const nebulaUniforms = {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    };

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

        // ここではシンプルなボリューメトリックノイズの例（実際はシンプルックスノイズなどを導入すると良い）
        float random(vec2 p) {
        return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
        }

        float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
        }

        void main(){
        vec2 uv = vUv * 4.0;
        float n = noise(uv + time * 0.1);
        // 色は青みがかったネビュラ
        vec3 nebulaColor = mix(vec3(0.0, 0.0, 0.2), vec3(0.2, 0.1, 0.5), n);
        // 薄いボリューム感を出すためのアルファ
        gl_FragColor = vec4(nebulaColor, 0.25);
        }
    `
    };

    // このシェーダーパスを後から EffectComposer に追加
    const nebulaPass = new ShaderPass(nebulaShader);
    composer.addPass(nebulaPass);

    // LensDistortionShader の拡張（例として、星の近くの歪みをさらにダイナミックに変化させる）
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
        // レンズ中心からの距離に応じた歪み
        vec2 delta = uv - lensCenter;
        float dist = length(delta);
        // 時間とランダム性で歪み量が変化する
        float effect = distortion * (1.0 + 0.5 * sin(time + dist * 10.0));
        vec2 distortedUV = uv + normalize(delta) * effect * dist;
        vec4 color = texture2D(tDiffuse, distortedUV);
        gl_FragColor = color;
        }
    `
    };

    const enhancedLensDistortionPass = new ShaderPass(enhancedLensDistortionShader);
    composer.addPass(enhancedLensDistortionPass);

    // ================================================
    // 4. 背景レイヤー：全画面クアッドにカスタムシェーダー（位相フラクタル）
    // ================================================
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
        void main(){
          vec2 uv = gl_FragCoord.xy / resolution;
          uv = uv * 2.0 - 1.0;
          float angle = atan(uv.y, uv.x);
          float radius = length(uv);
          float swirl = sin(angle * 12.0 + time * 0.3) * 0.5 + 0.5;
          vec3 col = mix(vec3(0.0, 0.0, 0.1), vec3(0.2, 0.0, 0.3), swirl);
          col = mix(col, vec3(0.1, 0.0, 0.4), smoothstep(0.3, 0.6, radius));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide
    })
    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial)
    bgMesh.frustumCulled = false
    const bgScene = new THREE.Scene()
    bgScene.add(bgMesh)

    // ================================================
    // 4.5 量子もつれ粒子システム（新規追加）
    // ================================================
    class QuantumParticleSystem {
      constructor(count = 10000) {
        this.particles = new THREE.BufferGeometry()
        this.positions = new Float32Array(count * 3)
        this.velocities = new Float32Array(count * 3)
        this.entangledPairs = new Map()
        
        // 初期化
        for (let i = 0; i < count; i++) {
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(2 * Math.random() - 1)
          const r = 500 * Math.cbrt(Math.random())
          this.positions[i*3] = r * Math.sin(phi) * Math.cos(theta)
          this.positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
          this.positions[i*3+2] = r * Math.cos(phi)
          
          // 量子もつれペアの作成
          if (i % 2 === 0) {
            this.entangledPairs.set(i, i+1)
            this.entangledPairs.set(i+1, i)
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
        const positions = this.particles.attributes.position.array
        for (let i = 0; i < positions.length; i += 3) {
          // 量子もつれ効果
          const pairIndex = this.entangledPairs.get(i/3)
          if (pairIndex !== undefined) {
            positions[i] = positions[pairIndex*3] + Math.sin(time) * 5
            positions[i+1] = positions[pairIndex*3+1] + Math.cos(time) * 5
            positions[i+2] = positions[pairIndex*3+2] + Math.sin(time*0.5) * 5
          }
          
          // 確率的な位置跳躍
          if (Math.random() < 0.0001) {
            positions[i] += (Math.random() - 0.5) * 50
            positions[i+1] += (Math.random() - 0.5) * 50
            positions[i+2] += (Math.random() - 0.5) * 50
          }
        }
        this.particles.attributes.position.needsUpdate = true
      }
    }
    const quantumParticles = new QuantumParticleSystem(10000)

    // ================================================
    // 4.6 量子ニュートリノジェットシステム（新規追加）
    // ================================================
    class NeutrinoJetSystem {
      constructor() {
        this.particleCount = 5000;
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(this.particleCount * 3);
        this.velocities = new Float32Array(this.particleCount * 3);
        this.lifespans = new Float32Array(this.particleCount);
        
        // 初期位置と速度の設定
        for(let i = 0; i < this.particleCount; i++) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const speed = 0.5 + Math.random() * 2;
          this.velocities[i*3] = Math.sin(phi) * Math.cos(theta) * speed;
          this.velocities[i*3+1] = Math.sin(phi) * Math.sin(theta) * speed;
          this.velocities[i*3+2] = Math.cos(phi) * speed;
          this.lifespans[i] = Math.random() * 5;
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('velocity', new THREE.BufferAttribute(this.velocities, 3));
        this.geometry.setAttribute('lifespan', new THREE.BufferAttribute(this.lifespans, 1));

        this.material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
          },
          vertexShader: `
            attribute float lifespan;
            attribute vec3 velocity;
            varying vec3 vPosition;
            varying float vLife;
            uniform float time;
            
            void main() {
              vLife = lifespan;
              vec3 newPos = position + velocity * time;
              newPos += 0.1 * sin(time * 10.0 + position.x * 0.1) * 
                        cos(time * 8.0 + position.y * 0.1) * 
                        sin(time * 6.0 + position.z * 0.1);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
              gl_PointSize = 2.0 + 3.0 * sin(vLife * 3.0 - time);
              vPosition = newPos;
            }
          `,
          fragmentShader: `
            varying vec3 vPosition;
            varying float vLife;
            void main() {
              vec2 coord = gl_PointCoord - vec2(0.5);
              float len = length(coord);
              if(len > 0.5) discard;
              vec3 color = mix(vec3(0.8, 0.2, 0.4), vec3(0.2, 0.8, 1.0), 
                             smoothstep(0.0, 1.0, vLife));
              color *= 1.0 - smoothstep(0.3, 0.5, len * 2.0);
              color += 0.5 * sin(vPosition.x * 0.1 + vPosition.y * 0.2) + 0.5;
              gl_FragColor = vec4(color, 0.7 * (1.0 - len * 2.0));
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending
        });
        
        this.points = new THREE.Points(this.geometry, this.material);
        scene.add(this.points);
      }

      update(time) {
        const positions = this.geometry.attributes.position.array;
        const velocities = this.geometry.attributes.velocity.array;
        const lifespans = this.geometry.attributes.lifespan.array;
        
        for(let i = 0; i < this.particleCount; i++) {
          if(lifespans[i] < 0) {
            // パーティクルのリスポーン
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 50.0;
            positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i*3+2] = r * Math.cos(phi);
            lifespans[i] = 5.0;
          } else {
            lifespans[i] -= 0.016;
          }
        }
        
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.lifespan.needsUpdate = true;
        this.material.uniforms.time.value = time;
      }
    }
    const neutrinoJets = new NeutrinoJetSystem();

    // ================================================
    // 4.7 量子泡沫場（Quantum Foam Field）の実装
    // ================================================
    const quantumFoamGeometry = new THREE.PlaneGeometry(2000, 2000, 256, 256);
    const quantumFoamMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(2000, 2000) },
        noiseScale: { value: 0.5 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        #define PI 3.141592653589793
        uniform float time;
        uniform vec2 resolution;
        uniform float noiseScale;
        varying vec2 vUv;
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        void main() {
          vec2 uv = vUv * 10.0;
          float t = time * 0.5;
          
          // 多重ノイズレイヤー
          float n1 = noise(uv + vec2(t, 0.0));
          float n2 = noise(uv * 2.0 - vec2(t * 0.5, t));
          float n3 = noise(uv * 4.0 + vec2(t, -t * 0.3));
          
          // フラクタルノイズ
          float fractal = (n1 * 0.6 + n2 * 0.3 + n3 * 0.1);
          
          // カラーマッピング
          vec3 color = mix(
            vec3(0.1, 0.2, 0.4),
            vec3(0.4, 0.1, 0.3),
            smoothstep(0.3, 0.7, fractal)
          );
          
          // 量子トンネル効果の模擬
          float tunnel = sin(uv.x * PI * 2.0 + t) * cos(uv.y * PI * 2.0 - t);
          color += vec3(0.2, 0.3, 0.5) * pow(abs(tunnel), 3.0) * 0.5;
          
          // 時間発展による位相変化
          color = mix(color, color.grb, sin(t * 0.5) * 0.3);
          
          gl_FragColor = vec4(color * (0.8 + 0.2 * sin(t + uv.x * 5.0)), 0.15);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
    const quantumFoam = new THREE.Mesh(quantumFoamGeometry, quantumFoamMaterial);
    quantumFoam.rotation.x = Math.PI / 2;
    scene.add(quantumFoam);

    // ================================================
    // 4.8 ワームホールポータル（Wormhole Portal）の実装
    // ================================================
    class WormholePortal {
      constructor() {
        this.geometry = new THREE.TorusKnotGeometry(50, 15, 256, 32, 3, 4);
        this.material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            distortion: { value: 2.5 },
            glowIntensity: { value: 1.2 }
          },
          vertexShader: `
            uniform float time;
            varying vec3 vPosition;
            varying vec2 vUv;
            void main() {
              vUv = uv;
              vPosition = position;
              float distortion = sin(position.x * 0.1 + time) * 
                               cos(position.y * 0.1 + time) * 
                               sin(position.z * 0.1 + time) * 0.5;
              vec3 newPosition = position + normal * distortion;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
          `,
          fragmentShader: `
            uniform float time;
            uniform float distortion;
            uniform float glowIntensity;
            varying vec3 vPosition;
            varying vec2 vUv;
            
            void main() {
              vec2 uv = vUv * 2.0 - 1.0;
              float angle = atan(uv.y, uv.x);
              float radius = length(uv);
              
              // 渦巻き効果
              vec3 color1 = vec3(0.4, 0.1, 0.8);
              vec3 color2 = vec3(0.8, 0.2, 0.4);
              vec3 color = mix(color1, color2, 
                smoothstep(0.3, 0.7, sin(angle * 5.0 + time * 2.0 + radius * 10.0)));
              
              // 重力レンズ効果
              float lensing = 1.0 / (1.0 + radius * 20.0);
              color *= lensing * glowIntensity;
              
              // 時間的変調
              color = mix(color, color.grb, sin(time) * 0.3);
              
              // 中心部の明るさ
              color += vec3(1.0) * pow(1.0 - radius, 4.0) * 2.0;
              
              gl_FragColor = vec4(color, 0.9 * (1.0 - radius));
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, 0, -1000);
        scene.add(this.mesh);
        
        // 周囲の粒子エミッター
        this.initParticles();
      }

      initParticles() {
        this.particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(2000 * 3);
        for(let i = 0; i < 2000; i++) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = 50 + Math.random() * 20;
          positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
          positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
          positions[i*3+2] = r * Math.cos(phi);
        }
        this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        this.particleMaterial = new THREE.PointsMaterial({
          size: 1.5,
          color: 0x00ffff,
          transparent: true,
          blending: THREE.AdditiveBlending,
          opacity: 0.7
        });
        this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);
        this.mesh.add(this.particles);
      }

      update(time) {
        this.material.uniforms.time.value = time;
        this.mesh.rotation.x = time * 0.2;
        this.mesh.rotation.y = time * 0.3;
        this.particles.rotation.z = time * 0.5;
      }
    }
    const wormholePortal = new WormholePortal();


    // ================================================
    // 5. 中景レイヤー：宇宙塵・星々パーティクル
    // ================================================
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
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7
    })
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    // ================================================
    // 6. 前景レイヤー：パラメトリック多様体オブジェクト群
    // 6-1. 螺旋アーム群
    // ================================================
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
        metalness: 0.1,
      })
      const armMesh = new THREE.Mesh(tubeGeom, tubeMat)
      spiralGroup.add(armMesh)
      arms.push({ curve, mesh: armMesh, armIndex: i })
    }
    // 6-2. 中央パルスオブジェクト（フラクタリックな変形）
    const centralParametric = new ParametricGeometry((u, v, target) => {
      const theta = u * Math.PI * 2 - Math.PI
      const phi = v * Math.PI - Math.PI / 2
      const r = 20 + 5 * Math.sin(8 * theta + 3 * phi + performance.now() * 0.0005)
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
        varying vec3 vWorldPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform vec3 emissive;
        uniform vec3 cameraPosition;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main(){
          float pulse = sin(time * 2.0) * 0.5 + 0.5;
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
          vec3 finalColor = mix(color, emissive, pulse * 0.5 + fresnel * 0.3);
          finalColor += vec3(sin(time + vWorldPosition.x * 0.1),
                             sin(time + vWorldPosition.y * 0.1),
                             sin(time + vWorldPosition.z * 0.1)) * 0.2;
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      lights: false
    })
    const centralMesh = new THREE.Mesh(centralParametric, centralMaterial)
    scene.add(centralMesh)
    // 6-3. 数学的多様体オブジェクト群：トーラス、メビウス帯、4次元超立方体の投影
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
    // メビウスの帯
    const mobiusParametric = new ParametricGeometry((u, t, target) => {
      u = u * Math.PI * 2;
      t = t * 2 - 1;
      const a = 50;
      const x = (a + t * Math.cos(u / 2)) * Math.cos(u);
      const y = (a + t * Math.cos(u / 2)) * Math.sin(u);
      const z = t * Math.sin(u / 2);
      target.set(x, y, z);
    }, 100, 20);
    const mobiusMaterial = new THREE.MeshStandardMaterial({
      color: 0xff66cc,
      emissive: 0x330033,
      roughness: 0.5,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    const mobiusMesh = new THREE.Mesh(mobiusParametric, mobiusMaterial);
    mobiusMesh.position.set(300, -100, 100);
    scene.add(mobiusMesh);

    // 6-4. 4次元超立方体の3次元投影（ワイヤーフレーム表示）
    class Hypercube {
      constructor() {
        this.geometry = new THREE.BufferGeometry();
        this.vertices = new Float32Array(16 * 3);
        this.edges = [];
        const d4Vertices = [];
        for (let i = 0; i < 16; i++) {
          const x = (i & 1) ? 1 : -1;
          const y = (i & 2) ? 1 : -1;
          const z = (i & 4) ? 1 : -1;
          const w = (i & 8) ? 1 : -1;
          d4Vertices.push([x, y, z, w]);
        }
        this.updateProjection = (time) => {
          const angle = time * 0.2;
          const rot = [
            [Math.cos(angle), -Math.sin(angle), 0, 0],
            [Math.sin(angle),  Math.cos(angle), 0, 0],
            [0, 0, Math.cos(angle*0.7), -Math.sin(angle*0.7)],
            [0, 0, Math.sin(angle*0.7),  Math.cos(angle*0.7)]
          ];
          d4Vertices.forEach((v, i) => {
            const r = [
              rot[0][0]*v[0] + rot[0][1]*v[1] + rot[0][2]*v[2] + rot[0][3]*v[3],
              rot[1][0]*v[0] + rot[1][1]*v[1] + rot[1][2]*v[2] + rot[1][3]*v[3],
              rot[2][0]*v[0] + rot[2][1]*v[1] + rot[2][2]*v[2] + rot[2][3]*v[3],
              rot[3][0]*v[0] + rot[3][1]*v[1] + rot[3][2]*v[2] + rot[3][3]*v[3]
            ];
            const scale = 100;
            this.vertices[i*3] = r[0] * scale / (1 + r[3] * 0.01);
            this.vertices[i*3+1] = r[1] * scale / (1 + r[3] * 0.01);
            this.vertices[i*3+2] = r[2] * scale / (1 + r[3] * 0.01);
          });
          this.geometry.setAttribute('position', new THREE.BufferAttribute(this.vertices, 3));
        };
        const edges = [];
        for (let i = 0; i < 16; i++) {
          for (let j = i+1; j < 16; j++) {
            if (this.hammingDistance(i, j) === 1) {
              edges.push(i, j);
            }
          }
        }
        this.geometry.setIndex(edges);
        this.material = new THREE.LineBasicMaterial({
          color: 0x00ff88,
          transparent: true,
          opacity: 0.6
        });
        this.mesh = new THREE.LineSegments(this.geometry, this.material);
        scene.add(this.mesh);
      }
      hammingDistance(a, b) {
        let xor = a ^ b;
        let d = 0;
        while (xor > 0) {
          d += xor & 1;
          xor >>= 1;
        }
        return d;
      }
    }
    const hypercube = new Hypercube();

     // ================================================
    // 7. 遠方の銀河群（静かに瞬く星々）
    // ================================================
    const farStarCount = 10000
    const farStarPositions = new Float32Array(farStarCount * 3)
    for (let i = 0; i < farStarCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 2000 + Math.random() * 3000
      farStarPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      farStarPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      farStarPositions[i * 3 + 2] = radius * Math.cos(phi)
    }
    const farStarGeometry = new THREE.BufferGeometry()
    farStarGeometry.setAttribute('position', new THREE.BufferAttribute(farStarPositions, 3))
    const farStarMaterial = new THREE.PointsMaterial({
      size: 0.5,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      depthWrite: false
    })
    const farStarField = new THREE.Points(farStarGeometry, farStarMaterial)
    scene.add(farStarField)
    
    // ================================================
    // 7-2. ブラックホール・アクレション円盤（重力レンズ効果付き）
    // ================================================
    const blackHole = new THREE.Mesh(
      new THREE.SphereGeometry(15, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    blackHole.position.set(0, 0, -500);
    scene.add(blackHole);
    const accretionDiskMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        blackHolePos: { value: new THREE.Vector3() }
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 blackHolePos;
        uniform float time;
        varying vec3 vPosition;
        void main() {
          vec3 dir = normalize(vPosition - blackHolePos);
          float distortion = 1.0 / length(vPosition - blackHolePos);
          vec2 uv = gl_FragCoord.xy / vec2(800.0, 600.0);
          uv += dir.xy * distortion * 0.1;
          vec3 col = mix(vec3(0.8, 0.2, 0.4), vec3(0.2, 0.4, 0.8),
            sin(uv.x * 50.0 + time) * 0.5 + 0.5);
          col *= 1.0 - smoothstep(0.3, 0.5, distortion);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      transparent: true
    });
    const accretionDisk = new THREE.Mesh(
      new THREE.TorusGeometry(200, 50, 64, 64),
      accretionDiskMaterial
    );
    scene.add(accretionDisk);

    // ================================================
    // 8. N体シミュレーション（天体群の万有引力シミュレーション）
    // ================================================
    const bodies = [];
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);
    const N = 100;
    const G = 0.1;
    const softening = 20;
    for (let i = 0; i < N; i++) {
      const mass = THREE.MathUtils.randFloat(5, 20);
      const r = Math.cbrt(mass) * 2;
      const geometry = new THREE.SphereGeometry(r, 16, 16);
      const color = new THREE.Color().setHSL(Math.random(), 0.8, 0.5);
      const material = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color.clone().multiplyScalar(0.3),
        roughness: 0.3,
        metalness: 0.1
      });
      const mesh = new THREE.Mesh(geometry, material);
      const position = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(800),
        THREE.MathUtils.randFloatSpread(800),
        THREE.MathUtils.randFloatSpread(800)
      );
      mesh.position.copy(position);
      bodyGroup.add(mesh);
      const velocity = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(1),
        THREE.MathUtils.randFloatSpread(1),
        THREE.MathUtils.randFloatSpread(1)
      );
      bodies.push({
        mesh,
        mass,
        position,
        velocity,
        acceleration: new THREE.Vector3()
      });
    }

    // ================================================
    // 9. ライティング補強
    // ================================================
    const pointLight = new THREE.PointLight(0xffffff, 1.2, 1000);
    pointLight.position.set(200, 200, 200);
    scene.add(pointLight);
    scene.add(new THREE.AmbientLight(0x404040));

    // ================================================
    // 10. 物理シミュレーション更新関数
    // ================================================
    function updateSimulation(deltaTime) {
      for (let i = 0; i < bodies.length; i++) {
        bodies[i].acceleration.set(0, 0, 0);
      }
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const A = bodies[i];
          const B = bodies[j];
          const diff = new THREE.Vector3().subVectors(B.position, A.position);
          const distSq = diff.lengthSq() + softening * softening;
          const forceMag = (G * A.mass * B.mass) / distSq;
          diff.normalize();
          const force = diff.multiplyScalar(forceMag);
          A.acceleration.add(force.clone().divideScalar(A.mass));
          B.acceleration.sub(force.clone().divideScalar(B.mass));
        }
      }
      for (let i = 0; i < bodies.length; i++) {
        bodies[i].velocity.add(bodies[i].acceleration.clone().multiplyScalar(deltaTime));
        bodies[i].position.add(bodies[i].velocity.clone().multiplyScalar(deltaTime));
        bodies[i].mesh.position.copy(bodies[i].position);
      }
    }

    // ================================================
    // 11. ワープドライブ効果（超空間への瞬間移動風エフェクト）
    // ================================================
    const warpFieldGeometry = new THREE.IcosahedronGeometry(300, 4);
    const warpFieldMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        intensity: { value: 1.0 }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main(){
          vNormal = normal;
          float d = sin(position.x * 0.1 + time) * 0.5 + 0.5;
          vec3 newPos = position + normal * d * 10.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main(){
          vec3 col = mix(vec3(0.1, 0.2, 0.8), vec3(0.8, 0.1, 0.2), 
            dot(vNormal, vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5);
          gl_FragColor = vec4(col, 0.15);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    const warpField = new THREE.Mesh(warpFieldGeometry, warpFieldMaterial);
    scene.add(warpField);

    // ================================================
    // 12. アニメーションループ
    // ================================================
    const clock = new THREE.Clock();
    function animate() {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // 背景＆ポストシェーダー更新
      bgMaterial.uniforms.time.value = elapsed;
      chromaPass.uniforms.time.value = elapsed;

      // 螺旋アーム更新
      arms.forEach(arm => {
        const newPoints = generateSpiralPoints(elapsed, arm.armIndex);
        arm.curve.points = newPoints;
        const newTubeGeom = new THREE.TubeGeometry(arm.curve, 400, 2, 16, false);
        arm.mesh.geometry.dispose();
        arm.mesh.geometry = newTubeGeom;
      });
      spiralGroup.rotation.z += 0.001;

      // 中景・遠方パーティクルの回転
      particles.rotation.y += 0.0005;
      farStarField.rotation.y += 0.0001;

      // 中央パルスオブジェクト更新
      centralMaterial.uniforms.time.value = elapsed;
      centralMaterial.uniforms.cameraPosition.value.copy(camera.position);

      // N体シミュレーション更新
      updateSimulation(delta);

      // ワープフィールド更新
      warpFieldMaterial.uniforms.time.value = elapsed;
      warpField.scale.set(
        1 + Math.sin(elapsed) * 0.2,
        1 + Math.cos(elapsed * 0.8) * 0.2,
        1 + Math.sin(elapsed * 1.2) * 0.2
      );

      // ブラックホール周辺の重力レンズ効果更新
      accretionDisk.rotation.y += 0.01;
      accretionDiskMaterial.uniforms.time.value = elapsed;
      accretionDiskMaterial.uniforms.blackHolePos.value.copy(blackHole.position);
      blackHole.rotation.y += 0.002;
      
        // 新規要素の更新を追加
      quantumParticles.update(elapsed)
      hypercube.updateProjection(elapsed)
      
      neutrinoJets.update(elapsed);
      quantumFoamMaterial.uniforms.time.value = elapsed;
      wormholePortal.update(elapsed);

        // 量子泡沫場の動的変形
      quantumFoam.rotation.z += 0.0002;
      quantumFoam.position.y = Math.sin(elapsed) * 50;

      // 追加：ボリューメトリック・ネビュラ更新
      nebulaUniforms.time.value = elapsed;
    
      // 4次元超立方体の更新
      hypercube.updateProjection(elapsed);

      enhancedLensDistortionPass.uniforms.time.value = elapsed;


      controls.update();
      renderer.autoClear = false;
      renderer.clear();
      renderer.render(bgScene, camera);
      composer.render();
      requestAnimationFrame(animate);
    }
    animate();

      // ユーザーのクリックでシーン内のオブジェクトに一時的なパルス効果を与える例
    window.addEventListener('click', () => {
      // 例えば、中央オブジェクトのpulse値を一時的に大きくし、時間経過で元に戻す
        centralMaterial.uniforms.time.value += 10;
        setTimeout(() => {
             centralMaterial.uniforms.time.value -= 10;
        }, 300);
    });

    // ================================================
    // 13. ウィンドウリサイズ対応
    // ================================================
    const onWindowResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
      bgMaterial.uniforms.resolution.value.set(width, height);
      chromaPass.uniforms.resolution.value.set(width, height);
        nebulaUniforms.resolution.value.set(width, height);
    enhancedLensDistortionPass.uniforms.resolution.value.set(width, height);
    };
    window.addEventListener('resize', onWindowResize);

    // ================================================
    // 14. クリーンアップ処理
    // ================================================
    return () => {
      window.removeEventListener('resize', onWindowResize);
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(mat => mat.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      composer.dispose();
        
      // 新規要素のクリーンアップ
      neutrinoJets.geometry.dispose();
      neutrinoJets.material.dispose();
      quantumFoam.geometry.dispose();
      quantumFoam.material.dispose();
      wormholePortal.geometry.dispose();
      wormholePortal.material.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};

export default CosmicDance;