import React from 'react';
import { PARTNERS } from '../constants';
import { ArrowUpRight, Globe2, CheckCircle } from 'lucide-react';
import SEO from './SEO';
import PartnershipCTA from './PartnershipCTA';

const Partners = () => {
  return (
    <div className="pb-16 md:pb-24 bg-white">
      <SEO
        title="Nos Partenaires - Confiance Mondiale"
        description="Écosystème de laboratoires internationaux d'excellence partenaires d'A2S au Maroc."
      />
      {/* Compact Prestige Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 bg-slate-950 overflow-hidden text-center border-b border-white/5">
        {/* Mesh Gradient VFX */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.06)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(6,95,70,0.08)_0%,transparent_50%)]"></div>
          <div className="absolute inset-0 opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Globe2 size={12} className="text-emerald-500" />
            <span>Alliance Internationale</span>
          </div>

          <h1 className="text-balance text-4xl md:text-6xl font-bold text-white mb-6 font-serif tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700">
            Écosystème de <span className="text-emerald-500 italic">Confiance Mondiale</span>
          </h1>

          <p className="text-base md:text-xl text-slate-300/90 font-light leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Nous bâtissons des ponts durables entre les laboratoires d'excellence et les besoins du marché marocain.
          </p>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/5 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent"></div>
      </section>

      <div className="pt-16 md:pt-20"> {/* Optimized spacing after Hero */}


        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24 md:mb-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {PARTNERS.map((lab) => (
              <div key={lab.name} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-200 hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                <div className="h-40 md:h-48 bg-slate-50 flex items-center justify-center p-8 md:p-12 border-b border-slate-100 group-hover:bg-emerald-50 transition-colors">
                  <img
                    src={lab.logo}
                    alt={`${lab.name} - logo du laboratoire partenaire`}
                    className="max-h-full max-w-full opacity-60 group-hover:opacity-100 transition-all grayscale group-hover:grayscale-0 transform group-hover:scale-110 duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-8 md:p-10 flex flex-col flex-grow">
                  <div className="flex items-center space-x-2 text-emerald-600 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4">
                    <Globe2 size={14} />
                    <span>Laboratoire {lab.origin}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 font-serif">{lab.name}</h3>
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 flex-grow">{lab.description}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Partenaire A2S</span>
                    {lab.website ? (
                      <a
                        href={lab.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-45"
                        aria-label={`Visiter le site de ${lab.name}`}
                      >
                        <ArrowUpRight size={20} />
                      </a>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                        <ArrowUpRight size={20} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-slate-950 py-20 md:py-32 border-y border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-serif leading-tight">Rejoignez l'élite du marché.</h2>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">Un écosystème conçu pour la performance et la transparence.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              <div className="bg-white/[0.03] backdrop-blur-xl p-10 md:p-14 rounded-[3rem] border border-white/10 hover:border-emerald-500/50 transition-all group">
                <h4 className="text-2xl font-bold mb-6 text-emerald-400 font-serif italic">Pour les Laboratoires</h4>
                <p className="text-slate-300 mb-8 text-lg leading-relaxed">Bénéficiez d'une maîtrise totale de la chaîne de valeur : du réglementaire à la vente finale.</p>
                <ul className="space-y-4">
                  {[
                    "Reporting sell-out mensuel ultra-précis",
                    "Gestion de stock certifiée FIFO/FEFO",
                    "Visibilité marketing nationale garantie",
                    "Coordination logistique import-export"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center text-slate-400 text-sm md:text-base">
                      <CheckCircle size={18} className="text-emerald-500 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-xl p-10 md:p-14 rounded-[3rem] border border-white/10 hover:border-emerald-500/50 transition-all group">
                <h4 className="text-2xl font-bold mb-6 text-emerald-400 font-serif italic">Pour les Pharmaciens</h4>
                <p className="text-slate-300 mb-8 text-lg leading-relaxed">Développez le potentiel de votre officine avec nos marques exclusives et nos formations.</p>
                <ul className="space-y-4">
                  {[
                    "Formations scientifiques via A2S Académie",
                    "Animations terrain par nos dermo-conseillères",
                    "Merchandising premium et outils d'aide à la vente",
                    "Livraison express et stock permanent"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center text-slate-400 text-sm md:text-base">
                      <CheckCircle size={18} className="text-emerald-500 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
      <PartnershipCTA
        title="Rejoignez notre réseau de laboratoires d'élite"
        description="Faites partie d'un écosystème sélectif où la performance rencontre l'éthique pour une réussite mutuelle et durable pour vos produits au Maroc."
        ctaText="Devenir partenaire privilégié"
      />
    </div>
  );
};

export default Partners;
