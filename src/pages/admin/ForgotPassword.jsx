import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, Mail, ArrowLeft, Loader2, CheckCircle, Leaf } from 'lucide-react';
import { resetPassword } from '../../lib/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1410] via-[#2a1e14] to-[#1a1410] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4">
            <Store size={32} className="text-primary-light" />
          </div>
          <h1 className="font-display text-3xl text-white font-semibold">Reset Password</h1>
          <p className="text-white/40 text-sm mt-1">We'll send you a reset link</p>
        </div>

        {sent ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
            <h2 className="text-white font-semibold text-lg mb-2">Check your email</h2>
            <p className="text-white/50 text-sm mb-6">We sent a password reset link to {email}</p>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 text-sm text-primary-light hover:text-primary transition-colors"
            >
              <ArrowLeft size={14} />
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dininecraft.com"
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/20 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary hover:bg-primary-light text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <Link
              to="/admin/login"
              className="flex items-center justify-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              <ArrowLeft size={14} />
              Back to login
            </Link>
          </form>
        )}

        <div className="text-center mt-6">
          <Link to="/" className="text-white/30 hover:text-white/50 text-xs transition-colors flex items-center justify-center gap-1.5">
            <Leaf size={12} />
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
