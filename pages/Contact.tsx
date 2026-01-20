
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Globe, Linkedin, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import SEO from './SEO';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        interest: '',
        otherInterest: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Clear otherInterest if interest changes from 'Autres'
            ...(name === 'interest' && value !== 'Autres' ? { otherInterest: '' } : {})
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setSubmitted(true);
                setSubmitStatus('success');
                setFormData({
                    name: '',
                    company: '',
                    email: '',
                    phone: '',
                    interest: '',
                    otherInterest: '',
                    message: ''
                });
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <SEO
                title="Contactez-nous - Support Stratégique"
                description="Prêt à accélérer votre croissance au Maroc ? Contactez les experts A2S pour un accompagnement sur mesure."
            />
            {/* Compact Prestige Hero Section */}
            <section className="relative pt-24 pb-16 md:pt-40 md:pb-20 bg-slate-950 overflow-hidden text-center border-b border-white/5">
                {/* Mesh Gradient VFX with Contact Theme */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute -inset-[10px] opacity-[0.05] bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center grayscale blur-[2px]"></div>
                    <div className="absolute inset-0 bg-slate-950/90"></div>
                    <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.07)_0%,transparent_70%)] blur-[100px]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.08]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <MessageSquare size={12} className="text-emerald-500" />
                        <span>Direct Connection</span>
                    </div>

                    <h1 className="text-3xl md:text-6xl font-bold text-white mb-6 font-serif tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
                        Ouvrons le <span className="text-emerald-500 italic">dialogue.</span>
                    </h1>

                    <p className="text-sm md:text-xl text-slate-300/90 font-light max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        Prêt à accélérer votre croissance au Maroc ? Nos experts vous répondent sous <span className="text-white font-medium">24h - 48h</span>.
                    </p>
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/6 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
            </section>

            <div className="bg-slate-50"> {/* Container transition */}

            </div>
            {/* Main Content */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">

                        {/* Left: Contact Info */}
                        <div className="lg:w-1/3 space-y-12">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 font-serif leading-tight">Parlons de votre prochain <span className="text-emerald-600">succès au Maroc</span></h2>
                                <p className="text-slate-600 text-sm md:text-lg leading-relaxed mb-8">
                                    Besoin d'un accompagnement stratégique pour votre laboratoire ? Notre équipe d'experts est à votre écoute pour définir votre stratégie de croissance.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-start space-x-6 group">
                                    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm mb-1">Siége Social</h4>
                                        <p className="text-slate-500 leading-relaxed">145 Bd Hassan II, Casablanca 20000, Maroc</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-6 group">
                                    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm mb-1">Téléphone</h4>
                                        <p className="text-slate-500 leading-relaxed">+212 5 22 37 35 50</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-6 group">
                                    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-1">Email</h4>
                                        <p className="text-slate-500 leading-relaxed">contact@a2s.ma</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-[0.2em] text-xs">Suivez notre actualité</h4>
                                <div className="flex space-x-6 text-slate-400">
                                    <a href="#" className="hover:text-emerald-600 transition-colors"><Linkedin size={24} /></a>
                                    <a href="#" className="hover:text-emerald-600 transition-colors"><Globe size={24} /></a>
                                    <a href="#" className="hover:text-emerald-600 transition-colors"><MessageSquare size={24} /></a>
                                </div>
                            </div>
                        </div>

                        {/* Right: Contact Form */}
                        <div className="lg:w-2/3">
                            <div className="bg-white p-6 md:p-16 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
                                {submitted ? (
                                    <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
                                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-8">
                                            <CheckCircle size={48} />
                                        </div>
                                        <h3 className="text-3xl font-bold text-slate-900 mb-4 font-serif">Message envoyé !</h3>
                                        <p className="text-slate-500 text-lg">Nos experts reviendront vers vous sous 24h à 48h.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label htmlFor="name" className="text-slate-900 font-bold text-sm ml-1">Nom Complet</label>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    type="text"
                                                    required
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700 placeholder:text-slate-400"
                                                    placeholder="Ex: Mourad Laaouina"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label htmlFor="company" className="text-slate-900 font-bold text-sm ml-1">Société / Laboratoire</label>
                                                <input
                                                    id="company"
                                                    name="company"
                                                    value={formData.company}
                                                    onChange={handleInputChange}
                                                    type="text"
                                                    required
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700 placeholder:text-slate-400"
                                                    placeholder="Nom de votre entreprise"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label htmlFor="email" className="text-slate-900 font-bold text-sm ml-1">E-mail Professionnel</label>
                                                <input
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    type="email"
                                                    required
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700 placeholder:text-slate-400"
                                                    placeholder="mourad.laaouina@entreprise.com"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label htmlFor="phone" className="text-slate-900 font-bold text-sm ml-1">Téléphone</label>
                                                <input
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    type="tel"
                                                    required
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700 placeholder:text-slate-400"
                                                    placeholder="+212 6 00 00 00 00"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label htmlFor="interest" className="text-slate-900 font-bold text-sm ml-1">Intérêt principal</label>
                                            <select
                                                id="interest"
                                                name="interest"
                                                value={formData.interest}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700 appearance-none cursor-pointer"
                                            >
                                                <option value="" disabled>Sélectionnez un intérêt</option>
                                                <option value="Distribution au Maroc">Distribution au Maroc</option>
                                                <option value="Partenariat stratégique">Partenariat stratégique</option>
                                                <option value="Import / réglementation">Import / réglementation</option>
                                                <option value="Service marketing">Service marketing</option>
                                                <option value="Autres">Autres</option>
                                            </select>
                                        </div>

                                        {formData.interest === 'Autres' && (
                                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <label htmlFor="otherInterest" className="text-slate-900 font-bold text-sm ml-1">Précisez votre intérêt</label>
                                                <input
                                                    id="otherInterest"
                                                    name="otherInterest"
                                                    value={formData.otherInterest}
                                                    onChange={handleInputChange}
                                                    type="text"
                                                    required={formData.interest === 'Autres'}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700 placeholder:text-slate-400"
                                                    placeholder="Votre domaine spécifique..."
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            <label htmlFor="message" className="text-slate-900 font-bold text-sm ml-1">Message</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                required
                                                rows={6}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700 resize-none placeholder:text-slate-400"
                                                placeholder="Décrivez brièvement votre projet ou votre demande..."
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full bg-emerald-600 text-white font-bold py-5 rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-emerald-900/10 group overflow-hidden relative active:scale-[0.98] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-500'}`}
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center space-x-3 relative z-10">
                                                    <Loader2 size={20} className="animate-spin" />
                                                    <span>Traitement de votre stratégie...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="relative z-10">Envoyer ma demande stratégique</span>
                                                    <Send size={20} className="ml-3 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform relative z-10" />
                                                    <div className="absolute inset-x-0 bottom-0 h-full bg-emerald-700 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                                </>
                                            )}
                                        </button>

                                        {submitStatus === 'error' && (
                                            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm text-center font-medium animate-in fade-in zoom-in duration-300">
                                                Une erreur est survenue lors de l'envoi. Veuillez vérifier vos accès MySQL ou réessayer plus tard.
                                            </div>
                                        )}
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="pb-20 md:pb-32 container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-slate-200 w-full h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-inner border border-slate-100">
                        <iframe
                            title="A2S Casablanca Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.8465434111305!2d-7.618649823438258!3d33.58334467333675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d2994c9f1f0d%3A0x8a9f6d7c8d9c0e0b!2s145%20Boulevard%20Hassan%20II%2C%20Casablanca%2020250%2C%20Maroc!5e0!3m2!1sfr!2sma!4v1705672000000!5m2!1sfr!2sma"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="grayscale contrast-[1.1] opacity-90 transition-opacity hover:opacity-100"
                        ></iframe>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
