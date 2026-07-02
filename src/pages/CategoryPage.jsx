import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useFilterSort } from "../hooks/useFilterSort";
import ProductGrid from "../components/product/ProductGrid";
import ProductSort from "../components/product/ProductSort";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import { useCategories } from "../hooks/useCategories";
import { SITE_URL } from "../utils/siteUrl";

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const { getProductsByCategory } = useProducts();
  const { categories } = useCategories();

  const categoryProducts = getProductsByCategory[categorySlug] || [];
  const categoryInfo = categories.find((c) => c.slug === categorySlug);
  const categoryName =
    categoryInfo?.name ||
    categorySlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const { sortBy, setSortBy, filteredAndSorted } =
    useFilterSort(categoryProducts);

  return (
    <>
      <Helmet>
        <title>{categoryName}s — Dinine Craft | Handcrafted Wooden Decor</title>
        <meta
          name="description"
          content={
            categoryInfo?.description ||
            `Shop our collection of handcrafted wooden ${categoryName.toLowerCase()}s`
          }
        />
        <link
          rel="canonical"
          href={`${SITE_URL}/category/${categorySlug}`}
        />
      </Helmet>

      <div className="pt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Shop All", to: "/shop" },
              { label: `${categoryName}s` },
            ]}
          />
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
            <p className="section-eyebrow mb-2">Category</p>
            <h1 className="text-3xl md:text-5xl font-display text-charcoal tracking-tight leading-[0.98]">
              {categoryName}s
            </h1>
            {categoryInfo?.description && (
              <p className="text-[#5a4f43] text-sm md:text-base mt-3 max-w-2xl">
                {categoryInfo.description}
              </p>
            )}
          </motion.div>

          <ProductSort
            sortBy={sortBy}
            setSortBy={setSortBy}
            totalProducts={filteredAndSorted.length}
          />

          {filteredAndSorted.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cream/50 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">
                No products in this category yet
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium mt-4 text-sm"
              >
                <ArrowLeft size={14} /> View All Products
              </Link>
            </div>
          ) : (
            <ProductGrid products={filteredAndSorted} />
          )}
        </div>
      </section>
    </>
  );
}
