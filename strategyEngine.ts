
import { PILLARS } from './constants';

export interface AnalysisResult {
    advice: string;
    relevantPillars: number[];
    synergyScore: number;
}

const PILLAR_KEYWORDS: Record<number, string[]> = {
    1: ["marché", "analyse", "tendances", "local", "maroc", "connaissance", "consommateur"],
    2: ["enregistre", "réglementaire", "douane", "import", "transit", "ministère", "santé", "visa"],
    3: ["logistique", "stock", "livraison", "distribution", "entrepot", "froid", "pharmacie"],
    4: ["vente", "terrain", "conseillères", "officine", "visite", "médicale", "animation"],
    5: ["données", "data", "reporting", "stats", "sell-out", "suivi", "analytique"],
    6: ["formation", "académie", "scientifique", "merchandising", "atelier", "staff"],
    7: ["marketing", "digital", "branding", "com", "réseaux", "sociaux", "artistique"],
    8: ["influence", "ambassadrice", "notoriété", "mouna fettou", "image", "prestige"],
    9: ["consommateur", "besoins", "saisonnalité", "fidélisation", "crm"],
    10: ["qualité", "éthique", "performance", "long terme", "confiance", "rigueur"]
};

export const analyzeStrategyLocally = (input: string): AnalysisResult => {
    const normalizedInput = input.toLowerCase();
    const scores: Record<number, number> = {};

    // Calculate frequency for each pillar
    Object.entries(PILLAR_KEYWORDS).forEach(([id, keywords]) => {
        const pillarId = parseInt(id);
        let score = 0;
        keywords.forEach(keyword => {
            if (normalizedInput.includes(keyword)) {
                score += 1;
            }
        });
        scores[pillarId] = score;
    });

    // Sort and pick most relevant pillars
    const sortedPillars = Object.entries(scores)
        .filter(([_, score]) => score > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([id, _]) => parseInt(id));

    // Default to pillar 1 and 10 if none found
    const finalPillars = sortedPillars.length > 0 ? sortedPillars.slice(0, 3) : [1, 10];

    // Base Score (0-100)
    const synergyScore = Math.min(40 + (sortedPillars.length * 15), 98);

    // Generate dynamic advice
    let advice = "Basé sur votre profil, Alliance Synergie Santé (A2S) est prêt à activer ses leviers stratégiques majeurs pour votre réussite au Maroc.\n\n";

    if (sortedPillars.length === 0) {
        advice += "Votre projet présente un potentiel intéressant. A2S peut vous accompagner sur l'ensemble de la chaîne de valeur, de la pénétration du marché à la distribution finale.\n";
    } else {
        advice += `Votre focus sur ${normalizedInput.length > 50 ? input.substring(0, 50) + "..." : input} s'aligne parfaitement avec nos expertises clés en `;
        advice += finalPillars.map(id => PILLARS.find(p => p.id === id)?.title).join(", ") + ".\n";
    }

    advice += "\nNos points forts pour ce projet :\n";
    finalPillars.forEach(id => {
        const p = PILLARS.find(pillar => pillar.id === id);
        if (p) {
            advice += `• ${p.title} : ${p.description}\n`;
        }
    });

    advice += "\nEn tant que leader de la dermo-cosmétique, nous garantissons une exécution rigoureuse et une transparence totale pour maximiser votre sell-out.";

    return {
        advice,
        relevantPillars: finalPillars,
        synergyScore
    };
};
