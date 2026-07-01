import { useState, memo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Eye, Star } from "lucide-react";
import { formatPrice, getStockStatus } from "../../utils/helpers";
import { useWishlistContext } from "../../contexts/WishlistContext";
import Badge from "../ui/Badge";

const ProductCard = memo(function ProductCard({
  product,
  onQuickView,
  index = 0,
}) {
  const [imgHovered, setImgHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef(null);
  const { isInWishlist, toggleWishlist } = useWishlistContext();
  const wishlisted = isInWishlist(product.id);
  const stockInfo = getStockStatus(product.stock, product.availability);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.setProperty("--mouse-x", x);
    cardRef.current.style.setProperty("--mouse-y", y);
  };

  const hasDiscount = product.originalPrice > product.price;
  const altImage = product.images?.[1] || product.thumbnail;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.5,
        delay: (index % 4) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={(e) => {
          setImgHovered(true);
          e.currentTarget.style.boxShadow =
            "0 28px 65px rgba(54,35,18,0.16), 0 10px 20px rgba(54,35,18,0.1)";
          e.currentTarget.style.transform =
            "perspective(880px) rotateX(calc(var(--mouse-y) * -4deg)) rotateY(calc(var(--mouse-x) * 4deg)) translateY(-7px)";
        }}
        onMouseLeave={(e) => {
          setImgHovered(false);
          e.currentTarget.style.boxShadow =
            "0 10px 26px rgba(45,30,15,0.08), 0 1px 4px rgba(45,30,15,0.06)";
          e.currentTarget.style.transform =
            "perspective(880px) rotateX(0deg) rotateY(0deg) translateY(0px)";
        }}
        className="relative bg-[#fffdf9] rounded-[1.35rem] overflow-hidden transition-all duration-500 border border-[#8b6d45]/10"
        style={{
          boxShadow:
            "0 10px 26px rgba(45,30,15,0.08), 0 1px 4px rgba(45,30,15,0.06)",
          transform: "perspective(880px)",
          transition: "box-shadow 0.5s ease, transform 0.5s ease",
        }}
      >
        <div className="relative overflow-hidden aspect-square bg-[#f4e9dc]/55">
          <Link to={`/product/${product.slug}`}>
            <motion.img
              src={
                imgError
                  ? "https://images.unsplash.com/photo-1612152661182-8d6c5e568c94?w=400&q=80"
                  : imgHovered
                    ? altImage
                    : product.thumbnail
              }
              alt={product.name}
              className="w-full h-full object-cover"
              style={{ opacity: imgLoaded ? 1 : 0 }}
              onLoad={() => setImgLoaded(true)}
              loading="lazy"
              onError={() => setImgError(true)}
              animate={{ scale: imgHovered ? 1.08 : 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            />
            {!imgLoaded && (
              <div className="absolute inset-0 bg-cream animate-shimmer" />
            )}
          </Link>

          <div className="absolute inset-0 bg-linear-to-t from-[#1f160e]/35 via-transparent to-transparent opacity-80 pointer-events-none" />

          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {hasDiscount && product.discount > 8 && (
              <Badge variant="sale">-{product.discount}%</Badge>
            )}
            {product.newArrival && <Badge variant="new">New</Badge>}
            {product.bestSeller && (
              <Badge variant="bestseller">Best Seller</Badge>
            )}
            {product.stock > 0 && product.stock <= 3 && (
              <Badge variant="limited">Only {product.stock}</Badge>
            )}
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product.id);
              }}
              aria-label={
                wishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              className={`p-2.5 rounded-full bg-white/82 backdrop-blur-sm shadow-[0_8px_20px_rgba(43,30,16,0.16)] transition-all ${wishlisted ? "text-rose-500" : "text-gray-500 hover:text-rose-400"}`}
            >
              <Heart size={15} fill={wishlisted ? "currentColor" : "none"} />
            </motion.button>
            {onQuickView && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(product);
                }}
                aria-label="Quick view"
                className="p-2.5 rounded-full bg-white/82 backdrop-blur-sm shadow-[0_8px_20px_rgba(43,30,16,0.16)] text-gray-500 hover:text-primary transition-colors"
              >
                <Eye size={15} />
              </motion.button>
            )}
          </div>

          <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out z-10">
            <Link
              to={`/product/${product.slug}`}
              className="block w-full text-center py-2.5 bg-white/90 backdrop-blur-sm text-charcoal text-[11px] uppercase tracking-[0.14em] font-semibold rounded-full hover:bg-primary hover:text-white transition-all shadow-[0_8px_20px_rgba(43,30,16,0.25)]"
            >
              Quick View
            </Link>
          </div>
        </div>

        <div className="p-4 md:p-5">
          <div className="text-[10px] text-primary/70 font-semibold uppercase tracking-[0.16em] mb-1.5">
            {product.category}
          </div>
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-[0.98rem] font-medium text-charcoal leading-snug mb-2 line-clamp-2 hover:text-primary transition-colors min-h-[2.8rem]">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-0.5">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-gray-600">
                {product.rating}
              </span>
            </div>
            <span className="text-[10px] text-gray-400">
              ({product.reviews})
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-display font-semibold text-charcoal tracking-tight">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <p
            className={`text-[10px] mt-1.5 font-semibold tracking-[0.13em] uppercase ${stockInfo.color}`}
          >
            {stockInfo.label}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

export default ProductCard;
