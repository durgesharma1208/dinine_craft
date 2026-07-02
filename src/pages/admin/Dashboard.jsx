import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Tags, MessageSquare, Users, AlertTriangle, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import { getDashboardStats } from '../../services/adminService';
import { formatPrice } from '../../utils/helpers';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  const cards = [
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'bg-blue-500', href: '/admin/products' },
    { label: 'Categories', value: stats?.totalCategories || 0, icon: Tags, color: 'bg-emerald-500', href: '/admin/categories' },
    { label: 'Contact Messages', value: stats?.totalOrders || 0, icon: MessageSquare, color: 'bg-amber-500', href: '/admin/settings' },
    { label: 'Newsletter Subs', value: stats?.totalSubscribers || 0, icon: Users, color: 'bg-purple-500', href: '/admin/settings' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[#2a1e14] font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Overview of your store</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.label} to={card.href} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon size={18} className="text-white" />
              </div>
              <TrendingUp size={16} className="text-green-500" />
            </div>
            <p className="text-2xl font-bold text-[#2a1e14]">{card.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-[#2a1e14] font-semibold">Recent Products</h2>
            <Link to="/admin/products" className="text-sm text-primary hover:text-primary-light flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {stats?.recentProducts?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <p className="text-sm font-medium text-[#2a1e14]">{p.name}</p>
                  <p className="text-sm text-primary font-medium">{formatPrice(Number(p.price))}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No products yet</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-[#2a1e14] font-semibold">Inventory Alerts</h2>
            {stats?.lowStockCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                <AlertTriangle size={12} />
                {stats.lowStockCount} items
              </span>
            )}
          </div>
          {stats?.lowStockCount > 0 ? (
            <p className="text-sm text-gray-600">{stats.lowStockCount} products have low stock (3 or less).</p>
          ) : (
            <p className="text-sm text-gray-400">All products are well-stocked.</p>
          )}
          <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-light mt-3">
            Manage inventory <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
