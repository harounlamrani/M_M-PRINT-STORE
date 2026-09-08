'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Sparkle {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  lifespan: number;
}

interface SparklesTextProps {
  text: string;
  className?: string;
  colors?: { first: string; second: string };
  sparklesCount?: number;
}

/**
 * Magic UI "sparkles text" — tiny twinkling stars drift around the words.
 * Reduced motion renders plain static text.
 */
export function SparklesText({
  text,
  className,
  colors = { first: '#FF3B44', second: '#FFFFFF' },
  sparklesCount = 12,
}: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const reduceMotion = useReducedMotion();
  // Mounted guard: server + first client render must output the SAME markup.
  // Only after mount may we switch to the static variant, otherwise React
  // throws a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const showStatic = mounted && reduceMotion;

  useEffect(() => {
    if (showStatic) return;

    const generateStar = (): Sparkle => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      color: Math.random() > 0.5 ? colors.first : colors.second,
      delay: Math.random() * 2,
      scale: Math.random() * 0.9 + 0.3,
      lifespan: Math.random() * 10 + 5,
    });

    setSparkles(Array.from({ length: sparklesCount }, generateStar));

    const interval = setInterval(() => {
      setSparkles((current) =>
        current.map((star) =>
          star.lifespan <= 0 ? generateStar() : { ...star, lifespan: star.lifespan - 0.1 }
        )
      );
    }, 100);

    return () => clearInterval(interval);
  }, [colors.first, colors.second, sparklesCount, showStatic]);

  if (showStatic) {
    return <span className={className}>{text}</span>;
  }

  return (
    <div className={cn('relative', className)}>
      <span className="relative inline-block">
        {sparkles.map((star) => (
          <motion.span
            key={star.id}
            className="absolute inline-block"
            style={{ left: star.x, top: star.y }}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, star.scale, 0], rotate: [0, 180] }}
            transition={{
              duration: star.lifespan / 10,
              delay: star.delay,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            aria-hidden="true"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill={star.color} aria-hidden="true">
              <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
            </svg>
          </motion.span>
        ))}
        <span>{text}</span>
      </span>
    </div>
  );
}
