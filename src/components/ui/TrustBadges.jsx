import { Shield, Truck, RotateCcw, Lock } from 'lucide-react';

const badges = [
  { icon: Shield, label: 'Secure Payment' },
  { icon: Truck, label: 'Free Shipping' },
  { icon: RotateCcw, label: '7-Day Returns' },
  { icon: Lock, label: '100% Safe' },
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-8">
      {badges.map((badge, index) => (
        <div key={index} className="flex items-center gap-3 p-3.5 rounded-xl bg-cream/40 border border-black/[0.02]">
          <badge.icon size={18} className="text-primary/60 flex-shrink-0" />
          <span className="text-xs font-medium text-charcoal/70">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
