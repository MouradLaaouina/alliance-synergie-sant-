
import React from 'react';
import { BRANDS } from '../constants';
import { ExternalLink, Star, ChevronRight, Instagram } from 'lucide-react';
import SEO from './SEO';

const Brands = () => {
  return (
    <div className="pb-16 md:pb-24 bg-white">
      <SEO
        title="Marques Distribuées - Sélection Prestige"
        description="Découvrez notre portfolio de marques prestigieuses : Égérie, Sensilis, BABÉ, D-Cap, D-White et plus."
      />
      {/* Compact Prestige Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-40 md:pb-24 bg-slate-950 overflow-hidden text-center border-b border-white/5">
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
          {/* Egérie Section - Adaptive Layout */}
          <div className="bg-emerald-600 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 lg:p-24 text-white relative overflow-hidden mb-16 md:mb-24 shadow-2xl">
            <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full">
              <video
                src="images/Egere_national.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover opacity-30 lg:opacity-60 mix-blend-overlay lg:mix-blend-normal"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-600 via-emerald-600/50 to-transparent lg:hidden"></div>
            </div>
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center space-x-2 mb-6">
                <Star className="text-yellow-400 fill-yellow-400" size={24} />
                <span className="font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">Égérie Nationale & Prestige</span>
              </div>
              <h2 className="text-3xl md:text-6xl font-bold mb-6 md:mb-8 font-serif leading-tight">Mouna Fettou : <br className="hidden md:block" /> L'élégance de la confiance.</h2>
              <p className="text-base md:text-xl text-emerald-100 mb-8 md:mb-10 leading-relaxed max-w-lg">
                Ambassadrice emblématique, élégante et intergénérationnelle, Mouna Fettou incarne parfaitement les valeurs d'excellence et de proximité de nos marques au Maroc.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 text-sm md:text-base">
                <div className="border-l-2 border-white/30 pl-6 group">
                  <p className="font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">Notoriété Immédiate</p>
                  <p className="text-emerald-200 text-sm">Une icône aimée par toutes les générations de femmes marocaines.</p>
                </div>
                <div className="border-l-2 border-white/30 pl-6 group">
                  <p className="font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">Crédibilité Premium</p>
                  <p className="text-emerald-200 text-sm">Une association d'image puissante pour des lancements réussis.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Brands Grid - Mobile-First Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {BRANDS.map((brand) => (
              <div key={brand.name} className="flex flex-col md:flex-row bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 group">
                <div className="md:w-5/12 h-64 md:h-auto overflow-hidden relative">
                  {brand.video ? (
                    <video
                      src={brand.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                  ) : (
                    <img
                      src={brand.image}
                      alt={`${brand.name} Product`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      loading="lazy"
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
    </div>
  );
};

export default Brands;
