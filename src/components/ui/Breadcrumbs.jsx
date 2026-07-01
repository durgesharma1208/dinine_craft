import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="py-5">
      <ol className="flex items-center gap-1.5 text-xs">
        <li>
          <Link to="/" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-1 group">
            <Home size={13} className="group-hover:text-primary" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <ChevronRight size={11} className="text-gray-300" />
            {item.to ? (
              <Link to={item.to} className="text-gray-400 hover:text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-charcoal/70 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
