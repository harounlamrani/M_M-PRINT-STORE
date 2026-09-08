'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ParticlesProps {
  className?: string;
  quantity?: number;
  /** Higher = less mouse influence */
  staticity?: number;
  /** Higher = snappier return to rest */
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

type Circle = {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  phase: number;
  speed: number;
  dx: number;
  dy: number;
  offsetX: number;
  offsetY: number;
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

const random = (min: number, max: number) => Math.random() * (max - min) + min;

/**
 * Magic UI "particles" — slow-drifting dot field on canvas that gently
 * parts around the cursor. Reduced motion renders one static frame.
 */
export function Particles({
  className,
  quantity = 80,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = '#0A0A0A',
  vx = 0,
  vy = 0,
}: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const [r, g, b] = hexToRgb(color);
    let w = 0;
    let h = 0;
    let raf = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const circles: Circle[] = Array.from({ length: quantity }, () => ({
      x: random(0, w),
      y: random(0, h),
      size: random(size * 0.5, size * 1.6),
      baseAlpha: random(0.25, 0.8),
      phase: random(0, Math.PI * 2),
      speed: random(0.3, 1),
      dx: random(-0.15, 0.15) + vx,
      dy: random(-0.15, 0.15) + vy,
      offsetX: 0,
      offsetY: 0,
    }));

    const draw = (c: Circle, t: number) => {
      const alpha = c.baseAlpha * (0.55 + 0.45 * Math.sin(t * 0.001 * c.speed + c.phase));
      ctx.beginPath();
      ctx.arc(c.x + c.offsetX, c.y + c.offsetY, c.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
      ctx.fill();
    };

    const step = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const rect = canvas.getBoundingClientRect();
      const mx = mouse.current.x - rect.left;
      const my = mouse.current.y - rect.top;

      for (const c of circles) {
        // drift + wrap
        c.x += c.dx;
        c.y += c.dy;
        if (c.x < -10) c.x = w + 10;
        if (c.x > w + 10) c.x = -10;
        if (c.y < -10) c.y = h + 10;
        if (c.y > h + 10) c.y = -10;

        // gentle parting around the cursor
        const dx = c.x - mx;
        const dy = c.y - my;
        const dist = Math.hypot(dx, dy);
        const radius = 130;
        let targetX = 0;
        let targetY = 0;
        if (dist < radius && dist > 0.01) {
          const force = (1 - dist / radius) * (140 / staticity);
          targetX = (dx / dist) * force * 10;
          targetY = (dy / dist) * force * 10;
        }
        const k = Math.min(1, ease / 100 + 0.04);
        c.offsetX += (targetX - c.offsetX) * k;
        c.offsetY += (targetY - c.offsetY) * k;

        draw(c, t);
      }
      raf = requestAnimationFrame(step);
    };

    if (reduceMotion) {
      ctx.clearRect(0, 0, w, h);
      circles.forEach((c) => draw(c, 0));
      return;
    }

    raf = requestAnimationFrame(step);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, quantity, staticity, ease, size, vx, vy, refresh, reduceMotion]);

  return (
    <div ref={containerRef} className={cn('pointer-events-none absolute inset-0', className)} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
