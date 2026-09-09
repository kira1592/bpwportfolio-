import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-[#fafafa] text-neutral-900 flex flex-col justify-between selection:bg-neutral-900 selection:text-white">
        {/* Main constrained container: editorial layout */}
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/project/:slug" element={<ProjectDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Footer Component */}
          <Footer />
        </div>
      </div>
    </HashRouter>
  );
}
