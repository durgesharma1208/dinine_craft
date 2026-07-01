import { motion } from "framer-motion";
import { Ruler, Weight, Package, CheckCircle } from "lucide-react";
import { formatPrice, getStockStatus } from "../../utils/helpers";
import {
  openWhatsApp,
  getOrderMessage,
  getCustomizationMessage,
} from "../../utils/whatsapp";
import Badge from "../ui/Badge";
import WhatsAppButton from "../ui/WhatsAppButton";
import Button from "../ui/Button";

export default function ProductInfo({ product }) {
  const stockInfo = getStockStatus(product.stock, product.availability);

  return (
    <div className="space-y-6 lg:sticky lg:top-24 premium-shell rounded-[1.7rem] p-6 lg:p-7">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[10px] font-semibold text-primary/80 uppercase tracking-[0.2em]">
            {product.category}
          </span>
          {product.newArrival && <Badge variant="new">New</Badge>}
          {product.bestSeller && (
            <Badge variant="bestseller">Best Seller</Badge>
          )}
          {product.customizable && <Badge variant="customizable">Custom</Badge>}
        </div>
        <h1 className="text-3xl md:text-[2.4rem] lg:text-[2.7rem] font-display text-charcoal leading-[1.02] tracking-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-200"}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-400">
            ({product.reviews} reviews)
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-baseline gap-3 py-4 border-y border-[#8b6d45]/12"
      >
        <span className="text-4xl font-display font-semibold text-charcoal tracking-tight">
          {formatPrice(product.price)}
        </span>
        {product.originalPrice > product.price && (
          <>
            <span className="text-lg text-gray-300 line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-[0.12em]">
              Save {formatPrice(product.originalPrice - product.price)}
            </span>
          </>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.12em] ${stockInfo.bg} ${stockInfo.color}`}
        >
          {product.stock > 0 ? <CheckCircle size={13} /> : null}
          {stockInfo.label}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-2.5"
      >
        {[
          { icon: Package, label: "Material", value: product.material },
          { icon: Ruler, label: "Dimensions", value: product.dimensions },
          { icon: Weight, label: "Weight", value: product.weight },
          { icon: Package, label: "SKU", value: product.sku },
        ].map((item, i) =>
          item.value ? (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#f7ede2] border border-[#8b6d45]/10"
            >
              <item.icon size={16} className="text-primary/60 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.12em]">
                  {item.label}
                </p>
                <p className="text-xs font-medium text-charcoal mt-0.5">
                  {item.value}
                </p>
              </div>
            </div>
          ) : null,
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h3 className="font-display text-base font-semibold text-charcoal mb-2">
          Description
        </h3>
        <p className="text-sm text-[#5a4f43] leading-relaxed">
          {product.description}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <WhatsAppButton
            message={getOrderMessage(product)}
            label="Order on WhatsApp"
            variant="primary"
            size="lg"
            className="flex-1"
          />
          {product.customizable && (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => openWhatsApp(getCustomizationMessage(product))}
              className="flex-1"
            >
              Request Custom Design
            </Button>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="border-t border-gray-100 pt-5"
      >
        <div className="space-y-2 text-sm text-gray-400">
          {[
            "Free shipping on orders above ₹999",
            "7-day easy return policy",
            "Premium quality guaranteed",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <CheckCircle size={13} className="text-emerald-400 shrink-0" />
              <span className="text-[#5a4f43]">{item}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
