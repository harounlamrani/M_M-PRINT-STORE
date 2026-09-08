'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, MapPin, Truck, CheckCircle, ShoppingBag } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/store';
import { wilayas, getCommunesByWilaya, calculateDeliveryPrice, deliveryMethods } from '@/lib/delivery';
import { createWhatsAppOrder } from '@/lib/whatsapp';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface ProductOrderTransitionProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  { number: '1', label: 'Produit & Livraison', icon: ShoppingBag },
  { number: '2', label: 'Infos & Envoi', icon: CheckCircle },
];

export function ProductOrderTransition({ product, isOpen, onClose }: ProductOrderTransitionProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Form state — same interaction as before
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Delivery state — same select interaction
  const [selectedWilaya, setSelectedWilaya] = useState<number | ''>('');
  const [selectedCommune, setSelectedCommune] = useState<number | ''>('');
  const [deliveryMethod, setDeliveryMethod] = useState<'yalidine-bureau' | 'yalidine-domicile'>('yalidine-bureau');
  const [deliveryPrice, setDeliveryPrice] = useState(0);

  // Customer info
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copyFallback, setCopyFallback] = useState(false);

  const firstInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedVariant('');
      setQuantity(1);
      setSelectedOptions({});
      setSelectedWilaya('');
      setSelectedCommune('');
      setDeliveryMethod('yalidine-bureau');
      setDeliveryPrice(0);
      setCustomerInfo({ fullName: '', phone: '', address: '', notes: '' });
      setErrors({});
      setCopyFallback(false);

      if (product.variants.length > 0) {
        setSelectedVariant(product.variants[0].id);
        const attrs: Record<string, string> = {};
        Object.entries(product.variants[0].attributes).forEach(([key, value]) => {
          attrs[key] = value;
        });
        setSelectedOptions(attrs);
      }

      setTimeout(() => firstInputRef.current?.focus(), 300);
    }
  }, [isOpen, product]);

  useEffect(() => {
    if (selectedWilaya) {
      setDeliveryPrice(calculateDeliveryPrice(Number(selectedWilaya), deliveryMethod));
    } else {
      setDeliveryPrice(0);
    }
  }, [selectedWilaya, deliveryMethod]);

  const communes = selectedWilaya ? getCommunesByWilaya(Number(selectedWilaya)) : [];
  const currentWilaya = selectedWilaya ? wilayas.find(w => w.id === Number(selectedWilaya)) : undefined;

  const variant = product.variants.find(v => v.id === selectedVariant);
  const subtotal = (variant?.price || product.basePrice) * quantity;
  const total = subtotal + deliveryPrice;

  const scrollTop = () => {
    contentRef.current?.scrollTo({ top: 0 });
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedVariant) newErrors.variant = 'Sélectionnez une variante';
    if (quantity < 1) newErrors.quantity = 'Quantité invalide';
    if (!selectedWilaya) newErrors.wilaya = 'Sélectionnez votre wilaya';
    if (currentWilaya?.requiresCommune && !selectedCommune) newErrors.commune = 'Sélectionnez votre commune';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!customerInfo.fullName.trim()) newErrors.fullName = 'Le nom est requis';
    if (!customerInfo.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    else if (!/^[\d\s\-+()]{10,}$/.test(customerInfo.phone)) newErrors.phone = 'Numéro invalide';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(2);
      setIsTransitioning(false);
      scrollTop();
    }, 200);
  };

  const goPrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(1);
      setIsTransitioning(false);
      scrollTop();
    }, 200);
  };

  const handleOptionChange = (key: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [key]: value }));
    const matchingVariant = product.variants.find(v =>
      Object.entries({ ...selectedOptions, [key]: value }).every(([k, val]) => v.attributes[k] === val)
    );
    if (matchingVariant) {
      setSelectedVariant(matchingVariant.id);
    }
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomerInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = () => {
    if (!validateStep2()) return;

    const activeVariant = product.variants.find(v => v.id === selectedVariant) || product.variants[0];
    useCartStore.getState().addItem(product, activeVariant, quantity, selectedOptions);

    const orderSummary = {
      items: [{
        id: `temp-${Date.now()}`,
        productId: product.id,
        variantId: activeVariant.id,
        quantity,
        selectedOptions,
        snapshot: {
          name: product.name,
          image: activeVariant.image || product.images[0]?.src || '',
          price: activeVariant.price,
          variantName: activeVariant.name,
        },
      }],
      subtotal,
      deliveryPrice,
      total,
      deliveryOption: {
        method: deliveryMethod,
        wilayaId: Number(selectedWilaya),
        communeId: selectedCommune ? Number(selectedCommune) : undefined,
        price: deliveryPrice,
        estimatedDays: deliveryMethods[deliveryMethod].estimatedDays,
        label: deliveryMethods[deliveryMethod].label,
        description: deliveryMethods[deliveryMethod].description,
      },
      customerInfo: {
        fullName: customerInfo.fullName,
        phone: customerInfo.phone,
        wilayaId: Number(selectedWilaya),
        communeId: selectedCommune ? Number(selectedCommune) : undefined,
        deliveryMethod,
        address: customerInfo.address,
        notes: customerInfo.notes,
      },
    };

    const { message, url } = createWhatsAppOrder(orderSummary);
    const opened = typeof window !== 'undefined' ? window.open(url, '_blank', 'noopener') : null;
    if (!opened) {
      // Fallback: copy message so user can paste in WhatsApp manually
      try {
        navigator.clipboard?.writeText(message);
      } catch {
        // clipboard unavailable — user still sees confirmation state
      }
      setCopyFallback(true);
      return;
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 bg-mm-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full z-50 w-full max-w-2xl bg-mm-black-soft border-l border-mm-gray-border flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label={`Commander ${product.name}`}
          >
            {/* Header — 2-step progress */}
            <div className="flex items-center justify-between gap-3 p-4 border-b border-mm-gray-border">
              <div className="flex items-center gap-2" aria-label={`Étape ${currentStep} sur 2`}>
                {steps.map((step, index) => {
                  const active = currentStep === index + 1;
                  const done = currentStep > index + 1;
                  return (
                    <div key={step.number} className="flex items-center gap-2">
                      <span
                        className={cn(
                          'flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-caption font-bold',
                          done || active ? 'bg-mm-red text-white' : 'bg-mm-gray text-white/50'
                        )}
                      >
                        {done ? <CheckCircle className="h-4 w-4" /> : step.number}
                      </span>
                      <span className={cn('text-body-sm font-medium hidden sm:block', active || done ? 'text-white' : 'text-white/50')}>
                        {step.label}
                      </span>
                      {index < steps.length - 1 && <span className={cn('hidden sm:block w-8 h-0.5', done ? 'bg-mm-red' : 'bg-mm-gray')} />}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Fermer la commande"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Content */}
            <div ref={contentRef} className="flex-1 overflow-y-auto p-4 lg:p-6">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Product Card — compact, same info, no extra data */}
                    <div className="flex items-start gap-3 rounded-xl border border-mm-gray-border bg-mm-black p-3">
                      <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-mm-gray">
                        {product.images[0] && (
                          <Image
                            src={product.images[0].src}
                            alt={product.images[0].alt}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-body-md font-chillax font-bold text-white truncate">{product.name}</h3>
                        <p className="text-body-sm text-mm-red mt-0.5">{variant?.name || 'Sélectionnez une variante'}</p>
                        <p className="text-body-md font-bold text-white mt-1">
                          {formatPrice(variant?.price || product.basePrice)} DA
                        </p>
                      </div>
                    </div>

                    {/* Product options — same controls */}
                    {product.options.length > 0 && (
                      <div className="space-y-4">
                        {product.options.map((option) => (
                          <div key={option.name}>
                            <label className="block text-body-sm font-medium text-white/80 mb-2">
                              {option.label} <span className="text-mm-red">*</span>
                            </label>
                            {option.type === 'color' && option.values.length <= 8 ? (
                              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={option.label}>
                                {option.values.map((value) => {
                                  const isSelected = selectedOptions[option.name] === value;
                                  return (
                                    <button
                                      key={value}
                                      type="button"
                                      onClick={() => handleOptionChange(option.name, value)}
                                      role="radio"
                                      aria-checked={isSelected}
                                      aria-label={value}
                                      className={cn(
                                        'relative flex h-11 w-11 items-center justify-center rounded-lg border-2 transition-all',
                                        isSelected
                                          ? 'border-mm-red bg-mm-red/10'
                                          : 'border-mm-gray-border hover:border-mm-red/50'
                                      )}
                                    >
                                      <span
                                        className="h-6 w-6 rounded-md"
                                        style={{ backgroundColor: value.toLowerCase() }}
                                      />
                                      {isSelected && (
                                        <CheckCircle className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-mm-black-soft text-mm-red" aria-hidden="true" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <Select
                                placeholder={`Sélectionnez ${option.label.toLowerCase()}`}
                                value={selectedOptions[option.name] || ''}
                                onChange={(e) => handleOptionChange(option.name, e.target.value)}
                                options={option.values.map(v => ({ value: v, label: v }))}
                                className="w-full"
                                error={errors[option.name]}
                              />
                            )}
                          </div>
                        ))}
                        {errors.variant && <p className="text-body-sm text-mm-red" role="alert">{errors.variant}</p>}
                      </div>
                    )}

                    {/* Quantity — -/+ + typing */}
                    <div>
                      <label className="block text-body-sm font-medium text-white/80 mb-2">
                        Quantité <span className="text-mm-red">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 rounded-lg border border-mm-gray-border px-1">
                          <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="flex h-11 w-11 items-center justify-center rounded-md text-white/70 hover:text-white"
                            aria-label="Diminuer"
                          >
                            <span aria-hidden="true" className="text-xl leading-none">−</span>
                          </button>
                          <input
                            ref={firstInputRef}
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            min={1}
                            max={99}
                            aria-label="Quantité"
                            className="w-14 bg-transparent border-none text-center text-body-md text-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setQuantity(Math.min(99, quantity + 1))}
                            className="flex h-11 w-11 items-center justify-center rounded-md text-white/70 hover:text-white"
                            aria-label="Augmenter"
                          >
                            <span aria-hidden="true" className="text-xl leading-none">+</span>
                          </button>
                        </div>
                        {errors.quantity && <span className="text-body-sm text-mm-red" role="alert">{errors.quantity}</span>}
                      </div>
                    </div>

                    {/* Delivery — same selects */}
                    <div className="space-y-4 rounded-xl border border-mm-gray-border bg-mm-black p-4">
                      <h4 className="text-body-md font-bold text-white">Livraison</h4>
                      <Select
                        label="Wilaya"
                        placeholder="Sélectionnez votre wilaya"
                        value={selectedWilaya ? String(selectedWilaya) : ''}
                        onChange={(e) => {
                          setSelectedWilaya(e.target.value === '' ? '' : Number(e.target.value));
                          setSelectedCommune('');
                          if (errors.wilaya) setErrors(prev => ({ ...prev, wilaya: '' }));
                        }}
                        options={wilayas.map(w => ({ value: String(w.id), label: w.name }))}
                        className="w-full"
                        error={errors.wilaya}
                      />

                      {currentWilaya?.requiresCommune && (
                        <Select
                          label="Commune"
                          placeholder="Sélectionnez votre commune"
                          value={selectedCommune ? String(selectedCommune) : ''}
                          onChange={(e) => {
                            setSelectedCommune(e.target.value === '' ? '' : Number(e.target.value));
                            if (errors.commune) setErrors(prev => ({ ...prev, commune: '' }));
                          }}
                          options={communes.map(c => ({ value: String(c.id), label: c.name }))}
                          disabled={communes.length === 0}
                          className="w-full"
                          error={errors.commune}
                        />
                      )}

                      <div className="grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod('yalidine-bureau')}
                          aria-pressed={deliveryMethod === 'yalidine-bureau'}
                          className={cn(
                            'rounded-xl border-2 p-3 text-left transition-all',
                            deliveryMethod === 'yalidine-bureau'
                              ? 'border-mm-red bg-mm-red/10'
                              : 'border-mm-gray-border hover:border-mm-red/50'
                          )}
                        >
                          <span className="flex items-center gap-2 font-medium text-white">
                            <MapPin className="h-5 w-5 text-mm-red" aria-hidden="true" />
                            Bureau
                          </span>
                          <span className="mt-1 block text-body-sm font-bold text-mm-red">
                            {selectedWilaya ? `${calculateDeliveryPrice(Number(selectedWilaya), 'yalidine-bureau')} DA` : 'Selon wilaya'}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod('yalidine-domicile')}
                          aria-pressed={deliveryMethod === 'yalidine-domicile'}
                          className={cn(
                            'rounded-xl border-2 p-3 text-left transition-all',
                            deliveryMethod === 'yalidine-domicile'
                              ? 'border-mm-red bg-mm-red/10'
                              : 'border-mm-gray-border hover:border-mm-red/50'
                          )}
                        >
                          <span className="flex items-center gap-2 font-medium text-white">
                            <Truck className="h-5 w-5 text-mm-red" aria-hidden="true" />
                            Domicile
                          </span>
                          <span className="mt-1 block text-body-sm font-bold text-mm-red">
                            {selectedWilaya ? `${calculateDeliveryPrice(Number(selectedWilaya), 'yalidine-domicile')} DA` : 'Selon wilaya'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-mm-gray-border bg-mm-black p-4">
                      <div className="flex justify-between text-body-md">
                        <span className="text-white/70">Sous-total</span>
                        <span className="font-medium text-white">{formatPrice(subtotal)} DA</span>
                      </div>
                      <div className="mt-1 flex justify-between text-body-md">
                        <span className="text-white/70">Livraison</span>
                        <span className="font-medium text-white">{selectedWilaya ? `${formatPrice(deliveryPrice)} DA` : '—'}</span>
                      </div>
                    </div>

                    <Button size="lg" className="w-full" onClick={goNext} disabled={isTransitioning}>
                      <span>Continuer</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Customer information */}
                    <div className="space-y-4">
                      <h4 className="text-body-md font-bold text-white">Vos informations</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                          label="Nom complet"
                          name="fullName"
                          value={customerInfo.fullName}
                          onChange={handleCustomerChange}
                          error={errors.fullName}
                          placeholder="Votre nom complet"
                          required
                          autoComplete="name"
                        />
                        <Input
                          label="Téléphone"
                          name="phone"
                          type="tel"
                          value={customerInfo.phone}
                          onChange={handleCustomerChange}
                          error={errors.phone}
                          placeholder="0553 38 56 74"
                          required
                          autoComplete="tel"
                        />
                      </div>
                      <Textarea
                        label="Adresse complète (optionnel)"
                        name="address"
                        value={customerInfo.address}
                        onChange={handleCustomerChange}
                        placeholder="Rue, quartier, point de repère..."
                        rows={2}
                      />
                      <Textarea
                        label="Notes (optionnel)"
                        name="notes"
                        value={customerInfo.notes}
                        onChange={handleCustomerChange}
                        placeholder="Instructions de livraison..."
                        rows={2}
                      />
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-3 rounded-xl border border-mm-gray-border bg-mm-black p-4">
                      <h4 className="text-body-md font-bold text-white">Résumé</h4>
                      <div className="flex justify-between text-body-sm">
                        <span className="text-white/70">{product.name} × {quantity}</span>
                        <span className="text-white">{formatPrice(subtotal)} DA</span>
                      </div>
                      <div className="flex justify-between text-body-sm">
                        <span className="text-white/70">Livraison ({deliveryMethods[deliveryMethod].label})</span>
                        <span className="text-white">{formatPrice(deliveryPrice)} DA</span>
                      </div>
                      <div className="flex justify-between border-t border-mm-gray-border pt-2 text-body-md font-bold">
                        <span className="text-white">Total</span>
                        <span className="text-mm-red">{formatPrice(total)} DA</span>
                      </div>
                      <p className="text-body-sm text-white/50">Paiement à la livraison — sans carte bancaire.</p>
                    </div>

                    {copyFallback && (
                      <p className="rounded-lg border border-mm-red/30 bg-mm-red/10 p-3 text-body-sm text-mm-red" role="alert">
                        WhatsApp bloqué par le navigateur — message copié, collez-le dans WhatsApp au +213 553 38 56 74.
                      </p>
                    )}

                    <div className="flex gap-3">
                      <Button variant="outline" size="lg" onClick={goPrev} disabled={isTransitioning}>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        Retour
                      </Button>
                      <Button size="lg" className="flex-1" onClick={handleSubmit}>
                        <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                        Envoyer la commande
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
