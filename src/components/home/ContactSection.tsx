'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, MessageSquare, Send } from 'lucide-react';
import { ScrollReveal, ScrollRevealItem } from '@/components/animations/ScrollReveal';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const contactInfo = [
  { icon: MapPin, label: 'Adresse', value: 'Alger, Algérie', href: '#' },
  { icon: Phone, label: 'Téléphone', value: '+213 5 53 38 56 74', href: 'tel:+213553385674' },
  { icon: Mail, label: 'Email', value: 'contact@mmprintstore.dz', href: 'mailto:contact@mmprintstore.dz' },
  { icon: MessageSquare, label: 'WhatsApp', value: 'Commander par WhatsApp', href: 'https://wa.me/213553385674' },
];

export function ContactSection() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formState.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formState.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) newErrors.email = 'Email invalide';
    if (!formState.subject.trim()) newErrors.subject = 'Le sujet est requis';
    if (!formState.message.trim()) newErrors.message = 'Le message est requis';
    else if (formState.message.trim().length < 10) newErrors.message = 'Le message doit contenir au moins 10 caractères';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
    setSubmitting(false);
    setFormState({ name: '', email: '', subject: '', message: '' });
    setErrors({});
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  return (
    <section className="section relative overflow-hidden pt-0 pb-0" aria-labelledby="contact-title" id="contact">
      {/* Top blend: black melts into white */}
      <div className="h-28 bg-gradient-to-b from-black to-transparent sm:h-40" aria-hidden="true" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-mm-red/5 blur-3xl opacity-30" aria-hidden="true" />

      <div className="relative z-10 container">
        <ScrollReveal>
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="lg:sticky lg:top-24">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mm-red/10 border border-mm-red/20 text-mm-red text-caption font-medium mb-6">
                Contact
              </span>
              <h2 className="section-title mb-6" id="contact-title">
                Une question ? On vous répond.
              </h2>
              <p className="text-body-lg text-mm-white/70 mb-10 max-w-xl">
                Pour toute demande — commande, collaboration, presse, retour — écrivez-nous.
                Réponse garantie sous 24h ouvrées.
              </p>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <ScrollRevealItem key={item.label} delay={index * 0.1} direction="left">
                    <motion.a
                      href={item.href}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-mm-black-soft border border-mm-gray-border transition-colors hover:border-mm-red/50"
                    >
                      <div className="p-3 rounded-lg bg-mm-gray">
                        <item.icon className="h-5 w-5 text-mm-red" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-caption text-mm-white/50 uppercase tracking-wider">{item.label}</p>
                        <p className="text-body-md font-medium text-mm-white hover:text-mm-red transition-colors">
                          {item.value}
                        </p>
                      </div>
                    </motion.a>
                  </ScrollRevealItem>
                ))}
              </div>
            </div>

            <ScrollRevealItem delay={0.2} direction="right">
              <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-mm-black-soft border border-mm-gray-border space-y-6" noValidate>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-mm-red/10 border border-mm-red/20 text-mm-red text-body-sm"
                    role="alert"
                  >
                    Message envoyé ! On vous répond vite.
                  </motion.div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  <Input
                    label="Nom complet"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="Votre nom"
                    required
                    autoComplete="name"
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="vous@email.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <Input
                  label="Sujet"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  error={errors.subject}
                  placeholder="Objet du message"
                  required
                />

                <Textarea
                  label="Message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  error={errors.message}
                  placeholder="Votre message..."
                  required
                  rows={5}
                />

                <Button type="submit" size="lg" className="w-full" loading={submitting}>
                  <Send className="h-5 w-5" aria-hidden="true" />
                  {submitting ? 'Envoi...' : 'Envoyer le message'}
                </Button>
              </form>
            </ScrollRevealItem>
          </div>
        </ScrollReveal>
      </div>

      {/* Bottom blend: white melts into the black footer below */}
      <div className="mt-14 h-28 bg-gradient-to-b from-transparent to-black sm:h-40 lg:mt-20" aria-hidden="true" />
    </section>
  );
}