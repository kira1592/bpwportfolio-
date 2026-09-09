import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, AlertCircle, ShieldAlert } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminLoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  const { login, adminStatus } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage('Please enter the admin password');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await login(password);
    setIsLoading(false);

    if (res.success) {
      navigate('/admin/projects');
    } else {
      setErrorMessage(res.error || 'Authentication failed');
      if (res.lockoutSeconds) {
        setLockoutTime(res.lockoutSeconds);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between selection:bg-neutral-900 selection:text-white px-4 py-8">
      {/* Top Bar Back Link */}
      <div className="w-full max-w-md mx-auto flex justify-start">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      {/* Login Box */}
      <div className="w-full max-w-sm mx-auto my-auto">
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="w-10 h-10 bg-neutral-100 border border-neutral-200/80 rounded-xl flex items-center justify-center mx-auto text-neutral-900">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Admin Editor
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              Enter master password to manage portfolio projects
            </p>
          </div>

          {/* Error / Lockout Alert */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {lockoutTime ? (
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <p className="font-semibold">{errorMessage}</p>
                {lockoutTime && (
                  <p className="text-[11px] text-red-600 opacity-90">
                    Rate limit triggered to prevent unauthorized access.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-600"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  autoFocus
                  disabled={isLoading || Boolean(lockoutTime)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || Boolean(lockoutTime)}
              className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Log In to Dashboard</span>
              )}
            </button>
          </form>

          {/* Setup note if hash not set */}
          {adminStatus && !adminStatus.passwordHashConfigured && (
            <div className="pt-2 border-t border-neutral-100 text-center">
              <p className="text-[11px] text-neutral-400">
                Initial demo mode: <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-700">admin123</code>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-neutral-400">
        Portfolio Admin System
      </div>
    </div>
  );
};
