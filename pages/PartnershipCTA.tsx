
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';


interface PartnershipCTAProps {
    title?: string;
    description?: string;
    ctaText?: string;
}

const PartnershipCTA: React.FC<PartnershipCTAProps> = ({
    title = "Devenez notre prochain partenaire",
    description = "A2S est l'acteur incontournable pour toute marque dermo-cosmétique souhaitant se développer au Maroc. Partenaire engagé, accélérateur de croissance, stratège-distributeur, formateur et influenceur marché.",
    ctaText = "Développer votre marque au Maroc avec A2S"
}) => {
    return (
        <section className="bg-slate-950 py-20 md:py-28 relative overflow-hidden border-t border-white/5">
            {/* Background VFX */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)] blur-[120px]"></div>
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <Sparkles size={12} className="text-emerald-500" />
                        <span>Collaboration Stratégique</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 font-serif leading-tight">
                        {title}
                    </h2>

                    <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed mb-12 max-w-3xl mx-auto">
                        {description}
                    </p>

                    <Link
                        to="/contact"
                        className="group relative inline-flex items-center space-x-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-sm md:text-base font-bold transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:shadow-[0_0_60px_rgba(16,185,129,0.4)]"
                    >
                        <span>{ctaText}</span>
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
        </section>
    );
};

export default PartnershipCTA;
