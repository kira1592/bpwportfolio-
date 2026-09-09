import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { TabNavigation } from '../components/TabNavigation';
import { PortfolioSection } from '../components/PortfolioSection';
import { ServicesSection } from '../components/ServicesSection';
import { ContactSection } from '../components/ContactSection';
import { TabKey } from '../types';

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabKey | null;

  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    if (tabParam && ['portfolio', 'services', 'contact'].includes(tabParam)) {
      return tabParam;
    }
    return 'portfolio';
  });

  useEffect(() => {
    if (tabParam && ['portfolio', 'services', 'contact'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (newTab: TabKey) => {
    setActiveTab(newTab);
    setSearchParams(newTab === 'portfolio' ? {} : { tab: newTab });
  };

  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <Hero />

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Tab Views */}
      <main id="main-content">
        {activeTab === 'portfolio' && <PortfolioSection />}
        {activeTab === 'services' && <ServicesSection />}
        {activeTab === 'contact' && <ContactSection />}
      </main>
    </div>
  );
};
