import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ArrowUpRight, FolderGit2, ShieldCheck, Briefcase } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection?: 'projects' | 'settings';
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeSection = 'projects' }) => {
  const { logout, adminStatus } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 flex flex-col justify-between selection:bg-neutral-900 selection:text-white">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#fafafa]/90 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="text-sm sm:text-base font-bold tracking-tight text-neutral-900 hover:text-black transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-neutral-900" />
              <span>Admin Editor</span>
            </Link>

            {/* GitHub Sync Status Badge */}
            {adminStatus?.githubConfigured ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium bg-neutral-100 text-neutral-800 border border-neutral-200/80 rounded-full">
                <FolderGit2 className="w-3 h-3 text-neutral-700" />
                <span>GitHub Connected ({adminStatus.githubBranch})</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200/80 rounded-full">
                <ShieldCheck className="w-3 h-3 text-neutral-500" />
                <span>Local Mode (Direct File Sync)</span>
              </span>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/admin/projects"
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeSection === 'projects'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Projects</span>
            </Link>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 border border-neutral-200/70 rounded-lg transition-colors"
            >
              <span>View Site</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-400" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50/60 border border-transparent rounded-lg transition-colors"
              title="Log out of Admin Editor"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-neutral-200/80 py-6 text-center text-xs text-neutral-400">
        <div className="max-w-5xl mx-auto px-4">
          <p>Portfolio Admin System • Secure Server-Side Sync</p>
        </div>
      </footer>
    </div>
  );
};
