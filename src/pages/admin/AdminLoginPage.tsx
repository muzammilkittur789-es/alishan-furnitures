import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Store,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useShowroom } from '../../context/ShowroomContext';

export const AdminLoginPage: React.FC = () => {
  const { settings, isAdminAuthenticated, adminLogin } = useShowroom();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to /admin/dashboard
  useEffect(() => {
    if (isAdminAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAdminAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await adminLogin({ username, password });
      if (!result.success) {
        setErrorMessage(result.error || 'Authentication failed. Please check credentials.');
      } else {
        const from = (location.state as any)?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setErrorMessage('An unexpected error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setUsername('admin@alishan.demo');
    setPassword('alishan2026');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between font-sans selection:bg-walnut-200 selection:text-walnut-900">
      {/* Top Simple Header */}
      <header className="border-b border-sand-200 bg-white/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-walnut-950 hover:opacity-90 transition-opacity">
          <span className="w-8 h-8 rounded bg-walnut-900 text-sand-100 flex items-center justify-center font-serif font-bold text-xs">
            {settings.initials || 'AF'}
          </span>
          <div>
            <span className="font-serif font-bold text-base tracking-tight text-walnut-950 block leading-none">
              {settings.name}
            </span>
            <span className="text-[10px] text-charcoal-500 uppercase tracking-wider">
              Management Portal
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-walnut-800 hover:text-walnut-950 transition-colors"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Customer Website</span>
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-sand-300 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-xl bg-walnut-900 text-sand-100 mx-auto flex items-center justify-center shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-walnut-950 pt-2">
              Administrator Login
            </h1>
            <p className="text-xs text-charcoal-500">
              Sign in to manage showroom inventory, display statuses, and analytics.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-walnut-900 uppercase tracking-wider block">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@alishan.demo"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-sand-50 border border-sand-300 rounded-lg text-xs text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-walnut-800 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-walnut-900 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-sand-50 border border-sand-300 rounded-lg text-xs text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-walnut-800 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-charcoal-400 hover:text-charcoal-700 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-walnut-900 hover:bg-walnut-800 active:bg-walnut-950 text-white font-semibold text-xs py-3 px-4 rounded-lg shadow-md transition-colors disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Helper Box */}
          <div className="bg-sand-100 rounded-xl p-4 border border-sand-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-walnut-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-walnut-700" />
                Demo Credentials
              </span>
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                className="text-[11px] font-semibold text-walnut-800 hover:text-walnut-950 underline"
              >
                Auto-fill
              </button>
            </div>
            <div className="text-[11px] text-charcoal-600 font-mono space-y-0.5 bg-white p-2.5 rounded border border-sand-200">
              <div>
                User: <span className="text-walnut-950 font-bold">admin@alishan.demo</span>
              </div>
              <div>
                Pass: <span className="text-walnut-950 font-bold">alishan2026</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/"
              className="text-xs text-charcoal-500 hover:text-walnut-900 font-medium transition-colors"
            >
              ← Return to Showroom Catalogue
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="border-t border-sand-200 py-4 px-4 text-center text-xs text-charcoal-400">
        <p>
          ALISHAN FURNITURES Management Portal &bull; Protected Showroom Interface &bull; Fictional Demo
        </p>
      </footer>
    </div>
  );
};
