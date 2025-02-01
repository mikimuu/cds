const LensDistortionShader = {
  uniforms: {
    'tDiffuse': { value: null },
    'distortion': { value: 0.15 },
    'time': { value: 0.0 }
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
    uniform float distortion;
    uniform float time;
    varying vec2 vUv;

    // Improved, physically-inspired radial distortion model.
    // Using a polynomial model: uv' = center + (uv-center) * (1 + k*r^2 + k^2*r^4)
    vec2 barrel(vec2 uv, float k) {
      vec2 center = vec2(0.5);
      vec2 delta = uv - center;
      float r2 = dot(delta, delta);
      float factor = 1.0 + k * r2 + k * k * r2 * r2;
      return center + delta * factor;
    }

    void main() {
      // Introduce dynamic variation in the distortion strength.
      float dynamicDistortion = distortion + sin(time * 0.5) * 0.05;
      
      // Apply improved radial distortion.
      vec2 distortedUV = barrel(vUv, dynamicDistortion);
      
      // Sample the texture with the distorted coordinates.
      vec4 texel = texture2D(tDiffuse, distortedUV);
      
      // Apply chromatic aberration using slightly offset distortion values.
      float aberration = 0.01;
      vec4 texelR = texture2D(tDiffuse, barrel(vUv, dynamicDistortion + aberration));
      vec4 texelB = texture2D(tDiffuse, barrel(vUv, dynamicDistortion - aberration));
      
      // Combine the color channels to simulate chromatic aberration.
      gl_FragColor = vec4(
        texelR.r,
        texel.g,
        texelB.b,
        texel.a
      );
      
      // Apply a subtle vignette effect based on distance from the center.
      float vignette = 1.0 - length(vUv - vec2(0.5)) * 0.5;
      gl_FragColor.rgb *= vignette;
    }
  `
};

export { LensDistortionShader };