import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useProducts } from "../hooks/useProducts";
import { useFilterSort } from "../hooks/useFilterSort";
import ProductGrid from "../components/product/ProductGrid";
import ProductFilters from "../components/product/ProductFilters";
import ProductSort from "../components/product/ProductSort";
import QuickView from "../components/product/QuickView";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import { SITE_URL } from "../utils/siteUrl";

export default function Shop() {
  const { allProducts } = useProducts();
  const {
    filters,
    updateFilter,
    resetFilters,
    sortBy,
    setSortBy,
    filteredAndSorted,
    activeFilterCount,
  } = useFilterSort(allProducts);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <>
      <Helmet>
        <title>
          Shop All Products — Dinine Craft | Handcrafted Wooden Decor
        </title>
        <meta
          name="description"
          content="Browse our complete collection of handcrafted wooden decor. Shop keyholders, wall hangings, fridge magnets, table stands, and more."
        />
        <link rel="canonical" href={`${SITE_URL}/shop`} />
      </Helmet>

      <div className="pt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Shop All" }]} />
        </div>
      </div>

      <section className="pb-20 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 premium-shell rounded-[1.8rem] p-6 md:p-8"
          >
            <p className="section-eyebrow mb-2">Collection</p>
            <h1 className="text-3xl md:text-5xl font-display text-charcoal tracking-tight leading-[0.98]">
              Shop All Products
            </h1>
            <p className="text-[#5a4f43] text-sm md:text-base mt-3 max-w-2xl">
              Discover our complete collection of handcrafted wooden decor,
              thoughtfully designed to bring warmth, personality, and premium
              quality to your home.
            </p>
          </motion.div>

          <div className="flex gap-8">
            <ProductFilters
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
              activeFilterCount={activeFilterCount}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <div className="flex-1 min-w-0">
              <ProductSort
                sortBy={sortBy}
                setSortBy={setSortBy}
                totalProducts={filteredAndSorted.length}
                onToggleFilters={() => setSidebarOpen(true)}
                activeFilterCount={activeFilterCount}
              />
              <ProductGrid
                products={filteredAndSorted}
                onQuickView={setQuickViewProduct}
              />
            </div>
          </div>
        </div>
      </section>

      <QuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
