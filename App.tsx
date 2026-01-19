
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, Mail, Phone, MapPin, Linkedin, Globe, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Expertise from './pages/Expertise';
import Partners from './pages/Partners';
import Brands from './pages/Brands';
import Contact from './pages/Contact';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'A propos', path: '/a-propos' },
    { name: 'Expertises', path: '/expertise' },
    { name: 'Laboratoires', path: '/partenaires' },
    { name: 'Marques', path: '/marques' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`fixed w-full z-[1000] transition-all duration-500 ${scrolled || isOpen ? 'bg-white shadow-lg py-3' : 'bg-transparent py-4 md:py-6'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 md:space-x-4 group">
          <img
            src="images/A2S_logo.webp"
            alt="A2S Logo"
            className="h-10 md:h-14 w-auto object-contain transition-all transform group-hover:scale-105"
          />
          <div className="hidden lg:block">
            <span className={`block font-bold text-sm md:text-xl leading-none transition-colors ${scrolled || isOpen ? 'text-slate-900' : 'text-white'}`}>Alliance Synergie Santé</span>
            <span className={`text-[7px] md:text-[9px] uppercase tracking-[0.2em] font-bold block mt-1 transition-colors ${scrolled || isOpen ? 'text-emerald-600' : 'text-emerald-300'}`}>Conseil - Promotion - Distribution</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold tracking-wide hover:text-emerald-500 transition-colors relative group ${location.pathname === link.path
                ? (scrolled ? 'text-emerald-600' : 'text-emerald-400')
                : (scrolled ? 'text-slate-700' : 'text-white')
                }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full ${location.pathname === link.path ? 'w-full' : ''}`}></span>
            </Link>
          ))}
          <Link to="/contact" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-lg">
            Partenariat
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 focus:outline-none transition-colors relative z-[101]"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} className="text-slate-900" /> : <Menu size={28} className={scrolled ? 'text-emerald-600' : 'text-white'} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 bg-white z-[99] transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-24 pb-12 px-6 overflow-y-auto">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-2xl font-bold py-4 border-b border-slate-100 flex justify-between items-center transition-colors ${location.pathname === link.path ? 'text-emerald-600' : 'text-slate-800'
                  }`}
              >
                {link.name}
                <ChevronRight size={20} className={location.pathname === link.path ? 'text-emerald-600' : 'text-slate-300'} />
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link
              to="/contact"
              className="block w-full bg-emerald-600 text-white text-center py-4 rounded-xl font-bold text-lg shadow-lg"
            >
              Devenir Partenaire
            </Link>
          </div>
          <div className="mt-auto pt-12 flex justify-center space-x-8 text-slate-400 border-t border-slate-100">
            <a href="#" className="hover:text-emerald-600 transition-colors"><Linkedin size={24} /></a>
            <a href="#" className="hover:text-emerald-600 transition-colors"><Globe size={24} /></a>
            <a href="#" className="hover:text-emerald-600 transition-colors"><Mail size={24} /></a>
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 pt-12 pb-8">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-slate-800 pb-16">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <img
              src="images/A2S_logo.webp"
              alt="A2S Logo"
              className="h-8 md:h-12 w-auto brightness-0 invert"
            />
            <div>
              <span className="block font-bold text-base text-white leading-none">Alliance Synergie Santé</span>
              <span className="text-[7px] uppercase tracking-[0.16em] text-emerald-500 font-bold block mt-1">Conseil - Promotion - Distribution</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-sm">
            Votre Partenaire Stratégique Santé.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="https://www.linkedin.com/company/a2smaroc/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-all transform hover:scale-110" aria-label="LinkedIn">
              <Linkedin size={18} className="text-white" />
            </a>
            <a href="https://www.facebook.com/alliancesynergiesanteofficiel" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-all transform hover:scale-110" aria-label="Facebook">
              <Facebook size={18} className="text-white" />
            </a>
            <a href="https://www.instagram.com/a2s.maroc.officiel" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-all transform hover:scale-110" aria-label="Instagram">
              <Instagram size={18} className="text-white" />
            </a>
            <a href="https://www.youtube.com/c/AllianceSynergieSant%C3%A9" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-all transform hover:scale-110" aria-label="Youtube">
              <Youtube size={18} className="text-white" />
            </a>
            <a href="https://x.com/A2sSante" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-all transform hover:scale-110" aria-label="X (Twitter)">
              <Twitter size={18} className="text-white" />
            </a>
            <a href="https://www.tiktok.com/@a2s.officiel" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-all transform hover:scale-110" aria-label="TikTok">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
              </svg>
            </a>
          </div>
        </div>

        <div className="lg:pl-12">
          <h4 className="text-white font-bold mb-6 text-base uppercase tracking-wider">Navigation</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/a-propos" className="hover:text-emerald-400 transition-colors">Qui sommes-nous ?</Link></li>
            <li><Link to="/expertise" className="hover:text-emerald-400 transition-colors">Nos expertises</Link></li>
            <li><Link to="/partenaires" className="hover:text-emerald-400 transition-colors">Nos partenaires</Link></li>
            <li><Link to="/marques" className="hover:text-emerald-400 transition-colors">Marques distribuées</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Nous contacter</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-base uppercase tracking-wider">Expertises</h4>
          <ul className="space-y-4 text-sm">
            <li>Réglementaire & Enregistrement</li>
            <li>Logistique & Distribution</li>
            <li>Force de frappe terrain</li>
            <li>A2S Académie</li>
            <li>Marketing Intégré</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-base uppercase tracking-wider">Siège Social</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start space-x-3">
              <MapPin size={18} className="text-emerald-500 flex-shrink-0" />
              <span>145 Bd Hassan II,<br />Casablanca 20000, Maroc</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={18} className="text-emerald-500 flex-shrink-0" />
              <span>+212 5 22 37 35 50</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={18} className="text-emerald-500 flex-shrink-0" />
              <span>contact@a2s.ma</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 flex flex-col md:flex-row justify-between items-center text-[10px] text-center md:text-left space-y-4 md:space-y-0 opacity-80">
        <div className="space-y-1 md:space-y-0 md:flex md:items-center md:space-x-4">
          <p>© {new Date().getFullYear()} Alliance Synergie Santé (A2S).</p>
          <span className="hidden md:block text-slate-700">|</span>
          <p>Développé par <span className="text-white font-medium">Mourad LAAOUINA</span></p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
          <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
          <a href="#" className="hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/expertise" element={<Expertise />} />
            <Route path="/partenaires" element={<Partners />} />
            <Route path="/marques" element={<Brands />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}
