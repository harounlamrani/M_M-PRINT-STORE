import type { OrderSummary, DeliveryOption, CustomerInfo, CartItem } from './types';
import { deliveryMethods } from './delivery';

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateWhatsAppMessage(order: OrderSummary): string {
  const { items, subtotal, deliveryPrice, total, deliveryOption, customerInfo } = order;

  const lines: string[] = [];

  lines.push(`Bonjour je veux faire une commande d’un produit chez M_M PRINT STORE.`);
  lines.push('');
  lines.push(`👤 *Client :* ${customerInfo.fullName}`);
  lines.push(`📞 *Téléphone :* ${customerInfo.phone}`);
  lines.push('');

  lines.push(`📦 *Produits :*`);
  items.forEach((item, index) => {
    const itemTotal = item.snapshot.price * item.quantity;
    lines.push(`${index + 1}. ${item.snapshot.name}`);
    lines.push(`   • Variante : ${item.snapshot.variantName}`);
    lines.push(`   • Quantité : ${item.quantity}`);
    lines.push(`   • Prix unitaire : ${formatPrice(item.snapshot.price)}`);
    lines.push(`   • Sous-total : ${formatPrice(itemTotal)}`);
    if (Object.keys(item.selectedOptions).length > 0) {
      const opts = Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(', ');
      lines.push(`   • Options : ${opts}`);
    }
    lines.push('');
  });

  lines.push(`💰 *Sous-total produits :* ${formatPrice(subtotal)}`);
  lines.push(`🚚 *Livraison :* ${deliveryOption.label} (${deliveryOption.estimatedDays})`);
  lines.push(`   Wilaya : ${getWilayaName(customerInfo.wilayaId)}`);
  if (customerInfo.communeId) {
    lines.push(`   Commune : ${getCommuneName(customerInfo.wilayaId, customerInfo.communeId)}`);
  }
  if (customerInfo.address) {
    lines.push(`   Adresse : ${customerInfo.address}`);
  }
  lines.push(`   Prix livraison : ${formatPrice(deliveryPrice)}`);
  lines.push('');

  lines.push(`💳 *TOTAL À PAYER :* ${formatPrice(total)}`);
  lines.push('');

  if (customerInfo.notes) {
    lines.push(`📝 *Notes :* ${customerInfo.notes}`);
    lines.push('');
  }

  lines.push(`Merci de confirmer la commande.`);
  lines.push(`M_M PRINT STORE`);

  return lines.join('\n');
}

function getWilayaName(wilayaId: number): string {
  const wilayas = require('./delivery').wilayas as Array<{ id: number; name: string }>;
  const w = wilayas.find((wilaya) => wilaya.id === wilayaId);
  return w?.name || `Wilaya ${wilayaId}`;
}

function getCommuneName(wilayaId: number, communeId: number): string {
  const wilayas = require('./delivery').wilayas as Array<{ id: number; communes: Array<{ id: number; name: string }> }>;
  const wilaya = wilayas.find((w) => w.id === wilayaId);
  const commune = wilaya?.communes.find((c) => c.id === communeId);
  return commune?.name || `Commune ${communeId}`;
}

export function generateWhatsAppUrl(message: string, phoneNumber: string = '213553385674'): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

export function createWhatsAppOrder(order: OrderSummary, phoneNumber?: string): { message: string; url: string } {
  const message = generateWhatsAppMessage(order);
  const url = generateWhatsAppUrl(message, phoneNumber);
  return { message, url };
}