'use client';

import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';
import { Particles } from '@/components/magicui/particles';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white" aria-labelledby="hero-title">
      <div className="absolute inset-0 z-0">
        <Particles className="absolute inset-0" quantity={70} size={0.5} color="#0A0A0A" staticity={30} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-mm-red/10 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-mm-red/5 blur-3xl opacity-30 animate-pulse-slow" />
      </div>

      <div className="relative z-10 container px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl text-center"
        >
          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
            className="text-display-xl font-chillax font-bold tracking-tight text-mm-black mb-6"
          >
            M_M PRINT
            <br />
            <span className="text-mm-red">STORE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
            className="text-body-lg text-gray-600 max-w-2xl mx-auto mb-10"
          >
            Streetwear premium, impression locale, livraison partout en Algérie.
            Des pièces uniques pour ceux qui osent.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#tshirts" className="w-full sm:w-auto">
              <InteractiveHoverButton className="w-full sm:w-auto">
                Découvrir la collection
              </InteractiveHoverButton>
            </a>
            <a href="#ensembles">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Nos catégories
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-body-sm text-gray-500"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-mm-red" aria-hidden="true" />
              Livraison 58 wilayas
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 text-mm-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Paiement à la livraison
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 text-mm-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retour 14 jours
            </span>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-slow"
        aria-hidden="true"
      >
        <svg className="h-6 w-6 text-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}