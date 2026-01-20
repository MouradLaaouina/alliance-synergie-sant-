
import React from 'react';
import { Target, Eye, ShieldCheck, Users, Globe, Building2, CheckCircle2 } from 'lucide-react';
import SEO from './SEO';

const About = () => {
  return (
    <div className="pb-16 md:pb-24 bg-white">
      <SEO
        title="À Propos - Notre Vision & Mission"
        description="Découvrez A2S, leader de la dermo-cosmétique au Maroc depuis 16 ans. Notre mission : l'excellence au service de la santé."
      />
      {/* Compact Prestige Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-40 md:pb-24 bg-slate-950 overflow-hidden text-center border-b border-emerald-500/10">
        {/* Mesh Gradient VFX */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)] blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] blur-[120px]"></div>
          <div className="absolute inset-0 opacity-[0.15] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span>Héritage & Vision</span>
          </div>

          <h1 className="text-balance text-3xl md:text-6xl font-bold text-white mb-6 font-serif tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700">
            L'excellence au service de la <span className="text-emerald-500 italic">santé au Maroc</span>.
          </h1>

          <p className="text-sm md:text-xl text-slate-300/90 font-light leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            A2S crée un pont stratégique entre l'innovation mondiale et les besoins locaux, avec une rigueur opérationnelle absolue.
          </p>
        </div>

        {/* Subtle separator line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
      </section>

      <div className="pt-16 md:pt-20"> {/* Optimized spacing after Hero */}


        {/* Content & Stats */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6 text-base md:text-lg text-slate-600 leading-relaxed order-2 lg:order-1">
              <p className="font-bold text-slate-900 text-xl md:text-2xl leading-tight">
                Depuis 16 ans, nous mettons notre expertise terrain au service des plus grands laboratoires internationaux.
              </p>
              <p>
                Notre mission est de simplifier l'accès au marché marocain pour les laboratoires internationaux les plus exigeants. Grâce à un modèle intégré unique, A2S se positionne comme le partenaire global capable d'orchestrer chaque maillon de la chaîne de valeur.
              </p>
              <p>
                De l'enregistrement réglementaire complexe à la distribution nationale sécurisée, nous gérons tout avec une rigueur absolue et une éthique sans compromis.
              </p>

              <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <div className="flex items-start space-x-4 group">
                  <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Standards Mondiaux</h4>
                    <p className="text-sm">Une exécution locale aux normes internationales.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Force Terrain</h4>
                    <p className="text-sm">Conseil expert en point de vente direct.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6 order-1 lg:order-2">
              <div className="bg-slate-900 p-6 md:p-10 rounded-2xl md:rounded-3xl text-white md:translate-y-8 shadow-xl">
                <div className="text-4xl md:text-6xl font-bold mb-4 text-emerald-500">#1</div>
                <div className="text-emerald-400 font-bold uppercase tracking-widest text-[9px] md:text-xs mb-3">Positionnement</div>
                <p className="text-xs md:text-sm text-slate-400 leading-tight">Leader marocain spécialisé en dermo-cosmétique.</p>
              </div>
              <div className="bg-emerald-600 p-6 md:p-10 rounded-2xl md:rounded-3xl text-white shadow-xl">
                <div className="text-4xl md:text-6xl font-bold mb-4">16+</div>
                <div className="text-emerald-100 font-bold uppercase tracking-widest text-[9px] md:text-xs mb-3">Expérience</div>
                <p className="text-xs md:text-sm text-emerald-100/70 leading-tight">Années de succès ininterrompu sur le marché.</p>
              </div>
              <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl border border-slate-200 shadow-xl md:translate-y-8">
                <div className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">60+</div>
                <div className="text-emerald-600 font-bold uppercase tracking-widest text-[9px] md:text-xs mb-3">Force de vente</div>
                <p className="text-xs md:text-sm text-slate-500 leading-tight">Dermo-conseillères formées quotidiennement.</p>
              </div>
              <div className="bg-slate-100 p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-inner border border-slate-200">
                <div className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">3k+</div>
                <div className="text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-xs mb-3">Couverture</div>
                <p className="text-xs md:text-sm text-slate-500 leading-tight">Officines partenaires livrées en direct.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission Cards */}
        <section className="bg-slate-50 py-16 md:py-32 border-y border-slate-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 group hover:-translate-y-2">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Target size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 font-serif">Notre Vision</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  Devenir la référence absolue et le partenaire indissociable de toute marque de dermo-cosmétique souhaitant rayonner au Maroc et en Afrique du Nord.
                </p>
              </div>
              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 group hover:-translate-y-2">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Eye size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 font-serif">Notre Mission</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  Simplifier l'implantation des laboratoires internationaux par une expertise locale sans faille et une logistique de pointe adaptée aux exigences pharmaceutiques.
                </p>
              </div>
              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 group hover:-translate-y-2">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 font-serif">Nos Valeurs</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  Éthique avant facilité, qualité avant volume, et performance avant concession. Le partenariat à long terme basé sur la confiance est notre priorité.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
