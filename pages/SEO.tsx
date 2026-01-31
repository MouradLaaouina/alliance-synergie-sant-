import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    canonical?: string;
    ogType?: string;
}

const SEO = ({ title, description, keywords, canonical, ogType = 'website' }: SEOProps) => {
    useEffect(() => {
        // Update Title
        document.title = `${title} | A2S - Alliance Synergie Santé`;

        // Update Meta Description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        } else {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            metaDescription.setAttribute('content', description);
            document.head.appendChild(metaDescription);
        }

        // Update Meta Keywords
        if (keywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) {
                metaKeywords.setAttribute('content', keywords);
            } else {
                metaKeywords = document.createElement('meta');
                metaKeywords.setAttribute('name', 'keywords');
                metaKeywords.setAttribute('content', keywords);
                document.head.appendChild(metaKeywords);
            }
        }

        // Update OpenGraph Tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', title);

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) ogDescription.setAttribute('content', description);

        const canonicalUrl = canonical || `${window.location.origin}${window.location.pathname}`;

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

        const ogTypeTag = document.querySelector('meta[property="og:type"]');
        if (ogTypeTag) {
            ogTypeTag.setAttribute('content', ogType);
        } else {
            const newOgType = document.createElement('meta');
            newOgType.setAttribute('property', 'og:type');
            newOgType.setAttribute('content', ogType);
            document.head.appendChild(newOgType);
        }

        const twitterTitle = document.querySelector('meta[name="twitter:title"], meta[property="twitter:title"]');
        if (twitterTitle) {
            twitterTitle.setAttribute('content', title);
        }

        const twitterDescription = document.querySelector('meta[name="twitter:description"], meta[property="twitter:description"]');
        if (twitterDescription) {
            twitterDescription.setAttribute('content', description);
        }

        const twitterUrl = document.querySelector('meta[name="twitter:url"], meta[property="twitter:url"]');
        if (twitterUrl) {
            twitterUrl.setAttribute('content', canonicalUrl);
        }

        // Update Canonical
        let linkCanonical = document.querySelector('link[rel="canonical"]');
        if (linkCanonical) {
            linkCanonical.setAttribute('href', canonicalUrl);
        } else {
            linkCanonical = document.createElement('link');
            linkCanonical.setAttribute('rel', 'canonical');
            linkCanonical.setAttribute('href', canonicalUrl);
            document.head.appendChild(linkCanonical);
        }
    }, [title, description, keywords, canonical, ogType]);

    return null;
};

export default SEO;
