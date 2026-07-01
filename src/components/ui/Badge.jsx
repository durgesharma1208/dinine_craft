export default function Badge({ children, variant = 'default', className = '', animated = true }) {
  const variants = {
    default: 'bg-primary/10 text-primary border border-primary/20',
    sale: 'bg-red-50 text-red-600 border border-red-200',
    new: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    trending: 'bg-orange-50 text-orange-600 border border-orange-200',
    bestseller: 'bg-amber-50 text-amber-700 border border-amber-200',
    limited: 'bg-rose-50 text-rose-600 border border-rose-200',
    premium: 'bg-stone-100 text-stone-700 border border-stone-200',
    outOfStock: 'bg-gray-100 text-gray-500 border border-gray-200',
    customizable: 'bg-blue-50 text-blue-600 border border-blue-200',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full backdrop-blur-sm ${variants[variant]} ${animated ? 'animate-fadeIn' : ''} ${className}`}>
      {children}
    </span>
  );
}
