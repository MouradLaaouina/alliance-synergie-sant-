
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { PILLARS, PARTNERS, getIcon } from '../constants';
import SEO from './SEO';

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <span ref={countRef}>{count}{suffix}</span>;
};

const LuxuriousBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-slate-950">
      {/* Cinematic Base Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.15)_0%,transparent_70%)] opacity-60"></div>

      {/* Floating Silk Veils */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(16,185,129,0.1)_90deg,transparent_180deg)] animate-silk-flow-slow blur-[100px]"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05)_0%,transparent_60%)] animate-silk-flow-fast blur-[80px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[120%] h-[80%] bg-[linear-gradient(45deg,transparent,rgba(16,185,129,0.08),transparent)] -skew-y-12 animate-silk-shimmer blur-[120px]"></div>
      </div>

      {/* Emerald Luminous Ripples */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[80vw] h-[80vw] border border-emerald-500/20 rounded-full animate-lux-ripple opacity-0"></div>
        <div className="w-[80vw] h-[80vw] border border-emerald-400/10 rounded-full animate-lux-ripple-delayed opacity-0"></div>
        <div className="w-[80vw] h-[80vw] border border-emerald-500/5 rounded-full animate-lux-ripple-more-delayed opacity-0"></div>
      </div>

      {/* Magic Energy Particles (Refined) */}
      <div className="absolute inset-0 z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-emerald-400/30 rounded-full blur-[1px] animate-float-magic"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 15 + 10}s`,
              boxShadow: '0 0 15px rgba(52, 211, 153, 0.6)'
            }}
          />
        ))}
      </div>

      {/* Finishing Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(2,6,23,0.8)_100%)]"></div>
    </div>
  );
};

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const doublePartners = [...PARTNERS, ...PARTNERS];

  useEffect(() => {
    // Start entry animations
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="overflow-hidden bg-slate-50">
      <SEO
        title="Accueil - Leader Dermo-Cosmétique Maroc"
        description="A2S est votre partenaire stratégique pour la distribution et la promotion de produits dermo-cosmétiques au Maroc. Expert en conseil et réglementation."
      />
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-slate-950 pt-20 md:pt-28 pb-12">
        {/* Luxurious Background Layer */}
        <LuxuriousBackground />

        <div className="container mx-auto px-6 relative z-30">
          <div className="max-w-7xl mx-auto w-full text-center">
            {/* Contextual Badge - Ultra Refined */}
            <div className={`inline-flex items-center space-x-3 px-6 py-2.5 rounded-full bg-emerald-500/5 backdrop-blur-xl border border-emerald-400/20 text-emerald-400 text-[9px] md:text-xs font-bold uppercase tracking-[0.4em] mb-8 md:mb-10 transition-all duration-1000 transform hover:border-emerald-400/40 hover:bg-emerald-500/10 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
              <span>L'Elite de la Dermo-Cosmétique</span>
            </div>

            {/* High-Impact Hero Content */}
            <div className={`transition-all duration-1000 delay-200 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="relative mb-8 md:mb-12 inline-block group">
                {/* Prestige Halo Effect */}
                <div className="absolute -inset-12 bg-emerald-500/10 rounded-full blur-[80px] opacity-60 group-hover:opacity-100 transition-opacity duration-1000"></div>

                <img
                  src="images/A2S_logo.webp"
                  alt="A2S Excellence"
                  className="h-16 sm:h-20 md:h-28 lg:h-32 w-auto object-contain relative z-10 filter drop-shadow-[0_0_30px_rgba(16,185,129,0.3)] mx-auto animate-float-prestige transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <h1 className="text-balance text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] font-serif mb-8 tracking-tight">
                Le Leader de la distribution <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-200 to-emerald-400 italic bg-[length:200%_auto] animate-text-shine">
                  dermo-cosmétique au Maroc
                </span>
              </h1>

              <p className="text-base md:text-lg text-slate-300/80 mb-10 leading-relaxed max-w-4xl mx-auto font-light tracking-wide px-4">
                Depuis plus de 16 ans, nous bâtissons l'avenir de la beauté scientifique. <br className="hidden md:block" />
                Un pont prestigieux entre l'innovation mondiale et l'excellence locale.
              </p>
            </div>

            {/* Strategic Actions - Refined Design */}
            <div className={`flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-10 transition-all duration-1000 delay-600 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Link
                to="/a-propos"
                className="w-full sm:w-auto bg-emerald-600 text-white px-10 py-4 rounded-full font-bold text-base flex items-center justify-center transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:shadow-[0_25px_60px_rgba(16,185,129,0.5)] hover:-translate-y-1 active:scale-95 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:animate-shine-fast"></div>
                <span className="relative z-10">Découvrir l'univers A2S</span>
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform relative z-10" size={22} />
              </Link>

              <Link
                to="/expertise"
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/10 px-10 py-4 rounded-full font-bold text-base flex items-center justify-center transition-all group hover:border-emerald-500/30"
              >
                Notre Expertise Unique
                <ArrowRight className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- STRATEGIC VISION --- */}
      <section className="py-24 md:py-40 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="lg:w-1/2">
              <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs md:text-sm mb-6 block border-l-2 border-emerald-600 pl-4">Positionnement Unique</span>
              <h2 className="text-balance text-4xl md:text-6xl font-bold text-slate-900 mb-8 font-serif leading-tight">
                Le pont stratégique entre la <span className="text-emerald-600">science</span> et le <span className="text-emerald-600">terrain</span>.
              </h2>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10">
                Nous ne sommes pas de simples logisticiens. A2S déploie une ingénierie marketing et commerciale à 360°, garantissant une visibilité maximale et un sell-out performant dans plus de 3000 officines au Maroc.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 mb-12">
                <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-emerald-200 transition-all group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="text-5xl md:text-7xl font-bold text-emerald-600 mb-3 group-hover:scale-105 transition-transform origin-left relative z-10">
                    <AnimatedCounter end={16} suffix="+" />
                  </div>
                  <div className="text-xs md:text-sm text-slate-900 font-bold uppercase tracking-widest mb-1 relative z-10">Années de Succès</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide italic relative z-10">Expertise Marché Local</div>
                </div>
                <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-emerald-200 transition-all group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="text-5xl md:text-7xl font-bold text-emerald-600 mb-3 group-hover:scale-105 transition-transform origin-left relative z-10">
                    <AnimatedCounter end={60} suffix="+" />
                  </div>
                  <div className="text-xs md:text-sm text-slate-900 font-bold uppercase tracking-widest mb-1 relative z-10">Force Terrain</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide italic relative z-10">Conseillères Dédiées</div>
                </div>
              </div>

              <Link to="/a-propos" className="inline-flex items-center text-emerald-600 font-bold hover:text-emerald-700 transition-all group text-xl border-b-2 border-emerald-100 pb-1 hover:border-emerald-600">
                Notre engagement qualité <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="lg:w-1/2 relative w-full">
              <div className="relative z-10 rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.15)] aspect-[4/5] sm:aspect-video lg:aspect-[4/5] group">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"
                  alt="A2S Infrastructure de pointe"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2500ms]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-emerald-900/5 group-hover:bg-transparent transition-colors duration-1000"></div>
              </div>

              {/* Floating Performance Badge */}
              <div className="absolute -bottom-8 -left-6 md:-bottom-16 md:-left-12 bg-white/95 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] shadow-2xl z-20 max-w-[260px] border border-white/50 hidden sm:block">
                <div className="text-5xl font-bold text-slate-900 mb-2">3000+</div>
                <p className="text-xs md:text-sm font-bold text-emerald-600 uppercase tracking-widest leading-tight">Officines partenaires desservies</p>
              </div>

              {/* Abstract Background Blobs */}
              <div className="absolute -top-16 -right-16 w-80 h-80 bg-emerald-600/10 rounded-full blur-[120px] z-0 animate-pulse"></div>
              <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-slate-200 rounded-full blur-[100px] z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- EXPERTISE GRID --- */}
      <section className="py-24 md:py-48 bg-slate-950 relative overflow-hidden">
        {/* Subtle Tech Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px]"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto mb-24">
            <span className="text-emerald-400 font-bold uppercase tracking-[0.5em] text-[10px] md:text-xs mb-8 block">Ingénierie de la Distribution</span>
            <h2 className="text-balance text-4xl md:text-8xl font-bold text-white mb-10 font-serif leading-tight tracking-tight">Le savoir-faire <br className="hidden md:block" /> par excellence.</h2>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">De l'enregistrement réglementaire au pilotage de la force de vente, nous maîtrisons chaque maillon de votre succès.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
            {PILLARS.slice(0, 3).map((pillar) => (
              <div key={pillar.id} className="group bg-white/[0.03] backdrop-blur-3xl p-12 md:p-16 rounded-[4rem] border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.07] transition-all duration-700 flex flex-col hover:-translate-y-6">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-400 mb-12 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6 shadow-2xl">
                  {getIcon(pillar.icon, 48)}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 font-serif leading-tight">{pillar.title}</h3>
                <p className="text-slate-400 mb-12 text-lg md:text-xl leading-relaxed flex-grow">{pillar.description}</p>
                <Link to="/expertise" className="inline-flex items-center text-emerald-400 font-bold text-sm tracking-widest uppercase group-hover:text-white transition-colors">
                  Détails Stratégiques <ChevronRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PARTNERS LOGO MARQUEE --- */}
      <section className="py-12 md:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-6 mb-12 md:mb-16">
          <p className="text-center text-slate-400 font-bold uppercase tracking-[0.6em] text-[10px] md:text-xs mb-6">Écosystème de Confiance Mondiale</p>
          <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee py-8 flex items-center border-y border-slate-50">
            {doublePartners.map((lab, index) => (
              <div
                key={`${lab.name}-${index}`}
                className="mx-12 md:mx-20 flex flex-col items-center justify-center min-w-[140px] md:min-w-[240px] group transition-all duration-700"
              >
                <div className="h-12 md:h-20 w-auto grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 opacity-40 group-hover:opacity-100 transition-all duration-1000 transform group-hover:scale-105">
                  <img
                    src={lab.logo}
                    alt={`${lab.name} official logo`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-700">{lab.origin}</span>
              </div>
            ))}
          </div>

          {/* Edge Feathering Masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-48 md:w-96 bg-gradient-to-r from-white via-white/70 to-transparent z-10"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-48 md:w-96 bg-gradient-to-l from-white via-white/70 to-transparent z-10"></div>
        </div>
      </section>

      {/* --- CONVICTION B2B CTA --- */}
      <section className="py-40 md:py-64 bg-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-white rounded-full blur-[180px] -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[1000px] h-[1000px] bg-white rounded-full blur-[250px] translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-9xl font-bold text-white mb-12 font-serif italic tracking-tighter leading-none text-pretty">
              Rejoignez le cercle <br className="hidden md:block" /> des leaders.
            </h2>
            <p className="text-2xl md:text-4xl text-emerald-100 mb-20 max-w-4xl mx-auto font-light leading-relaxed">
              Prêt à accélérer votre croissance au Maroc avec le partenaire dermo-cosmétique n°1 ?
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-14">
              <Link
                to="/contact"
                className="w-full sm:w-auto bg-slate-900 text-white px-16 md:px-20 py-7 md:py-8 rounded-full font-bold text-2xl hover:bg-slate-800 transition-all shadow-[0_40px_100px_rgba(0,0,0,0.4)] transform hover:-translate-y-3"
              >
                Ouvrir le dialogue
              </Link>
              <Link
                to="/partenaires"
                className="w-full sm:w-auto bg-white/10 border-2 border-white/30 text-white px-16 md:px-20 py-7 md:py-8 rounded-full font-bold text-2xl hover:bg-white/20 transition-all backdrop-blur-xl transform hover:-translate-y-3"
              >
                Nos Références
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Prestige & Luxury Keyframes */}
      <style>{`
        @keyframes lux-ripple {
          0% { transform: scale(0.1); opacity: 0; }
          20% { opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes silk-flow-slow {
          0% { transform: translate(-10%, -10%) rotate(0deg) scale(1); }
          50% { transform: translate(5%, 5%) rotate(5deg) scale(1.1); }
          100% { transform: translate(-10%, -10%) rotate(0deg) scale(1); }
        }
        @keyframes silk-flow-fast {
          0% { transform: translate(10%, 10%) rotate(0deg); }
          50% { transform: translate(-5%, -5%) rotate(-5deg); }
          100% { transform: translate(10%, 10%) rotate(0deg); }
        }
        @keyframes silk-shimmer {
          0% { opacity: 0.3; transform: skewY(-12deg) translateY(0); }
          50% { opacity: 0.5; transform: skewY(-14deg) translateY(20px); }
          100% { opacity: 0.3; transform: skewY(-12deg) translateY(0); }
        }
        @keyframes float-magic {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-100px) translateX(20px) scale(0.5); opacity: 0; }
        }
        @keyframes float-prestige {
          0%, 100% { transform: translateY(0) scale(1.0); }
          50% { transform: translateY(-20px) scale(1.02); }
        }
        @keyframes text-shine {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes shine-fast {
          0% { transform: skewX(-12deg) translateX(-100%); }
          100% { transform: skewX(-12deg) translateX(200%); }
        }
        .animate-lux-ripple {
          animation: lux-ripple 6s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
        }
        .animate-lux-ripple-delayed {
          animation: lux-ripple 6s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite 2s;
        }
        .animate-lux-ripple-more-delayed {
          animation: lux-ripple 6s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite 4s;
        }
        .animate-silk-flow-slow {
          animation: silk-flow-slow 20s ease-in-out infinite;
        }
        .animate-silk-flow-fast {
          animation: silk-flow-fast 15s ease-in-out infinite;
        }
        .animate-silk-shimmer {
          animation: silk-shimmer 10s ease-in-out infinite;
        }
        .animate-float-magic {
          animation: float-magic linear infinite;
        }
        .animate-float-prestige {
          animation: float-prestige 6s ease-in-out infinite;
        }
        .animate-text-shine {
          animation: text-shine 5s linear infinite;
        }
        .animate-shine-fast {
          animation: shine-fast 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
