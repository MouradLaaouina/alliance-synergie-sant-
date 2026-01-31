import React from 'react';
import { BRANDS } from '../constants';
import { ExternalLink, Star, ChevronRight, Instagram } from 'lucide-react';
import SEO from './SEO';
import PartnershipCTA from './PartnershipCTA';

const Brands = () => {
  return (
    <div className="pb-16 md:pb-24 bg-white">
      <SEO
        title="Marques Dermo-Cosmétiques de Prestige | Portfolio A2S"
        description="Découvrez nos marques exclusives : Sensilis, BABÉ, D-Cap, Casmara, Buccotherm. Des solutions expertes pour chaque type de peau : anti-âge, acné, peau sensible."
        keywords="Marques cosmétiques Maroc, Sensilis Maroc, Laboratoires BABÉ, D-Cap coloration, Casmara soins, Buccotherm dentifrice, cosmétique haut de gamme, routine peau acnéique, anti-âge dermatologique, cosmétique bio, crème visage dermatologique recommandée, routine soin visage peau acnéique adulte, cosmétique bio certifiée peau réactive, soin anti-âge dermatologique pharmacie, produit dermo sans parfum ni parabène"
      />
      {/* Compact Prestige Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 bg-slate-950 overflow-hidden text-center border-b border-white/5">
        {/* Mesh Gradient VFX */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.06)_0%,transparent_70%)]"></div>
          <div className="absolute inset-0 opacity-[0.08] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.06]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Star size={12} className="text-yellow-500" />
            <span>Iconic Portfolio</span>
          </div>

          <h1 className="text-balance text-3xl md:text-6xl font-bold text-white mb-6 font-serif tracking-tight leading-[1.1] animate-in fade-in slide-in-from-top-6 duration-700">
            Nos fleurons d' <span className="text-emerald-500 italic">excellence.</span>
          </h1>

          <p className="text-sm md:text-xl text-slate-300/90 font-light leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Une sélection rigoureuse des marques les plus prestigieuses, alliant science et résultats.
          </p>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
      </section>

      <div className="pt-16 md:pt-20"> {/* Optimized spacing after Hero */}


        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24 md:mb-32">
          {/* Egérie Section - Simplified & Professional Layout */}
          <div className="bg-emerald-600 rounded-[2.5rem] md:rounded-[4rem] px-8 py-5 md:px-12 md:py-8 lg:px-16 lg:py-10 text-white flex flex-col lg:flex-row items-center gap-8 lg:gap-16 shadow-2xl mb-16 md:mb-24 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

            {/* Text Content */}
            <div className="w-full lg:w-1/2 relative z-10">
              <div className="flex items-center space-x-2 mb-6">
                <Star className="text-yellow-400 fill-yellow-400" size={24} />
                <span className="font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">Égérie Nationale & Prestige</span>
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 font-serif leading-tight">Mouna Fettou : <br className="hidden md:block" /> L'élégance de la confiance.</h2>

              {/* Image Content - Visible ONLY on Mobile/Tablet between Title and Description */}
              <div className="lg:hidden mb-6">
                <div className="w-full max-w-xs mx-auto rounded-[2rem] overflow-hidden shadow-xl border border-white/20">
                  <img
                    src="images/A2S-CONF-PRESSE-MOUNA-FETTOU.webp"
                    alt="Mouna Fettou, égérie des marques A2S au Maroc"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              <p className="text-sm md:text-lg lg:text-xl text-emerald-100 mb-6 md:mb-8 leading-relaxed max-w-lg">
                Ambassadrice emblématique, élégante et intergénérationnelle, Mouna Fettou incarne parfaitement les valeurs d'excellence et de proximité de nos marques au Maroc.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 text-xs md:text-sm lg:text-base">
                <div className="border-l-2 border-white/30 pl-4 md:pl-6">
                  <p className="font-bold text-white mb-0.5">Notoriété Immédiate</p>
                  <p className="text-emerald-200">Une icône aimée par tous.</p>
                </div>
                <div className="border-l-2 border-white/30 pl-4 md:pl-6">
                  <p className="font-bold text-white mb-0.5">Crédibilité Premium</p>
                  <p className="text-emerald-200">Association d'image puissante.</p>
                </div>
              </div>
            </div>

            {/* Desktop Image Content - Visible ONLY on lg screens */}
            <div className="hidden lg:flex lg:w-1/2 justify-center relative z-10">
              <div className="w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl border border-white/20">
                <img
                  src="images/A2S-CONF-PRESSE-MOUNA-FETTOU.webp"
                  alt="Mouna Fettou, égérie des marques A2S au Maroc"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          {/* Brands Grid - Mobile-First Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {BRANDS.map((brand) => (
              <div key={brand.name} className="flex flex-col md:flex-row bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 group">
                <div className="md:w-5/12 h-64 md:h-auto overflow-hidden relative bg-white flex items-center justify-center p-6">
                  {brand.video ? (
                    <video
                      src={brand.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label={`${brand.name} présentation vidéo`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={brand.image}
                      alt={`${brand.name} - gamme de produits dermo-cosmétiques`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
                <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="h-[2px] w-8 bg-emerald-500"></div>
                    <span className="text-emerald-600 font-bold text-[10px] md:text-xs uppercase tracking-widest">Par {brand.owner}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-serif">{brand.name}</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed text-sm md:text-base">
                    {brand.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-emerald-600 transition-all group"
                    >
                      Site Officiel <ExternalLink size={14} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                    {brand.instagram && (
                      <a
                        href={brand.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-white border border-slate-200 text-slate-900 px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider hover:border-emerald-500 hover:text-emerald-600 transition-all group"
                      >
                        Instagram <Instagram size={14} className="ml-2 group-hover:scale-110 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Brand Values / Footer Context */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-slate-50 rounded-[3rem] text-center border border-slate-100">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 font-serif">Notre Engagement de Distribution</h3>
          <p className="text-slate-500 max-w-2xl mx-auto mb-10 text-sm md:text-base leading-relaxed">
            Chaque marque de notre portfolio bénéficie d'une stratégie de lancement personnalisée et d'un accompagnement terrain continu auprès des professionnels de santé.
          </p>
          <div className="flex justify-center items-center space-x-3">
            <div className="w-12 h-1.5 bg-emerald-600 rounded-full"></div>
            <div className="w-4 h-1.5 bg-slate-300 rounded-full"></div>
            <div className="w-4 h-1.5 bg-slate-300 rounded-full"></div>
          </div>
        </section>
      </div>
      <PartnershipCTA
        title="Donnez à votre marque le rayonnement qu'elle mérite"
        description="Maximisez la visibilité et la notoriété de vos produits grâce à notre expertise marketing intégrée et nos ambassadeurs de renom au Maroc."
        ctaText="Déployer votre marque avec A2S"
      />
    </div>
  );
};

export default Brands;
