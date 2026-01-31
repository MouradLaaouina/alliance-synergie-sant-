import React from 'react';
import {
  BarChart3,
  ShieldCheck,
  Truck,
  Users,
  Search,
  GraduationCap,
  Megaphone,
  Star,
  Database,
  HeartHandshake
} from 'lucide-react';
import { ServicePillar, PartnerLab, Brand } from './types';

export const PILLARS: ServicePillar[] = [
  {
    id: 1,
    title: "Compréhension du marché",
    description: "Analyse continue des tendances et comportements locaux.",
    icon: "Search",
    details: ["Analyse continue", "Connaissance consommateur", "Données internes"]
  },
  {
    id: 2,
    title: "Expertise réglementaire",
    description: "Accompagnement complet de l'enregistrement à la mise en marché.",
    icon: "ShieldCheck",
    details: ["Enregistrement", "Importation", "Transit & Douanes", "Choix transporteur"]
  },
  {
    id: 3,
    title: "Logistique & Distribution",
    description: "Infrastructure professionnelle pour un maillage national sans rupture.",
    icon: "Truck",
    details: ["Stockage sécurisé", "Livraison nationale", "3000+ points de vente"]
  },
  {
    id: 4,
    title: "Force commerciale",
    description: "+60 dermo-conseillères expertes sur le terrain.",
    icon: "Users",
    details: ["Visite médicale", "Animation officine", "Événements & Activations"]
  },
  {
    id: 5,
    title: "Data & Analyse",
    description: "Reporting stratégique et suivi sell-out précis.",
    icon: "BarChart3",
    details: ["Études de marché", "Suivi segmentation", "Données consommateurs"]
  },
  {
    id: 6,
    title: "Formation : A2S Académie",
    description: "Programmes scientifiques et marketing pour nos partenaires.",
    icon: "GraduationCap",
    details: ["Formation officinale", "Dermatologie", "Techniques merchandising"]
  },
  {
    id: 7,
    title: "Marketing & Com",
    description: "Direction artistique et digitale 100% intégrée.",
    icon: "Megaphone",
    details: ["Contenu digital", "Storytelling scientifique", "Branding"]
  },
  {
    id: 8,
    title: "Influence & Notoriété",
    description: "Partenariats stratégiques avec des ambassadrices reconnues.",
    icon: "Star",
    details: ["Mouna Fettou", "Influenceuses expertes", "Confiance immédiate"]
  },
  {
    id: 9,
    title: "Gestion des données",
    description: "Analyse avancée des besoins récurrents des consommateurs.",
    icon: "Database",
    details: ["Retours utilisateurs", "Saisonnalité", "Tendances régionales"]
  },
  {
    id: 10,
    title: "Service & Qualité",
    description: "La performance avant la concession, l'éthique avant la facilité.",
    icon: "HeartHandshake",
    details: ["Qualité avant volume", "Partenariat long terme", "Rigueur d'exécution"]
  }
];

export const PARTNERS: PartnerLab[] = [
  {
    name: "Dermalliance",
    origin: "Espagne",
    description: "Développeur des marques D-WHITE & DCAP",
    logo: "/images/Dermalliance.webp",
    website: "https://www.dermalliances.com/"
  },
  {
    name: "Dermofarm",
    origin: "Espagne",
    description: "Expert européen en soins dermo",
    logo: "/images/Dermofarm.webp",
    website: "https://www.dermofarm.com/"
  },
  {
    name: "BABÉ Laboratorios",
    origin: "Espagne",
    description: "Soins dermo-cosmétiques essentiels",
    logo: "/images/BABE.webp",
    website: "https://laboratoriosbabe.com"
  },
  {
    name: "Florame",
    origin: "France",
    description: "Aromathérapie et cosmétiques bio certifiés",
    logo: "/images/Florame.webp",
    website: "https://fr.florame.com/"
  },
  {
    name: "Labo ODOST",
    origin: "France",
    description: "Hygiène bucco-dentaire à l'eau thermale",
    logo: "/images/Labo ODOST.webp",
    website: "https://www.buccotherm.com/"
  },
  {
    name: "Casmara",
    origin: "Espagne",
    description: "Cosmétique professionnelle haut de gamme",
    logo: "/images/CASMARA.webp",
    website: "https://www.casmara.com/fr/"
  }
];

