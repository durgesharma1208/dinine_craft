import { Helmet } from 'react-helmet-async';
import HeroBanner from '../components/home/HeroBanner';
import FeaturedCategories from '../components/home/FeaturedCategories';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CustomerReviews from '../components/home/CustomerReviews';
import InstagramGallery from '../components/home/InstagramGallery';
import CraftingProcess from '../components/home/CraftingProcess';
import StatisticsCounter from '../components/home/StatisticsCounter';
import CustomizationSection from '../components/home/CustomizationSection';
import FAQ from '../components/home/FAQ';
import Newsletter from '../components/home/Newsletter';
import ContactCTA from '../components/home/ContactCTA';
import ProductSection from '../components/home/ProductSection';
import { generateOrganizationJsonLd, generateWebsiteJsonLd } from '../utils/seo';
import { SITE_URL } from '../utils/siteUrl';
import { useHomepageSections } from '../hooks/useHomepageSections';
import CatalogSection from '../components/catalog/CatalogSection';

export default function Home() {
  const { isActive } = useHomepageSections();
  return (
    <>
      <Helmet>
        <title>Dinine Craft — Handcrafted Wooden Decor That Makes Every Space Beautiful</title>
        <meta name="description" content="Discover premium handcrafted wooden decor at Dinine Craft. Beautiful keyholders, wall hangings, fridge magnets, and table stands. Made in India with love." />
        <meta property="og:title" content="Dinine Craft — Handcrafted Wooden Decor" />
        <meta property="og:description" content="Handcrafted Wooden Decor That Makes Every Space Beautiful" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dinine Craft — Handcrafted Wooden Decor" />
        <meta name="twitter:description" content="Handcrafted Wooden Decor That Makes Every Space Beautiful" />
        <link rel="canonical" href={SITE_URL} />
        <script type="application/ld+json">{JSON.stringify(generateOrganizationJsonLd())}</script>
        <script type="application/ld+json">{JSON.stringify(generateWebsiteJsonLd())}</script>
      </Helmet>

      {isActive('hero') && <HeroBanner />}
      {isActive('featured_categories') && <FeaturedCategories />}
      {isActive('featured_products') && <ProductSection filterKey="featured" />}
      {isActive('why_choose_us') && <WhyChooseUs />}
      {isActive('statistics') && <StatisticsCounter />}
      {isActive('best_sellers') && <ProductSection filterKey="bestSeller" />}
      {isActive('crafting_process') && <CraftingProcess />}
      {isActive('trending_products') && <ProductSection filterKey="trending" />}
      {isActive('customer_reviews') && <CustomerReviews />}
      {isActive('new_arrivals') && <ProductSection filterKey="newArrival" />}
      <CatalogSection showAll />
      {isActive('customization') && <CustomizationSection />}
      {isActive('instagram_gallery') && <InstagramGallery />}
      {isActive('faq_section') && <FAQ />}
      {isActive('newsletter') && <Newsletter />}
      {isActive('contact_cta') && <ContactCTA />}
    </>
  );
}
