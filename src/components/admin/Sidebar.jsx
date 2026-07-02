import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tags, Image, Home, Star, HelpCircle,
  Settings, LogOut, X, Store
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/categories', icon: Tags, label: 'Categories' },
  { to: '/admin/media', icon: Image, label: 'Media' },
  { to: '/admin/homepage', icon: Home, label: 'Homepage' },
  { to: '/admin/testimonials', icon: Star, label: 'Testimonials' },
  { to: '/admin/faq', icon: HelpCircle, label: 'FAQ' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#1a1410] z-50 flex flex-col
        transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/5">
          <NavLink to="/admin/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Store size={16} className="text-white" />
            </div>
            <span className="font-display text-lg text-white font-semibold">Dinime</span>
          </NavLink>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-primary/20 text-primary-light font-medium'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          <NavLink
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Store size={18} />
            View Store
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
