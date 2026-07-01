import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../../utils/constants';

export default function StickyWhatsApp() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Dinine Craft! I have a question.')}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-20 z-50 w-11 h-11 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-all hover:scale-110 hover:shadow-emerald-500/30 flex items-center justify-center group"
    >
      <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
    </a>
  );
}
