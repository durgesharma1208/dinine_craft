import { MessageCircle } from 'lucide-react';
import { openWhatsApp } from '../../utils/whatsapp';

export default function WhatsAppButton({ message, label = 'Order on WhatsApp', variant = 'primary', size = 'md', className = '' }) {
  const base = 'inline-flex items-center justify-center gap-2.5 font-medium rounded-full transition-all duration-300 select-none';

  const variants = {
    primary: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_4px_14px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.35)]',
    secondary: 'bg-white text-emerald-600 border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      onClick={() => openWhatsApp(message)}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <MessageCircle size={size === 'sm' ? 14 : 18} className="flex-shrink-0" />
      {label}
    </button>
  );
}
