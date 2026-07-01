export function generateProductJsonLd(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Dinine Craft',
    },
    offers: {
      '@type': 'Offer',
      url: `https://dininecraft.com/product/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
  };
}

import { WHATSAPP_NUMBER } from './constants';

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Dinine Craft',
    url: 'https://dininecraft.com',
    logo: 'https://images.unsplash.com/photo-1612152661182-8d6c5e568c94?w=200&q=80',
    description: 'Handcrafted Wooden Decor That Makes Every Space Beautiful',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+91-${WHATSAPP_NUMBER}`,
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://instagram.com/dininecraft',
      'https://facebook.com/dininecraft',
      'https://pinterest.com/dininecraft',
    ],
  };
}

export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dinine Craft',
    url: 'https://dininecraft.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://dininecraft.com/shop?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateBreadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
