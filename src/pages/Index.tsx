import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import JournalsSection from '@/components/sections/JournalsSection';
import { useEffect } from 'react';
import EventsSection from '@/components/sections/EventsSection';

import ContactSection from '@/components/sections/ContactSection';
import GallerySection from '@/components/sections/GallerySection';
import MembershipSection from '@/components/sections/MembershipSection';
import AdminPanel from '@/components/sections/AdminPanel';
import MembersScreen from '@/components/sections/MembersScreen';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handler = (e: Event) => {
      // CustomEvent with detail { section, anchor }
      const ce = e as CustomEvent;
      if (ce?.detail && typeof ce.detail.section === 'string') {
        const { section, anchor } = ce.detail as { section: string; anchor?: string };
        setActiveSection(section);
        if (anchor) {
          setTimeout(() => {
            const el = document.getElementById(anchor);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 120);
        }
      }
    };

    document.addEventListener('navigate', handler as EventListener);
    return () => document.removeEventListener('navigate', handler as EventListener);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HeroSection />;
      case 'about':
        return <AboutSection />;
      case 'conferences':
        return <EventsSection />;
      case 'events':
        return <GallerySection />;
      case 'membership':
        return <MembershipSection />;
      case 'members':
        return <MembersScreen />;
      case 'admin':
        return <AdminPanel />;
      case 'journal':
        return <JournalsSection />;
      case 'gallery':
        return <GallerySection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <HeroSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeSection={activeSection} onSectionChange={setActiveSection} />
      <main>
        {renderSection()}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
