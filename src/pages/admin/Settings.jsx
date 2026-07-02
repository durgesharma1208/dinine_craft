import { useState, useEffect } from 'react';
import { Loader2, Save, Mail, Phone, Link, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSiteSettings, updateSiteSetting } from '../../services/adminService';
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE, EMAIL, INSTAGRAM_URL, FACEBOOK_URL } from '../../utils/constants';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    whatsapp_number: WHATSAPP_NUMBER,
    whatsapp_message: WHATSAPP_MESSAGE,
    email: EMAIL,
    instagram: INSTAGRAM_URL,
    facebook: FACEBOOK_URL,
  });

  useEffect(() => {
    getSiteSettings().then((settings) => {
      setForm((prev) => ({
        ...prev,
        ...(settings.whatsapp_number ? { whatsapp_number: settings.whatsapp_number } : {}),
        ...(settings.whatsapp_message ? { whatsapp_message: settings.whatsapp_message } : {}),
        ...(settings.email ? { email: settings.email } : {}),
        ...(settings.instagram ? { instagram: settings.instagram } : {}),
        ...(settings.facebook ? { facebook: settings.facebook } : {}),
      }));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(form)) {
        await updateSiteSetting(key, value);
      }
      toast.success('Settings saved');
    } catch { toast.error('Failed to save settings'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-primary" /></div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[#2a1e14] font-semibold">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your store settings</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-display text-lg text-[#2a1e14] font-semibold">Business Information</h2>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><Phone size={14} /> WhatsApp Number</label>
          <input value={form.whatsapp_number} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><Phone size={14} /> WhatsApp Message</label>
          <input value={form.whatsapp_message} onChange={(e) => setForm({ ...form, whatsapp_message: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><Mail size={14} /> Email</label>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><ExternalLink size={14} /> Instagram URL</label>
          <input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><Link size={14} /> Facebook URL</label>
          <input value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
        </div>

        <div className="pt-2">
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
