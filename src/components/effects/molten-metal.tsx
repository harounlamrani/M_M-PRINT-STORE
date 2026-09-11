'use client';

import { useEffect, useRef, useState } from 'react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type MoltenMetalColorMode = 'molten' | 'ember' | 'frost';

export interface MoltenMetalProps {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  scale?: number;
  detail?: number;
  glow?: number;
  coreSize?: number;
  swirl?: number;
  fold?: number;
  blackPoint?: number;
  brightness?: number;
  colorMode?: MoltenMetalColorMode;
  grain?: boolean;
  grainIntensity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  opacity?: number;
  backgroundColor?: string;
  lightMode?: boolean;
  className?: string;
}

type UniformValue = number | boolean | Float32Array;
type Uniforms = Record<string, { value: UniformValue }>;

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const colorModeToFloat = (mode: MoltenMetalColorMode): number => {
  if (mode === 'ember') return 1;
  if (mode === 'frost') return 2;
  return 0;
};

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uScale;
uniform float uDetail;
uniform float uGlow;
uniform float uCoreSize;
uniform float uSwirl;
uniform float uFold;
uniform float uBlackPoint;
uniform float uBrightness;
uniform float uColorMode;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform bool uEnableMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uBackgroundColor;
uniform bool uLightMode;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float time = iTime * uSpeed;
  vec2 p = uScale * ((gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y) - 0.5;

  vec2 drift = vec2(0.0);
  if (uEnableMouse) {
    drift = (uMouse - 0.5) * uMouseStrength * 2.0;
  }
  p += drift;

  vec2 i = p;
  float c = 0.0;
  float r = length(p + vec2(sin(time), sin(time * 0.3 + 5.0)) * 0.5);
  float d = length(p);
  float rot = d + time + p.x * uSwirl;

  float cosRot = cos(rot);
  mat2 warp = mat2(cos(rot - sin(time / 5.0)), sin(rot), -sin(cosRot - time), cosRot) * uFold;
  float glowCore = uGlow * uCoreSize;

  for (float n = 0.0; n < 8.0; n++) {
    if (n >= uDetail) break;
    p *= warp;
    float t = r - time / (n + 3.0);
    i -= p + vec2(cos(t - i.x - r) + sin(t + i.y), sin(t - i.y) + cos(t + i.x) + r);
    c += glowCore / length(vec2(sin(i.x + t), cos(i.y + t)));
  }

  c /= 6.0;

  float intensity = max(c - uBlackPoint, 0.0) * uBrightness;

  float g = clamp(intensity, 0.0, 1.0);

  float mid = 0.5;
  if (uColorMode > 1.5) {
    mid = 0.65;
  } else if (uColorMode > 0.5) {
    mid = 0.35;
  }

  vec3 col = mix(uColor1, uColor2, smoothstep(0.0, mid, g));
  col = mix(col, uColor3, smoothstep(mid, 1.0, g));

  float a = g;
  if (uGrain > 0.5) {
    float gr = hash(gl_FragCoord.xy + iTime);
    a += (gr - 0.5) * uGrainIntensity;
  }
  a = clamp(a, 0.0, 1.0) * uOpacity;
  if (uLightMode) {
    float signal = 1.0 - exp(-max(c, 0.0) * 6.5);
    float body = smoothstep(0.075, 0.68, signal);
    float ridge = smoothstep(0.42, 0.92, signal);

    vec3 lightCol = mix(uColor1, uColor2, smoothstep(0.08, 0.52, signal));
    lightCol = mix(lightCol, uColor3, smoothstep(0.52, 0.96, signal));
    lightCol = mix(lightCol, lightCol * 0.72, ridge * 0.24);

    float coverage = body * mix(0.2, 0.86, signal) * uOpacity;
    if (uGrain > 0.5) {
      float gr = hash(gl_FragCoord.xy + iTime);
      coverage += (gr - 0.5) * uGrainIntensity * body * 0.16;
    }
    fragColor = vec4(mix(uBackgroundColor, lightCol, clamp(coverage, 0.0, 0.92)), 1.0);
  } else {
    fragColor = vec4(col * a, a);
  }
}
`;

// Tracks live WebGL contexts so cleanup can release them deterministically.
const ctxMap = new WeakMap<HTMLCanvasElement, WebGL2RenderingContext | WebGLRenderingContext>();

export function MoltenMetal({
  color1 = '#5227FF',
  color2 = '#FF9FFC',
  color3 = '#FFFFFF',
  speed = 0.35,
  scale = 4,
  detail = 3,
  glow = 1.6,
  coreSize = 0.1,
  swirl = 1,
  fold = -0.2,
  blackPoint = 0.05,
  brightness = 1.3,
  colorMode = 'molten',
  grain = true,
  grainIntensity = 0.05,
  mouseInteraction = true,
  mouseStrength = 0.3,
  opacity = 1.0,
  backgroundColor = '#FFFFFF',
  lightMode = false,
  className = '',
}: MoltenMetalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const uniformsRef = useRef<Uniforms | null>(null);
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // False on the server and on the first client paint (mounted is still false
  // there), so the static container markup below is identical in both places
  // regardless of motion preference.
  const showStatic = mounted && reduceMotion === true;

  // Main GL effect: create the renderer/program/mesh, size via ResizeObserver,
  // drive the rAF loop (paused when hidden or offscreen), and tear everything
  // down on unmount. Prop updates flow through the sync effect below, so this
  // only re-runs when the reduced-motion preference changes.
  useEffect(() => {
    // Reduced motion: never initialize WebGL. Only the static container div
    // renders (the hero keeps its own red glow behind it).
    if (reduceMotion === true) return;

    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);
    ctxMap.set(canvas, gl);

    const uniforms: Uniforms = {
      iResolution: { value: new Float32Array([1, 1]) },
      iTime: { value: 0 },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uDetail: { value: detail },
      uGlow: { value: glow },
      uCoreSize: { value: coreSize },
      uSwirl: { value: swirl },
      uFold: { value: fold },
      uBlackPoint: { value: blackPoint },
      uBrightness: { value: brightness },
      uColorMode: { value: colorModeToFloat(colorMode) },
      uGrain: { value: grain ? 1 : 0 },
      uGrainIntensity: { value: grainIntensity },
      uOpacity: { value: opacity },
      uMouse: { value: new Float32Array([0.5, 0.5]) },
      uMouseStrength: { value: mouseStrength },
      uEnableMouse: { value: mouseInteraction },
      uColor1: { value: new Float32Array(hexToRgb(color1)) },
      uColor2: { value: new Float32Array(hexToRgb(color2)) },
      uColor3: { value: new Float32Array(hexToRgb(color3)) },
      uBackgroundColor: { value: new Float32Array(hexToRgb(backgroundColor)) },
      uLightMode: { value: lightMode },
    };

    const program = new Program(gl, { vertex, fragment, uniforms });
    uniformsRef.current = uniforms;
    const geometry = new Triangle(gl);
    const mesh = new Mesh(gl, { geometry, program });

    // Mouse is tracked on window (hero content overlays the canvas), then
    // converted to canvas-relative coords with Y flipped for the shader.
    const mouse = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.5 };

    const handleMouseMove = (event: MouseEvent): void => {
      const rect = canvas.getBoundingClientRect();
      target.x = (event.clientX - rect.left) / rect.width;
      target.y = 1.0 - (event.clientY - rect.top) / rect.height;
    };
    const handleMouseLeave = (): void => {
      target.x = 0.5;
      target.y = 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const setSize = (): void => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      renderer.setSize(width, height);
      const resolution = uniforms.iResolution.value;
      if (resolution instanceof Float32Array) {
        resolution[0] = gl.drawingBufferWidth;
        resolution[1] = gl.drawingBufferHeight;
      }
    };
    setSize();

    const resizeObserver: ResizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(container);

    let rafId = 0;
    let isVisible = true;
    let isInView = true;

    const tick = (time: number): void => {
      rafId = requestAnimationFrame(tick);
      if (!isVisible || !isInView) return;
      mouse.x += (target.x - mouse.x) * 0.05;
      mouse.y += (target.y - mouse.y) * 0.05;
      uniforms.iTime.value = time * 0.001;
      const mouseUniform = uniforms.uMouse.value;
      if (mouseUniform instanceof Float32Array) {
        mouseUniform[0] = mouse.x;
        mouseUniform[1] = mouse.y;
      }
      renderer.render({ scene: mesh });
    };
    rafId = requestAnimationFrame(tick);

    const intersectionObserver: IntersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const entry = entries[0];
        isInView = entry ? entry.isIntersecting : true;
      },
    );
    intersectionObserver.observe(container);

    const handleVisibilityChange = (): void => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      uniformsRef.current = null;
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
      const loseContextExtension = gl.getExtension('WEBGL_lose_context');
      if (loseContextExtension) {
        loseContextExtension.loseContext();
      }
      ctxMap.delete(canvas);
    };
    // Intentionally single-run (rebuilds GL only if reduced-motion flips);
    // live prop updates flow through the sync effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  // Prop sync: push updates into the live uniforms without rebuilding GL
  // resources. Skipped while static (reduced motion) or before init.
  useEffect(() => {
    const uniforms = uniformsRef.current;
    if (!uniforms || showStatic) return;
    uniforms.uSpeed.value = speed;
    uniforms.uScale.value = scale;
    uniforms.uDetail.value = detail;
    uniforms.uGlow.value = glow;
    uniforms.uCoreSize.value = coreSize;
    uniforms.uSwirl.value = swirl;
    uniforms.uFold.value = fold;
    uniforms.uBlackPoint.value = blackPoint;
    uniforms.uBrightness.value = brightness;
    uniforms.uColorMode.value = colorModeToFloat(colorMode);
    uniforms.uGrain.value = grain ? 1 : 0;
    uniforms.uGrainIntensity.value = grainIntensity;
    uniforms.uMouseStrength.value = mouseStrength;
    uniforms.uEnableMouse.value = mouseInteraction;
    uniforms.uOpacity.value = opacity;
    uniforms.uLightMode.value = lightMode;
    const color1Value = uniforms.uColor1.value;
    if (color1Value instanceof Float32Array) color1Value.set(hexToRgb(color1));
    const color2Value = uniforms.uColor2.value;
    if (color2Value instanceof Float32Array) color2Value.set(hexToRgb(color2));
    const color3Value = uniforms.uColor3.value;
    if (color3Value instanceof Float32Array) color3Value.set(hexToRgb(color3));
    const backgroundValue = uniforms.uBackgroundColor.value;
    if (backgroundValue instanceof Float32Array) backgroundValue.set(hexToRgb(backgroundColor));
  }, [
    showStatic,
    color1,
    color2,
    color3,
    speed,
    scale,
    detail,
    glow,
    coreSize,
    swirl,
    fold,
    blackPoint,
    brightness,
    colorMode,
    grain,
    grainIntensity,
    mouseInteraction,
    mouseStrength,
    opacity,
    backgroundColor,
    lightMode,
  ]);

  return (
    <div ref={containerRef} className={cn('relative h-full w-full overflow-hidden', className)} />
  );
}
