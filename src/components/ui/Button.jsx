import { forwardRef, useState } from "react";
import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-gradient-to-r from-primary to-primary-dark text-white shadow-[0_10px_24px_rgba(95,67,36,0.3)] hover:shadow-[0_14px_34px_rgba(95,67,36,0.38)]",
  secondary:
    "bg-white/85 text-primary border border-primary/30 hover:border-primary hover:bg-[#f7efe4] shadow-[0_8px_18px_rgba(95,67,36,0.08)]",
  outline:
    "bg-transparent text-charcoal border border-charcoal/25 hover:border-charcoal/60 hover:bg-charcoal/5",
  ghost: "bg-transparent text-charcoal hover:bg-warm/80",
  gold: "bg-gradient-to-r from-[#b89a67] via-[#a88352] to-[#87663b] text-white shadow-[0_12px_28px_rgba(120,87,48,0.35)] hover:shadow-[0_16px_34px_rgba(120,87,48,0.4)]",
};

const sizes = {
  sm: "px-5 py-2.5 text-xs tracking-[0.16em] uppercase",
  md: "px-7 py-3 text-xs tracking-[0.16em] uppercase",
  lg: "px-9 py-4 text-sm tracking-[0.12em] uppercase",
  xl: "px-12 py-5 text-base tracking-[0.1em] uppercase",
};

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      icon: Icon,
      iconPosition = "left",
      href,
      loading,
      disabled,
      className = "",
      magnetic = true,
      ...props
    },
    ref,
  ) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
      if (!magnetic || disabled) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
      setMousePos({ x, y });
    };

    const handleMouseLeave = () => {
      setMousePos({ x: 0, y: 0 });
      setIsHovered(false);
    };

    const base =
      "inline-flex items-center justify-center gap-2.5 font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none relative overflow-hidden transform-gpu";

    const content = (
      <>
        <span className="relative z-10 flex items-center gap-2.5">
          {Icon && iconPosition === "left" && (
            <Icon
              size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
              className="shrink-0"
            />
          )}
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Loading...
            </span>
          ) : (
            children
          )}
          {Icon && iconPosition === "right" && (
            <Icon
              size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
              className="shrink-0"
            />
          )}
        </span>
        {isHovered && !disabled && (
          <motion.span
            className="absolute inset-0 bg-white/12 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2.3, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.42 }}
          />
        )}
        <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/15 pointer-events-none" />
      </>
    );

    const motionStyle =
      magnetic && isHovered ? { x: mousePos.x, y: mousePos.y } : {};

    if (href) {
      return (
        <a
          href={href}
          ref={ref}
          className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            transform:
              magnetic && isHovered
                ? `translate(${mousePos.x}px, ${mousePos.y}px)`
                : "none",
          }}
          {...props}
        >
          {content}
        </a>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.018, y: disabled ? 0 : -1 }}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        style={motionStyle}
        {...props}
      >
        {content}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
export default Button;
