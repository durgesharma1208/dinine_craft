import { WHATSAPP_NUMBER } from './constants';

export function getWhatsAppUrl(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export function getOrderMessage(product) {
  return `Hello Dinine Craft,

I want to order:
*Product:* ${product.name}
*Price:* ₹${product.price.toLocaleString('en-IN')}

Please share more details about:
• Availability
• Delivery time
• Payment options

Thank you!`;
}

export function getCustomizationMessage(product) {
  return `Hello Dinine Craft,

I'm interested in a custom design for:
*Product:* ${product.name}
*SKU:* ${product.sku}

Please share:
• Customization options available
• Pricing for custom order
• Timeline for custom work

Thank you!`;
}

export function openWhatsApp(message) {
  window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
}
