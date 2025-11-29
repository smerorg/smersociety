import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import smerLogo from '@/assets/smerlogo.png';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Header = ({ activeSection, onSectionChange }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { id: 'home', label: 'Home' },
    { 
      id: 'about', 
      label: 'About',
      subitems: [
        { id: 'vision-mission', label: 'Vision and Mission' },
        { id: 'history', label: 'History & Establishment' },
        { id: 'leadership', label: 'Leadership & Governance' },
        { id: 'collaborators', label: 'Our Institutional Collaborators' },
        { id: 'advisory-board', label: 'Advisory Board & Scientific Committee' },
        { id: 'members', label: 'Our Active Members' }
      ]
    },
    { id: 'conferences', label: 'Conferences' },
    { id: 'events', label: 'Events' },
    { id: 'journal', label: 'Journal' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const secondaryNavItems = [
    { id: 'members', label: 'Members' },
  ];

  const handleNavClick = (sectionId: string, anchorId?: string) => {
    // Set the active section (e.g. 'about', 'home', etc.)
    onSectionChange(sectionId);
    setMobileMenuOpen(false);

    // If an anchor (sub-section) was provided, navigate to it after the section renders
    if (anchorId) {
      // Use a small timeout to allow the new section to mount
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // fallback: update the hash so the browser tries to jump
          window.location.hash = `#${anchorId}`;
        }
      }, 80);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="container-academic">
        {/* Row 1: Full Form (Centered & Bold) */}
        <div className="flex items-center justify-center py-2 border-b border-slate-100">
          <h1 className="smer-title text-4xl font-bold text-slate-900 text-center">Society for Modern English Research</h1>
        </div>

        {/* Row 2: Logo & Navigation Menu */}
        <div className="flex items-center justify-between py-1 gap-6">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 -mt-2">   
            <button
              onClick={() => handleNavClick('home')}
              aria-label="Go to home"
              className="w-31 h-28 rounded-lg overflow-hidden flex items-center justify-center p-0 focus:outline-none focus:ring-2 focus:ring-ring hover:scale-105 transition-transform duration-300 flex-shrink-0"
            >
              {/* SMER Logo */}
              <img
                src={smerLogo}
                alt="SMER logo"
                className="w-full h-full object-contain"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://i.postimg.cc/QCL5Rryn/smer-logo.png'; }}
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                {mainNavItems.map((item) => (
                  <NavigationMenuItem key={item.id}>
                    {item.subitems ? (
                      <>
                        <NavigationMenuTrigger 
                          className={`px-3 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100 focus:bg-slate-100 focus:outline-none data-[active]:bg-slate-100 data-[state=open]:bg-slate-100 ${
                            (item.id === activeSection || (item.subitems && typeof window !== 'undefined' && item.subitems.some(sub => window.location.hash === `#${sub.id}`))) ? 'bg-slate-200 text-slate-900' : 'text-slate-700'
                          }`}
                        >
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="w-[280px] p-3 bg-white rounded-md shadow-lg border border-slate-200">
                            <div className="grid gap-1">
                              {item.subitems.map((subitem) => (
                                <NavigationMenuLink
                                  key={subitem.id}
                                  className={`block px-3 py-2 text-sm font-semibold rounded-md transition-colors hover:bg-slate-100 cursor-pointer ${
                                    (activeSection === subitem.id || (typeof window !== 'undefined' && window.location.hash === `#${subitem.id}`)) ? 'bg-slate-100 text-slate-900' : 'text-slate-700'
                                  }`}
                                  onClick={() => handleNavClick(item.id, subitem.id)}
                                >
                                  {subitem.label}
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNavClick(item.id)}
                        className={`px-2 py-1 text-sm font-semibold transition-colors ${
                          activeSection === item.id 
                            ? 'bg-slate-200 text-slate-900' 
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {item.label}
                      </Button>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Secondary Navigation & CTA */}
          <div className="hidden lg:flex items-center space-x-2">
            {secondaryNavItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-semibold transition-colors px-2 py-1 ${
                  activeSection === item.id
                    ? 'text-slate-900 bg-slate-100'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </Button>
            ))}
            <Button 
              variant="default"
              size="sm"
              onClick={() => handleNavClick('membership')}
              className="text-sm font-semibold px-4 py-1 bg-amber-700 hover:bg-amber-800 text-white"
            >
              Become a Member
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border bg-background">
            <nav className="flex flex-col space-y-2">
              {mainNavItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'nav-active' : 'ghost'}
                  className="justify-start font-semibold"
                  onClick={() => handleNavClick(item.id)}
                >
                  {item.label}
                </Button>
              ))}
              <div className="pt-4 border-t border-border mt-4">
                {secondaryNavItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="justify-start text-muted-foreground w-full font-semibold"
                    onClick={() => handleNavClick(item.id)}
                  >
                    {item.label}
                  </Button>
                ))}
                <Button 
                  variant="default"
                  className="mt-4 w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold"
                  onClick={() => handleNavClick('membership')}
                >
                  Become a Member
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;