
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { PILLARS, PARTNERS, getIcon } from '../constants';
import SEO from './SEO';
import PartnershipCTA from './PartnershipCTA';

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updatePreference);
      return () => mediaQuery.removeEventListener('change', updatePreference);
    }

    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  return prefersReducedMotion;
};

const AnimatedCounter = ({
  end,
  duration = 2000,
  suffix = "",
  prefersReducedMotion = false,
}: {
  end: number;
  duration?: number;
  suffix?: string;
  prefersReducedMotion?: boolean;
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const node = countRef.current;
    if (node) {
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isVisible) return;

    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    let startTime: number | null = null;
    let rafId = 0;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isVisible, end, duration, prefersReducedMotion]);

  return <span ref={countRef}>{count}{suffix}</span>;
};

const LuxuriousBackground = ({ prefersReducedMotion }: { prefersReducedMotion: boolean }) => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-slate-950" aria-hidden="true">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18)_0%,transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.06)_0%,transparent_40%),linear-gradient(180deg,#020617_0%,#020617_60%,#000000_100%)]"></div>

      {/* Soft aurora glow */}
      <div
        className="absolute -top-1/4 right-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.14)_0%,transparent_65%)] blur-[120px] opacity-70"
      ></div>

      {/* Subtle grain */}
      <div className="absolute inset-0 opacity-[0.06] mix-blend-soft-light [background-image:radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:3px_3px]"></div>

      {/* Finishing vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,transparent_30%,rgba(2,6,23,0.85)_100%)]"></div>
    </div>
  );
};

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const doublePartners = useMemo(() => [...PARTNERS, ...PARTNERS], []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsLoaded(true);
      return;
    }

    setIsLoaded(true);
  }, [prefersReducedMotion]);

  return (
    <div className="overflow-hidden bg-slate-50">
      <SEO
        title="Expertise Dermo-Cosmétique au Maroc | Conseil & Distribution"
        description="Leader de la distribution dermo-cosmétique au Maroc depuis 16 ans. A2S est le partenaire stratégique pour la promotion, le réglementaire et la force de vente pharmaceutique."
        keywords="Dermo-cosmétique Maroc, distribution pharmaceutique Maroc, conseil santé, promotion cosmétique, leader dermo-cosmétique, soins dermatologiques, routine soin visage, peau sensible, partenaire stratégique laboratoires Maroc, enregistrement réglementaire santé, soin dermo-cosmétique fabriqué en france, dermatological skincare uae, trattamenti dermocosmetici italia, cuidado dermocosmético españa, dermo-cosmétique recommandée dermatologue"
      />
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-slate-950 pt-20 md:pt-28 pb-12">
        {/* Luxurious Background Layer */}
        <LuxuriousBackground prefersReducedMotion={prefersReducedMotion} />

        <div className="container mx-auto px-6 relative z-30">
          <div className="max-w-7xl mx-auto w-full text-center">
            {/* Contextual Badge - Ultra Refined */}
            <div className="inline-flex items-center space-x-3 px-6 py-2.5 rounded-full bg-emerald-500/5 backdrop-blur-xl border border-emerald-400/20 text-emerald-400 text-[9px] md:text-xs font-bold uppercase tracking-[0.4em] mb-8 md:mb-10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span>L'Elite de la Dermo-Cosmétique</span>
            </div>

            {/* High-Impact Hero Content */}
            <div className="opacity-100 translate-y-0">
              <div className="relative mb-8 md:mb-12 inline-block group">
                {/* Prestige Halo Effect */}
                <div className="absolute -inset-12 bg-white/10 rounded-full blur-[80px] opacity-60"></div>

                <img
                  src="images/A2S-Logo-white.webp"
                  alt="A2S - Alliance Synergie Santé, logo blanc"
                  width={220}
                  height={128}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="h-16 sm:h-20 md:h-28 lg:h-32 w-auto object-contain relative z-10 filter drop-shadow-[0_0_30px_rgba(16,185,129,0.3)] mx-auto"
                />
              </div>

              <h1 className="text-balance text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] font-serif mb-6 md:mb-8 tracking-tight">
                Le Leader de la distribution <br className="hidden md:block" />
                <span className="text-emerald-500 italic">
                  dermo-cosmétique au Maroc
                </span>
              </h1>

              <p className="text-sm md:text-lg text-slate-300/80 mb-8 md:mb-10 leading-relaxed max-w-4xl mx-auto font-light tracking-wide px-4">
                Depuis plus de 16 ans, nous bâtissons l'avenir de la beauté scientifique. <br className="hidden md:block" />
                Un pont prestigieux entre l'innovation mondiale et l'excellence locale.
              </p>

              {/* Strategic Actions - Refined Design */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-10">
                <Link
                  to="/a-propos"
                  className="w-full sm:w-auto bg-emerald-600 text-white px-10 py-4 rounded-full font-bold text-base flex items-center justify-center transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:shadow-[0_25px_60px_rgba(16,185,129,0.5)] hover:-translate-y-1 active:scale-95 group relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full ${prefersReducedMotion ? '' : 'group-hover:animate-shine-fast'}`}></div>
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
        </div>
      </section>

      {/* --- STRATEGIC VISION --- */}
      <section className="py-24 md:py-40 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="lg:w-1/2">
              <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs md:text-sm mb-6 block border-l-2 border-emerald-600 pl-4">Positionnement Unique</span>
              <h2 className="text-balance text-3xl md:text-6xl font-bold text-slate-900 mb-6 md:mb-8 font-serif leading-tight">
                Le pont stratégique entre la <span className="text-emerald-600">science</span> et le <span className="text-emerald-600">terrain</span>.
              </h2>
              <p className="text-base md:text-xl text-slate-600 leading-relaxed mb-8 md:mb-10">
                Nous ne sommes pas de simples logisticiens. A2S déploie une ingénierie marketing et commerciale à 360°, garantissant une visibilité maximale et un sell-out performant dans plus de 3000 officines au Maroc.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 mb-12">
                <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-emerald-200 transition-all group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="text-5xl md:text-7xl font-bold text-emerald-600 mb-3 group-hover:scale-105 transition-transform origin-left relative z-10">
                    <AnimatedCounter end={16} suffix="+" prefersReducedMotion={prefersReducedMotion} />
                  </div>
                  <div className="text-xs md:text-sm text-slate-900 font-bold uppercase tracking-widest mb-1 relative z-10">Années de Succès</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide italic relative z-10">Expertise Marché Local</div>
                </div>
                <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-emerald-200 transition-all group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="text-5xl md:text-7xl font-bold text-emerald-600 mb-3 group-hover:scale-105 transition-transform origin-left relative z-10">
                    <AnimatedCounter end={60} suffix="+" prefersReducedMotion={prefersReducedMotion} />
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
                  src="images/slow.webp"
                  alt="Équipe A2S en action sur le terrain au Maroc"
                  width={720}
                  height={900}
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
            <h2 className="text-balance text-4xl md:text-7xl font-bold text-white mb-10 font-serif leading-tight tracking-tight">Le savoir-faire <br className="hidden md:block" /> par excellence.</h2>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">De l'enregistrement réglementaire au pilotage de la force de vente, nous maîtrisons chaque maillon de votre succès.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
            {PILLARS.slice(0, 3).map((pillar) => (
              <div key={pillar.id} className="group bg-white/[0.03] backdrop-blur-3xl p-12 md:p-16 rounded-[4rem] border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.07] transition-colors duration-300 flex flex-col">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-400 mb-12 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-200 shadow-2xl">
                  {getIcon(pillar.icon, 48)}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 font-serif leading-tight">{pillar.title}</h3>
                <p className="text-slate-400 mb-12 text-lg md:text-xl leading-relaxed flex-grow">{pillar.description}</p>
                <Link to="/expertise" className="inline-flex items-center text-emerald-400 font-bold text-sm tracking-widest uppercase group-hover:text-white transition-colors">
                  Détails Stratégiques <ChevronRight size={20} className="ml-2" />
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
          <div className="animate-marquee py-8 flex items-center border-y border-slate-50 will-change-transform">
            {doublePartners.map((lab, index) => (
              <div
                key={`${lab.name}-${index}`}
                className="mx-12 md:mx-20 flex flex-col items-center justify-center min-w-[140px] md:min-w-[240px] group transition-all duration-700"
              >
                <div className="h-12 md:h-20 w-auto grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 opacity-40 group-hover:opacity-100 transition-all duration-1000 transform group-hover:scale-110">
                  <img
                    src={lab.logo}
                    alt={`${lab.name} - logo du laboratoire partenaire`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className="mt-4 text-[10px] font-bold text-emerald-600/60 uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-700">{lab.origin}</span>
              </div>
            ))}
          </div>

          {/* Edge Feathering Masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-48 md:w-96 bg-gradient-to-r from-white via-white/70 to-transparent z-10"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-48 md:w-96 bg-gradient-to-l from-white via-white/70 to-transparent z-10"></div>
        </div>
      </section>

      {/* --- CONVICTION B2B CTA --- */}
      <section className="py-16 md:py-24 bg-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-white rounded-full blur-[180px] -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[1000px] h-[1000px] bg-white rounded-full blur-[250px] translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 font-serif italic tracking-tighter leading-none text-pretty">
              Rejoignez le cercle <br className="hidden md:block" /> des leaders.
            </h2>
            <p className="text-sm md:text-lg text-slate-300/80 mb-8 md:mb-10 leading-relaxed max-w-4xl mx-auto font-light tracking-wide px-4">
              Depuis plus de 16 ans, nous bâtissons l'avenir de la beauté scientifique. <br className="hidden md:block" />
              Un pont prestigieux entre l'innovation mondiale et l'excellence locale.
            </p>
            <p className="text-base md:text-lg text-emerald-100 mb-10 max-w-4xl mx-auto font-light leading-relaxed">
              Prêt à accélérer votre croissance au Maroc avec le partenaire dermo-cosmétique n°1 ?
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <Link
                to="/contact"
                className="w-full sm:w-auto bg-slate-900 text-white px-10 md:px-12 py-4 md:py-5 rounded-full font-bold text-lg md:text-xl hover:bg-slate-800 transition-all shadow-[0_30px_80px_rgba(0,0,0,0.35)] transform hover:-translate-y-2"
              >
                Ouvrir le dialogue
              </Link>
              <Link
                to="/partenaires"
                className="w-full sm:w-auto bg-white/10 border-2 border-white/30 text-white px-10 md:px-12 py-4 md:py-5 rounded-full font-bold text-lg md:text-xl hover:bg-white/20 transition-all backdrop-blur-xl transform hover:-translate-y-2"
              >
                Nos Références
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PartnershipCTA
        title="Prêt à conquérir le marché marocain ?"
        description="Rejoignez l'écosystème leader en dermo-cosmétique et accélérez votre pénétration commerciale avec un partenaire stratégique de confiance au Maroc."
        ctaText="Initier un partenariat à succès"
      />

      {/* Hero Prestige & Luxury Keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes aurora-drift {
          0% { transform: translate(-6%, -4%) rotate(0deg) scale(1); opacity: 0.5; }
          50% { transform: translate(4%, 4%) rotate(6deg) scale(1.05); opacity: 0.7; }
          100% { transform: translate(-6%, -4%) rotate(0deg) scale(1); opacity: 0.5; }
        }
        @keyframes text-shine {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes shine-fast {
          0% { transform: skewX(-12deg) translateX(-100%); }
          100% { transform: skewX(-12deg) translateX(200%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
          display: flex;
          width: max-content;
        }
        .animate-aurora-drift-slow {
          animation: aurora-drift 40s ease-in-out infinite;
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
