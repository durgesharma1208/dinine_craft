import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, FileText, Eye, Download, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import { fetchCatalogsByCategory } from "../../services/catalogService";
import { formatBytes } from "../../utils/helpers";

export default function ProductFilters({
  filters,
  updateFilter,
  resetFilters,
  activeFilterCount,
  isOpen,
  onClose,
}) {
  const { categories } = useCategories();
  const [catalog, setCatalog] = useState(null);
  const [catalogLoading, setCatalogLoading] = useState(false);

  const selectedCategory = categories.find(c => c.slug === filters.category);

  useEffect(() => {
    if (!selectedCategory) { setCatalog(null); return; }
    let mounted = true;
    setCatalogLoading(true);
    setCatalog(null);
    fetchCatalogsByCategory(selectedCategory.id)
      .then(data => { if (mounted && data?.length > 0) setCatalog(data[0]); })
      .catch(() => {})
      .finally(() => { if (mounted) setCatalogLoading(false); });
    return () => { mounted = false; };
  }, [selectedCategory]);
  const priceRanges = [
    {
      label: "All Prices",
      min: 0,
      max: Infinity,
      active: filters.minPrice === 0 && filters.maxPrice === Infinity,
    },
    {
      label: "Under ₹500",
      min: 0,
      max: 500,
      active: filters.minPrice === 0 && filters.maxPrice === 500,
    },
    {
      label: "₹500 - ₹1000",
      min: 500,
      max: 1000,
      active: filters.minPrice === 500 && filters.maxPrice === 1000,
    },
    {
      label: "₹1000 - ₹2000",
      min: 1000,
      max: 2000,
      active: filters.minPrice === 1000 && filters.maxPrice === 2000,
    },
    {
      label: "Above ₹2000",
      min: 2000,
      max: Infinity,
      active: filters.minPrice === 2000 && filters.maxPrice === Infinity,
    },
  ];

  const ratings = [0, 4, 3, 2, 1];

  const filterContent = (
    <div className="space-y-6 premium-shell rounded-2xl p-5">
      {/* Catalog section at top */}
      {catalogLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 size={16} className="animate-spin text-primary/60" />
        </div>
      ) : catalog ? (
        <div className="bg-[#87663b]/5 rounded-xl p-4 border border-[#c9a177]/12">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#87663b]/50 mb-2">Catalog</p>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#87663b]/10 flex items-center justify-center shrink-0">
              <FileText size={15} className="text-[#87663b]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#28221a] truncate">{catalog.title}</p>
              <p className="text-[10px] text-gray-400">{catalog.page_count || '?'} pages · {formatBytes(catalog.file_size)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Link to={`/catalog/${catalog.id}`} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-white text-[#87663b] text-[10px] font-semibold hover:bg-[#87663b]/8 transition-colors border border-[#c9a177]/15">
              <Eye size={11} /> View
            </Link>
            <a href={catalog.pdf_url} download className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-primary text-white text-[10px] font-semibold hover:bg-primary-light transition-colors">
              <Download size={10} /> Download
            </a>
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-charcoal">
          Filters
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-primary hover:text-primary-dark transition-colors"
          >
            <RotateCcw size={11} /> Clear
          </button>
        )}
      </div>

      <div>
        <h4 className="text-[11px] font-semibold text-charcoal/60 uppercase tracking-[0.14em] mb-3">
          Category
        </h4>
        <div className="space-y-0.5">
          <button
            onClick={() => updateFilter("category", "")}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!filters.category ? "bg-primary text-white shadow-[0_8px_18px_rgba(95,67,36,0.24)]" : "text-gray-500 hover:bg-[#f4e8d8]/70"}`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => updateFilter("category", cat.slug)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.category === cat.slug ? "bg-primary text-white shadow-[0_8px_18px_rgba(95,67,36,0.24)]" : "text-gray-500 hover:bg-[#f4e8d8]/70"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[11px] font-semibold text-charcoal/60 uppercase tracking-[0.14em] mb-3">
          Price
        </h4>
        <div className="space-y-0.5">
          {priceRanges.map((r, i) => (
            <button
              key={i}
              onClick={() => {
                updateFilter("minPrice", r.min);
                updateFilter("maxPrice", r.max);
              }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${r.active ? "bg-primary text-white shadow-[0_8px_18px_rgba(95,67,36,0.24)]" : "text-gray-500 hover:bg-[#f4e8d8]/70"}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[11px] font-semibold text-charcoal/60 uppercase tracking-[0.14em] mb-3">
          Rating
        </h4>
        <div className="space-y-0.5">
          {ratings.map((r) => (
            <button
              key={r}
              onClick={() => updateFilter("minRating", r)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.minRating === r ? "bg-primary text-white shadow-[0_8px_18px_rgba(95,67,36,0.24)]" : "text-gray-500 hover:bg-[#f4e8d8]/70"}`}
            >
              {r === 0 ? "All Ratings" : `${r}★ & above`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[11px] font-semibold text-charcoal/60 uppercase tracking-[0.14em] mb-3">
          Availability
        </h4>
        <div className="space-y-0.5">
          {[
            { label: "All", value: "" },
            { label: "In Stock", value: "in-stock" },
            { label: "Out of Stock", value: "out-of-stock" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter("availability", opt.value)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.availability === opt.value ? "bg-primary text-white shadow-[0_8px_18px_rgba(95,67,36,0.24)]" : "text-gray-500 hover:bg-[#f4e8d8]/70"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[11px] font-semibold text-charcoal/60 uppercase tracking-[0.14em] mb-3">
          Quick Filters
        </h4>
        <div className="space-y-2">
          {[
            { key: "featured", label: "Featured" },
            { key: "bestSeller", label: "Best Seller" },
            { key: "trending", label: "Trending" },
            { key: "newArrival", label: "New Arrival" },
          ].map((opt) => (
            <label
              key={opt.key}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${filters[opt.key] ? "bg-primary border-primary" : "border-gray-300 group-hover:border-gray-400"}`}
              >
                {filters[opt.key] && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-500 group-hover:text-charcoal transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24">{filterContent}</div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute left-0 top-0 bottom-0 w-75 bg-[#fffdf9] shadow-2xl overflow-y-auto"
            >
              <div className="sticky top-0 bg-[#fffdf9]/90 backdrop-blur-sm border-b border-[#8b6d45]/10 p-4 flex items-center justify-between z-10">
                <h3 className="font-display font-semibold">Filters</h3>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-cream rounded-full transition-colors focus-luxury"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-4">{filterContent}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
