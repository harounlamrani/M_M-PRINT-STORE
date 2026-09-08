'use client';

import { useEffect, useId, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MorphingTextProps {
  texts: string[];
  className?: string;
  /** Seconds spent morphing between words */
  morphTime?: number;
  /** Seconds each word stays readable */
  cooldownTime?: number;
}

/**
 * Magic UI "morphing text" — words melt into each other via a
 * gooey SVG-threshold filter. Sized by the parent via className
 * (height / width / text size / color are inherited by the words).
 */
export function MorphingText({
  texts,
  className,
  morphTime = 1.2,
  cooldownTime = 2.2,
}: MorphingTextProps) {
  // useId contains colons (":r0:") which break url(#...) references in some
  // browsers — strip them so the SVG filter always resolves.
  const filterId = `morph-${useId().replace(/:/g, '')}`;
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || texts.length < 2) return;
    let textIndex = texts.length - 1;
    let morph = 0;
    let cooldown = cooldownTime;
    let time = new Date();
    let animationFrameId = 0;

    const setMorph = (fraction: number) => {
      if (!text1Ref.current || !text2Ref.current) return;
      text2Ref.current.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      text2Ref.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
      const inv = 1 - fraction;
      text1Ref.current.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`;
      text1Ref.current.style.opacity = `${Math.pow(inv, 0.4) * 100}%`;
    };

    const doCooldown = () => {
      morph = 0;
      if (!text1Ref.current || !text2Ref.current) return;
      text2Ref.current.style.filter = '';
      text2Ref.current.style.opacity = '100%';
      text1Ref.current.style.filter = '';
      text1Ref.current.style.opacity = '0%';
    };

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;
      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }
      setMorph(fraction);
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;
      cooldown -= dt;
      if (cooldown <= 0) {
        if (shouldIncrementIndex) textIndex += 1;
        doMorph();
      } else {
        doCooldown();
      }
      if (text1Ref.current && text2Ref.current) {
        text1Ref.current.textContent = texts[textIndex % texts.length];
        text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
      }
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [texts, morphTime, cooldownTime, reduceMotion]);

  // Reduced motion (or a single word): static first word, no animation
  if (reduceMotion || texts.length < 2) {
    return (
      <span className={cn('inline-flex items-center whitespace-nowrap font-chillax font-bold leading-none', className)}>
        {texts[0]}
      </span>
    );
  }

  return (
    <span
      className={cn('relative block', className)}
      style={{ filter: `url(#${filterId}) blur(0.6px)` }}
      aria-hidden="true"
    >
      <span
        ref={text1Ref}
        className="absolute inset-0 flex items-center whitespace-nowrap font-chillax font-bold leading-none"
      />
      <span
        ref={text2Ref}
        className="absolute inset-0 flex items-center whitespace-nowrap font-chillax font-bold leading-none"
      />
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </span>
  );
}
