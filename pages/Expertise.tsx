import React, { useState } from 'react';
import { getIcon, PILLARS } from '../constants';
import { analyzeStrategyLocally, AnalysisResult } from '../strategyEngine';
import { Sparkles, Loader2, Send, CheckCircle2, TrendingUp, Award } from 'lucide-react';
import SEO from './SEO';
import PartnershipCTA from './PartnershipCTA';

const Expertise = () => {
  const [labInput, setLabInput] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculateSynergy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!labInput.trim()) return;

    setIsLoading(true);
    // Simulate a short calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    const result = analyzeStrategyLocally(labInput);
    setAnalysis(result);
    setIsLoading(false);
  };

  return (
    <div className="pb-16 md:pb-24 bg-white">
      <SEO
        title="Expertise & Ingénierie Dermo-Cosmétique | A2S Maroc"
        description="Maîtrise complète de la chaîne de valeur : enregistrement réglementaire, logistique pharmaceutique, force de vente terrain et marketing stratégique au Maroc."
        keywords="Réglementation pharmaceutique Maroc, enregistrement dermo-cosmétique, marketing santé Maroc, logistique pharmaceutique Casablanca, force de vente dermo, A2S Académie, formation dermo-conseillère, audit marché santé, startup dermo-cosmétique innovation santé, fabricant cosmétique certifié iso france, sous-traitant formulation cosmétique, recherche et développement cosmétique italie"
      />
      {/* Compact Prestige Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 bg-slate-950 overflow-hidden text-center border-b border-white/5">
        {/* Mesh Gradient VFX */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-[-10%] w-[65%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(5,150,105,0.08)_0%,transparent_70%)] blur-[110px]"></div>
          <div className="absolute top-[-20%] left-[-5%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.04)_0%,transparent_70%)] blur-[90px]"></div>
          <div className="absolute inset-0 opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/graphy-dark.png')]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px:32px] opacity-[0.08]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Award size={12} className="text-emerald-500" />
            <span>Excellence Stratégique</span>
          </div>

          <h1 className="text-balance text-3xl md:text-6xl font-bold text-white mb-6 font-serif tracking-tight leading-[1.1] animate-in fade-in slide-in-from-top-6 duration-700">
            Notre <span className="text-emerald-500 italic">Ingénierie Stratégique</span>
          </h1>

          <p className="text-sm md:text-xl text-slate-300/90 font-light leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Une approche à 360° pour transformer chaque défi du marché marocain en <span className="text-white font-medium">opportunité de croissance</span>.
          </p>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
      </section>

      <div className="pt-16 md:pt-20"> {/* Optimized spacing after Hero */}


        {/* Pillars Grid */}
        <section className="container mx-auto px-4 md:px-6 mb-20 md:mb-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
            {PILLARS.map((pillar) => {
              const isRelevant = analysis?.relevantPillars.includes(pillar.id);
              return (
                <div
                  key={pillar.id}
                  className={`bg-white border p-6 md:p-8 rounded-2xl transition-all group flex flex-col h-full ${isRelevant
                    ? 'border-emerald-500 shadow-xl ring-2 ring-emerald-500/10'
                    : 'border-slate-200 hover:border-emerald-500 hover:shadow-xl'
                    }`}
                >
                  <div className={`mb-5 md:mb-6 group-hover:scale-110 transition-transform origin-left ${isRelevant ? 'text-emerald-600' : 'text-emerald-500'}`}>
                    {getIcon(pillar.icon, 28)}
                  </div>
                  <h3 className="font-bold text-base md:text-lg mb-3">
                    {pillar.title}
                    {isRelevant && <Sparkles size={14} className="inline ml-2 text-emerald-500 animate-pulse" />}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 mb-6 flex-grow leading-relaxed">{pillar.description}</p>
                  <ul className="space-y-2.5 border-t border-slate-50 pt-5">
                    {pillar.details.map((detail, idx) => (
                      <li key={idx} className="text-[10px] md:text-xs text-slate-400 flex items-start">
                        <CheckCircle2 size={12} className="text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* AI Assistant Section */}
        <section className="bg-slate-900 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-600/5 skew-x-12 transform translate-x-1/2"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-12 rounded-3xl">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="text-emerald-400 w-6 h-6 md:w-8 md:h-8" />
                <h2 className="text-2xl md:text-4xl font-bold text-white font-serif">Calculateur de Synergie Stratégique</h2>
              </div>
              <p className="text-base md:text-lg text-slate-300 mb-8 md:mb-10 leading-relaxed">
                Découvrez comment notre modèle unique s'applique à votre laboratoire. Décrivez votre projet, et notre algorithme analysera les synergies possibles avec les 10 piliers d'A2S.
              </p>

              <form onSubmit={handleCalculateSynergy} className="relative mb-8" aria-busy={isLoading}>
                <label htmlFor="labInput" className="sr-only">Décrivez votre projet</label>
                <textarea
                  id="labInput"
                  name="labInput"
                  value={labInput}
                  onChange={(e) => setLabInput(e.target.value)}
                  placeholder="Ex: Laboratoire français expert en soins anti-âge cherchant une distribution sélective en officine..."
                  className="w-full bg-white/10 border border-white/20 rounded-2xl p-5 md:p-6 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[140px] md:min-h-[120px] text-sm md:text-base transition-all"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-4 md:absolute md:mt-0 md:bottom-4 md:right-4 w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white px-8 py-4 md:py-3 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg text-sm md:text-base"
                >
                  {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Send className="mr-2 w-5 h-5" />}
                  Calculer la Synergie
                </button>
              </form>

              {analysis && (
                <div className="bg-emerald-600/20 border border-emerald-500/30 p-6 md:p-10 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500" role="status" aria-live="polite">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                      <Sparkles size={14} />
                      <span>Analyse de Synergie A2S</span>
                    </div>
                    <div className="flex items-center bg-slate-900/50 px-4 py-2 rounded-full border border-emerald-500/30">
                      <Award className="text-yellow-400 mr-2" size={18} />
                      <span className="text-white font-bold text-sm">Score de compatibilité : </span>
                      <span className="text-emerald-400 font-black text-xl ml-2">{analysis.synergyScore}%</span>
                    </div>
                  </div>

                  <div className="text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-wrap mb-8">
                    {analysis.advice}
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/10 text-center">
                    <p className="text-xs md:text-sm text-slate-400 mb-6">Ce diagnostic préliminaire confirme un fort potentiel de développement.</p>
                    <button className="bg-white text-slate-900 px-8 py-3.5 rounded-full font-bold hover:bg-slate-100 transition-colors shadow-xl text-sm md:text-base">
                      Discuter du déploiement
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* Special focus on Force Commerciale */}
        <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-4 block">Force de frappe terrain</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 font-serif leading-tight">Une présence physique inégalée au Maroc</h2>
              <ul className="space-y-6">
                <li className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0 text-sm">1</div>
                  <p className="text-sm md:text-base text-slate-600"><strong className="text-slate-900">+60 dermo-conseillères :</strong> Des expertes formées en continu, présentes quotidiennement sur les points de vente clés du Royaume.</p>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0 text-sm">2</div>
                  <p className="text-sm md:text-base text-slate-600"><strong className="text-slate-900">Visite médicale ciblée :</strong> Un réseau d'influence direct auprès des dermatologues et gynécologues prescripteurs.</p>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0 text-sm">3</div>
                  <p className="text-sm md:text-base text-slate-600"><strong className="text-slate-900">Maillage 360° :</strong> Une couverture logistique et commerciale de 3000+ pharmacies et parapharmacies.</p>
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2 relative w-full">
              <div className="bg-slate-100 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl aspect-video md:aspect-[4/3] lg:aspect-video">
                <img
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800"
                  alt="Équipe terrain en réunion - accompagnement commercial A2S"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent flex items-end p-6 md:p-10">
                  <div className="text-white">
                    <p className="text-2xl md:text-3xl font-bold mb-2">L'excellence terrain.</p>
                    <p className="text-sm md:text-base text-slate-300">A2S dispose du plus large réseau de conseil spécialisé au Maroc.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <PartnershipCTA
        title="Propulsez votre expertise au niveau supérieur"
        description="Profitez de notre ingénierie tactique et de notre force de frappe terrain pour optimiser votre présence et vos résultats sur l'ensemble du Royaume."
        ctaText="Activer nos leviers de croissance"
      />
    </div>
  );
};

export default Expertise;
