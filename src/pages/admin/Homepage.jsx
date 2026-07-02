import { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getHomepageSections, updateHomepageSection } from '../../services/adminService';

const SECTION_LABELS = {
  hero: 'Hero Banner',
  featured_categories: 'Featured Categories',
  featured_products: 'Featured Products',
  why_choose_us: 'Why Choose Us',
  statistics: 'Statistics',
  best_sellers: 'Best Sellers',
  crafting_process: 'Crafting Process',
  trending_products: 'Trending Products',
  customer_reviews: 'Customer Reviews',
  new_arrivals: 'New Arrivals',
  customization: 'Customization Section',
  instagram_gallery: 'Instagram Gallery',
  faq_section: 'FAQ Section',
  newsletter: 'Newsletter',
  contact_cta: 'Contact CTA',
};

export default function AdminHomepage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await getHomepageSections();
      setSections(data.length > 0 ? data : Object.entries(SECTION_LABELS).map(([key, title]) => ({
        section_key: key, title, active: true, sort_order: 0, subtitle: '',
      })));
    } catch { setSections(Object.entries(SECTION_LABELS).map(([key, title]) => ({ section_key: key, title, active: true }))); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleActive = async (sectionKey, current) => {
    setSaving(sectionKey);
    try {
      await updateHomepageSection(sectionKey, { active: !current });
      setSections((prev) => prev.map((s) => s.section_key === sectionKey ? { ...s, active: !current } : s));
      toast.success('Updated');
    } catch { toast.error('Failed to update'); }
    finally { setSaving(null); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[#2a1e14] font-semibold">Homepage Sections</h1>
        <p className="text-sm text-gray-500 mt-0.5">Toggle visibility of homepage sections</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sections.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map((section) => (
          <div key={section.section_key} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#2a1e14]">{section.title || SECTION_LABELS[section.section_key] || section.section_key}</p>
              <p className="text-xs text-gray-400 mt-0.5">{section.section_key}</p>
            </div>
            <button
              onClick={() => toggleActive(section.section_key, section.active)}
              disabled={saving === section.section_key}
              className={`p-2 rounded-lg transition-colors ${
                section.active ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {saving === section.section_key ? <Loader2 size={16} className="animate-spin" /> : section.active ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
