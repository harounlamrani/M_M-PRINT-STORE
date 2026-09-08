'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, Shield, Clock, CheckCircle, Search } from 'lucide-react';
import { ScrollReveal, ScrollRevealItem } from '@/components/animations/ScrollReveal';
import { wilayas, getCommunesByWilaya, calculateDeliveryPrice, deliveryMethods } from '@/lib/delivery';
import { Input, Select } from '@/components/ui/Input';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { cn } from '@/lib/utils';

const steps = [
  { number: '01', title: 'Commandez', description: 'Choisissez vos produits, validez sur WhatsApp.' },
  { number: '02', title: 'Préparation', description: 'Votre commande est emballée sous 24h.' },
  { number: '03', title: 'Expédition', description: 'Yalidine récupère et scanne votre colis.' },
  { number: '04', title: 'Livraison', description: 'Recevez, payez, profitez.' },
];

export function DeliverySection() {
  const [selectedWilaya, setSelectedWilaya] = useState<number | ''>('');
  const [selectedCommune, setSelectedCommune] = useState<number | ''>('');
  const [deliveryMethod, setDeliveryMethod] = useState<'yalidine-bureau' | 'yalidine-domicile'>('yalidine-bureau');
  const [price, setPrice] = useState(0);

  const communes = selectedWilaya ? getCommunesByWilaya(Number(selectedWilaya)) : [];
  const currentWilaya = selectedWilaya ? wilayas.find(w => w.id === Number(selectedWilaya)) : undefined;

  const handleWilayaChange = (id: string) => {
    setSelectedWilaya(id === '' ? '' : Number(id));
    setSelectedCommune('');
  };

  const handleCommuneChange = (id: string) => {
    setSelectedCommune(id === '' ? '' : Number(id));
  };

  const handleMethodChange = (method: 'yalidine-bureau' | 'yalidine-domicile') => {
    setDeliveryMethod(method);
    if (selectedWilaya) {
      setPrice(calculateDeliveryPrice(Number(selectedWilaya), method));
    }
  };

  const handleCalculate = () => {
    if (selectedWilaya) {
      setPrice(calculateDeliveryPrice(Number(selectedWilaya), deliveryMethod));
    }
  };

  return (
    <section className="section section-dark relative overflow-hidden" aria-labelledby="delivery-title" id="delivery">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-mm-red/20 blur-3xl opacity-50" aria-hidden="true" />

      <div className="relative z-10 container">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mm-red/20 border border-mm-red/30 text-mm-red text-caption font-medium mb-6">
              Livraison
            </span>
            <h2 className="section-title mb-6 text-white" id="delivery-title">
              Partout en Algérie, à votre porte ou en point relais.
            </h2>
            <p className="text-body-lg text-zinc-400">
              58 wilayas desservies par Yalidine. Choisissez bureau ou domicile selon votre besoin.
              Paiement à la livraison disponible.
            </p>
          </div>
        </ScrollReveal>

        {/* Wilaya Search / Price Calculator */}
        <ScrollReveal>
          <div className="max-w-2xl mx-auto mb-16">
            <div className="p-8 rounded-2xl bg-black border border-gray-700">
              <SparklesText
                text="Calculez votre livraison"
                className="text-heading-md font-chillax font-bold text-white mb-6 text-center"
                colors={{ first: '#FF3B44', second: '#FFFFFF' }}
                sparklesCount={12}
              />

              <div className="space-y-4 mb-6">
                <Select
                  label="Wilaya"
                  placeholder="Sélectionnez votre wilaya"
                  value={selectedWilaya ? String(selectedWilaya) : ''}
                  onChange={(e) => handleWilayaChange(e.target.value)}
                  options={wilayas.map(w => ({ value: String(w.id), label: w.name }))}
                  className="w-full"
                />

                {currentWilaya?.requiresCommune && (
                  <Select
                    label="Commune"
                    placeholder="Sélectionnez votre commune"
                    value={selectedCommune ? String(selectedCommune) : ''}
                    onChange={(e) => handleCommuneChange(e.target.value)}
                    options={communes.map(c => ({ value: String(c.id), label: c.name }))}
                    disabled={communes.length === 0}
                    className="w-full"
                  />
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer
                    bg-black border-gray-700 hover:border-mm-red/50
                    data-[selected=true]:border-mm-red data-[selected=true]:bg-mm-red/10"
                    onClick={() => handleMethodChange('yalidine-bureau')}
                  >
                    <input
                      type="radio"
                      name="delivery-method"
                      value="yalidine-bureau"
                      checked={deliveryMethod === 'yalidine-bureau'}
                      onChange={() => handleMethodChange('yalidine-bureau')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-mm-red/10">
                        <MapPin className="h-6 w-6 text-mm-red" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Yalidine Bureau</p>
                        <p className="text-sm text-zinc-400">Retrait au point relais</p>
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-sm text-zinc-400">Prix</p>
                      <p className="font-bold text-mm-red">
                        {selectedWilaya ? `${calculateDeliveryPrice(Number(selectedWilaya), 'yalidine-bureau')} DA` : 'Selon wilaya'}
                      </p>
                    </div>
                  </label>

                  <label className="relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer
                    bg-black border-gray-700 hover:border-mm-red/50
                    data-[selected=true]:border-mm-red data-[selected=true]:bg-mm-red/10"
                    onClick={() => handleMethodChange('yalidine-domicile')}
                  >
                    <input
                      type="radio"
                      name="delivery-method"
                      value="yalidine-domicile"
                      checked={deliveryMethod === 'yalidine-domicile'}
                      onChange={() => handleMethodChange('yalidine-domicile')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-mm-red/10">
                        <Truck className="h-6 w-6 text-mm-red" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Yalidine Domicile</p>
                        <p className="text-sm text-zinc-400">Livraison à domicile</p>
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-sm text-zinc-400">Prix</p>
                      <p className="font-bold text-mm-red">
                        {selectedWilaya ? `${calculateDeliveryPrice(Number(selectedWilaya), 'yalidine-domicile')} DA` : 'Selon wilaya'}
                      </p>
                    </div>
                  </label>
                </div>

                {selectedWilaya && (
                  <div className="p-4 rounded-xl bg-mm-red/10 border border-mm-red/20 text-center">
                    <p className="font-bold text-mm-red text-lg">
                      Livraison {deliveryMethods[deliveryMethod].label} : {price} DA
                    </p>
                    <p className="text-sm text-zinc-400 mt-1">
                      {currentWilaya?.name} {selectedCommune && communes.find(c => c.id === Number(selectedCommune))?.name ? `— ${communes.find(c => c.id === Number(selectedCommune))?.name}` : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Process Steps */}
        <ScrollReveal>
          <div className="relative mb-16">
            <h3 className="section-title text-center mb-12 text-white">Comment ça marche</h3>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px bg-gray-700 hidden lg:block" aria-hidden="true" />
            <div className="grid gap-8 lg:grid-cols-4 relative">
              {steps.map((step, index) => (
                <ScrollRevealItem key={step.number} delay={index * 0.1} direction="up">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="relative text-center p-6"
                  >
                    <div className="relative z-10 mb-4">
                      <span className="text-caption text-mm-red font-mono font-bold">{step.number}</span>
                      <div className="mt-3 w-16 h-16 mx-auto rounded-full bg-black border border-gray-700 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-mm-red flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-white" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-heading-sm font-chillax font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-body-sm text-zinc-400">{step.description}</p>
                  </motion.div>
                </ScrollRevealItem>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* COD Badge */}
        <ScrollReveal>
          <div className="p-8 rounded-2xl bg-black border border-gray-700 text-center">
            <div className="flex items-center justify-center gap-3 text-mm-red mb-4">
              <Shield className="h-6 w-6" aria-hidden="true" />
              <h3 className="text-heading-md font-chillax font-bold text-white">Paiement à la livraison</h3>
            </div>
            <p className="text-body-lg text-zinc-400 max-w-2xl mx-auto">
              Aucun paiement en ligne requis. Vous payez quand le livreur vous remet le colis.
              Simple, sûr, sans carte bancaire.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}