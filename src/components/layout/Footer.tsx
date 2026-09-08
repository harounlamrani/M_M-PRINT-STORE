'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Truck, Shield, RotateCcw, Mail, Facebook, Instagram, Youtube, MapPin, Phone, MessageSquare, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const footerLinks = {
  shop: [
    { label: 'T-Shirts', href: '#tshirts' },
    { label: 'Ensembles', href: '#ensembles' },
    { label: 'Hoodies', href: '#hoodies' },
    { label: 'Joggers', href: '#joggers' },
    { label: 'Sac à dos', href: '#sac-a-dos' },
  ],
  help: [
    { label: 'Livraison', href: '#delivery' },
    { label: 'Contact', href: '#contact' },
  ],
};

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
  { label: 'Email', href: 'mailto:contact@mmprintstore.dz', icon: Mail },
];

const contactRows = [
  { icon: MapPin, label: 'Alger, Algérie', href: undefined },
  { icon: Phone, label: '+213 553 38 56 74', href: 'tel:+213553385674' },
  { icon: Mail, label: 'contact@mmprintstore.dz', href: 'mailto:contact@mmprintstore.dz' },
  { icon: MessageSquare, label: 'WhatsApp', href: 'https://wa.me/213553385674' },
];

const benefits = [
  { icon: Truck, label: 'Livraison 58 wilayas', description: 'Yalidine Bureau & Domicile' },
  { icon: Shield, label: 'Paiement à la livraison', description: 'Payez à la réception' },
  { icon: RotateCcw, label: 'Retour 14 jours', description: 'Échange ou remboursement' },
  { icon: Mail, label: 'Support 7j/7', description: 'Réponse sous 24h' },
];

function FooterGroup({ title, links, open, onToggle, id }: { title: string; links: { label: string; href: string }[]; open: boolean; onToggle: () => void; id: string }) {
  return (
    <div className="border-b border-white/10 lg:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between py-4 text-left lg:hidden"
      >
        <span className="text-body-md font-bold text-white">{title}</span>
        <ChevronDown className={cn('h-5 w-5 text-white/70 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      <h3 className="hidden text-body-md font-bold text-white lg:mb-4 lg:block">{title}</h3>
      <ul id={id} role="list" className={cn('space-y-3 pb-4 lg:pb-0', !open && 'hidden lg:block')}>
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-body-md text-white/70 hover:text-white transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (key: string) => setOpen((prev) => (prev === key ? null : key));

  return (
    <footer className="bg-mm-black text-white" role="contentinfo">
      <div className="container py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-8">
          <div className="space-y-5 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-1 text-display-sm font-chillax font-bold tracking-tight text-white" aria-label="M_M PRINT STORE - Accueil">
              <span>M_M</span>
              <span className="text-mm-red">PRINT</span>
            </Link>
            <p className="text-body-md text-white/60 max-w-xs">
              Streetwear premium, impression locale, livraison partout en Algérie.
            </p>
            <ul className="space-y-3" aria-label="Contact">
              {contactRows.map((row) => (
                <li key={row.label} className="flex items-center gap-3 text-body-md text-white/70">
                  <row.icon className="h-4 w-4 shrink-0 text-mm-red" aria-hidden="true" />
                  {row.href ? (
                    <a href={row.href} className="hover:text-white transition-colors" target={row.href.startsWith('http') ? '_blank' : undefined} rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                      {row.label}
                    </a>
                  ) : (
                    <span>{row.label}</span>
                  )}
                </li>
              ))}
            </ul>
            <ul className="space-y-2 pt-1" aria-label="Réseaux sociaux">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="inline-flex items-center gap-3 text-body-md text-white/70 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="h-4 w-4 text-mm-red" aria-hidden="true" />
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <FooterGroup title="Boutique" links={footerLinks.shop} id="footer-shop" open={open === 'shop'} onToggle={() => toggle('shop')} />
              <FooterGroup title="Aide" links={footerLinks.help} id="footer-help" open={open === 'help'} onToggle={() => toggle('help')} />
            </div>

            <div className="mt-10 grid gap-5 border-t border-white/10 pt-8 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit.label} className="flex items-start gap-3">
                  <span className="rounded-lg bg-white/5 p-2">
                    <benefit.icon className="h-5 w-5 text-mm-red" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-body-md font-medium text-white">{benefit.label}</span>
                    <span className="block text-body-sm text-white/50">{benefit.description}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-body-sm text-white/50">
            © {new Date().getFullYear()} M_M PRINT STORE. Tous droits réservés.
          </p>
          <p className="text-body-sm text-white/50">Alger, Algérie</p>
        </div>
      </div>
    </footer>
  );
}
