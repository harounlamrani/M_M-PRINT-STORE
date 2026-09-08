import type { Metadata } from 'next';
import { ClientEntry } from './client-entry';

export const metadata: Metadata = {
  title: 'M_M PRINT STORE — Streetwear Premium Algérie',
  description: 'Streetwear premium, impression locale, livraison partout en Algérie. T-Shirts, Ensembles, Hoodies, Joggers, Sac à dos. Paiement à la livraison.',
  alternates: {
    canonical: 'https://mmprintstore.dz',
  },
  openGraph: {
    title: 'M_M PRINT STORE — Streetwear Premium Algérie',
    description: 'Streetwear premium, impression locale, livraison partout en Algérie. Paiement à la livraison.',
    url: 'https://mmprintstore.dz',
    siteName: 'M_M PRINT STORE',
    locale: 'fr_DZ',
    type: 'website',
  },
  themeColor: '#E31B23',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="bg-mm-white text-mm-black antialiased">
        <ClientEntry />
        {children}
      </body>
    </html>
  );
}