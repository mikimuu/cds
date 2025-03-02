import * as THREE from 'three';

const CosmicEffectShader = {
  uniforms: {
    'tDiffuse': { value: null },
    'time': { value: 0.0 },
    'intensity': { value: 0.5 },
    'starIntensity': { value: 0.8 },
    'nebulaIntensity': { value: 0.6 },
    'scrollY': { value: 0.0 },
    'resolution': { value: new THREE.Vector2() }
  },

  vertexShader: /* glsl */`
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float intensity;
    uniform float starIntensity;
    uniform float nebulaIntensity;
    uniform float scrollY;
    uniform vec2 resolution;
    varying vec2 vUv;
    
    // ランダム関数
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    // ノイズ関数
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      
      // 4つの角のランダム値
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      
      // スムーズ補間
      vec2 u = f * f * (3.0 - 2.0 * f);
      
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    
    // 星のきらめき効果
    float stars(vec2 uv, float threshold) {
      float n = random(uv);
      float stars = step(threshold, n) * n;
      
      // 時間によるきらめき
      float twinkle = sin(time * (n * 5.0) + n * 10.0) * 0.5 + 0.5;
      return stars * twinkle;
    }
    
    // 星雲効果
    vec3 nebula(vec2 uv) {
      // 複数のノイズレイヤーを合成
      float n1 = noise(uv * 3.0 + time * 0.05);
      float n2 = noise(uv * 6.0 - time * 0.03);
      float n3 = noise(uv * 9.0 + time * 0.02);
      
      float nebulaNoise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
      
      // スクロールに応じて色を変化
      float scrollFactor = scrollY * 0.0005;
      vec3 color1 = mix(vec3(0.1, 0.2, 0.5), vec3(0.5, 0.2, 0.5), scrollFactor);
      vec3 color2 = mix(vec3(0.2, 0.1, 0.3), vec3(0.1, 0.4, 0.6), scrollFactor);
      
      return mix(color1, color2, nebulaNoise) * nebulaNoise * nebulaIntensity;
    }
    
    // 光の歪み効果
    vec2 lightDistortion(vec2 uv) {
      float distortionStrength = 0.03 * intensity;
      vec2 center = vec2(0.5);
      vec2 delta = uv - center;
      float dist = length(delta);
      
      // スクロールに応じて歪みを変化
      float scrollDistortion = sin(scrollY * 0.001) * 0.01;
      
      // 時間に応じた脈動効果
      float pulsation = sin(time * 0.2) * 0.01;
      
      // 中心からの距離に基づく歪み
      float distortionFactor = distortionStrength * (1.0 - dist) + scrollDistortion + pulsation;
      
      return uv + delta * distortionFactor;
    }
    
    void main() {
      // 元の画像をサンプリング
      vec2 distortedUV = lightDistortion(vUv);
      vec4 originalColor = texture2D(tDiffuse, distortedUV);
      
      // 星のきらめき効果
      float starsEffect = stars(vUv * 100.0, 0.98) * starIntensity;
      
      // 星雲効果
      vec3 nebulaEffect = nebula(vUv);
      
      // 効果を合成
      vec3 finalColor = originalColor.rgb;
      
      // スクロールに応じて効果の強さを変化
      float effectStrength = intensity * (1.0 + sin(scrollY * 0.001) * 0.2);
      
      // 星と星雲を追加
      finalColor += starsEffect * vec3(0.8, 0.9, 1.0);
      finalColor += nebulaEffect * effectStrength;
      
      // 色調整
      finalColor = mix(originalColor.rgb, finalColor, intensity);
      
      // 光の強調
      float luminance = dot(finalColor, vec3(0.299, 0.587, 0.114));
      float glowFactor = smoothstep(0.6, 0.9, luminance) * 0.5 * intensity;
      finalColor += finalColor * glowFactor;
      
      gl_FragColor = vec4(finalColor, originalColor.a);
    }
  `
};

export { CosmicEffectShader }; 