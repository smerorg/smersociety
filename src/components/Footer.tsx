import { Mail, MapPin, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import smerLogo from '@/assets/smerlogo.png';

const Footer = () => {
  const quickLinks = [
    { label: 'About Us', id: 'about', anchor: 'overview' },
    { label: 'Conferences', id: 'conferences' },
    { label: 'Events', id: 'events' },
    { label: 'Our Journal', id: 'journal' },
    { label: 'Membership', id: 'membership' },
    { label: 'Contact', id: 'contact' },
  ];

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  const partnerOrganizations = [
    '',
    '',
    '',
    '',
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-50 to-white border-t border-slate-200">
      <div className="container-academic py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-31 h-28 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                <img
                  src={smerLogo}
                  alt="SMER logo"
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://i.postimg.cc/QCL5Rryn/smer-logo.png'; }}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-slate-700 font-light">
                  <p>Chennai-603202, India</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <a href="mailto:smer@sme-res.org" className="text-sm text-slate-700 hover:text-indigo-600 transition-colors font-light">
                  smer@sme-res.org
                </a>
              </div>
              
              {/* <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <a href="tel:+441234567890" className="text-sm text-slate-700 hover:text-indigo-600 transition-colors font-light">
                  +44 (0) 123 456 7890
                </a>
              </div> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      // Dispatch a navigate event that Header/Index listens for
                      document.dispatchEvent(new CustomEvent('navigate', { detail: { section: link.id, anchor: link.anchor } }));
                    }}
                    className="text-sm text-slate-700 hover:text-indigo-600 transition-colors font-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Partner Organizations */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Partners</h4>
            <ul className="space-y-2">
              {partnerOrganizations.map((org, index) => (
                <li key={index} className="text-sm text-slate-700 font-light">
                  {org}
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Connect With Us</h4>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 border-slate-300 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
                  asChild
                >
                  <a href={social.href} aria-label={social.label}>
                    <social.icon className="w-4 h-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-200 pt-8 mt-12 text-center">
          <p className="text-sm text-slate-700 font-light">
            © 2025 Society for Modern English Research (SMER). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;