export const BRANDS: Brand[] = [
  {
    name: "D-WHITE",
    owner: "Dermalliance",
    description: "Spécialiste en éclaircissement et uniformisation de la peau pour un teint radieux et lumineux.",
    image: "images/DWHITE1.webp",
    website: "https://dwhite.ma/",
    instagram: "https://www.instagram.com/dwhite.maroc.a2s/"
  },
  {
    name: "D-CAP",
    owner: "Dermalliance",
    description: "Solutions capillaires innovantes : anti-chute, shampoings thérapeutiques, masques réparateurs.",
    image: "images/DCAP1.webp",
    website: "https://d-cap.ma/",
    instagram: "https://www.instagram.com/dcap.maroc.a2s/"
  },
  {
    name: "BABÉ",
    owner: "Espagne",
    description: "Gammes pédiatriques et dermatologiques pour toute la famille, formulées sans compromis.",
    image: "images/BABE.webp",
    website: "https://laboratoriosbabe.com/",
    instagram: "https://www.instagram.com/babelaboratorios.maroc/"
  },
  {
    name: "Sensilis",
    owner: "Espagne",
    description: "Soins intimes féminins et solutions gynécologiques recommandées par les spécialistes.",
    image: "images/SENSILIS1.webp",
    website: "https://sensilis.ma/fr",
    instagram: "https://www.instagram.com/sensilis.maroc/"
  },
  {
    name: "Buccotherm",
    owner: "France",
    description: "Hygiène bucco-dentaire à l'eau thermale, dentifrices et soins pour toute la famille.",
    image: "images/Bucco1.webp",
    website: "https://www.buccotherm.com/",
    instagram: "https://www.instagram.com/buccotherm.maroc.a2s/"
  },
  {
    name: "CASTERA",
    owner: "France",
    description: "Eau thermale et soins apaisants pour les peaux sensibles, inspirés de l'expertise thermale.",
    image: "images/CASTERA1.webp",
    website: "https://www.castera-thermal.com/",
    instagram: "https://www.instagram.com/castera.maroc.a2s/"
  },
  {
    name: "Casmara",
    owner: "Espagne",
    description: "Masques peel-off professionnels et soins d'institut de renommée mondiale.",
    image: "images/CASMARA (1).webp",
    website: "https://www.casmara.com/",
    instagram: "https://www.instagram.com/casmara_maroc_officiel/"
  },
  {
    name: "Florame",
    owner: "France",
    description: "Aromathérapie et cosmétiques bio certifiés, huiles essentielles pures et naturelles.",
    image: "images/FLORAME (1).webp",
    website: "https://fr.florame.com/",
    instagram: "https://www.instagram.com/florame.a2s.maroc/"
  }
];

export const getIcon = (name: string, size: number = 24) => {
  const props = { size, className: "shrink-0 transition-transform duration-300" };
  switch (name) {
    case 'Search': return <Search {...props} />;
    case 'ShieldCheck': return <ShieldCheck {...props} />;
    case 'Truck': return <Truck {...props} />;
    case 'Users': return <Users {...props} />;
    case 'BarChart3': return <BarChart3 {...props} />;
    case 'GraduationCap': return <GraduationCap {...props} />;
    case 'Megaphone': return <Megaphone {...props} />;
    case 'Star': return <Star {...props} />;
    case 'Database': return <Database {...props} />;
    case 'HeartHandshake': return <HeartHandshake {...props} />;
    default: return <Search {...props} />;
  }
};
