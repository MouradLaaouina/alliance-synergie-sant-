import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    ogType?: string;
}

const SEO = ({ title, description, canonical, ogType = 'website' }: SEOProps) => {
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

        // Update OpenGraph Tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', title);

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) ogDescription.setAttribute('content', description);

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', window.location.href);

        // Update Canonical
        let linkCanonical = document.querySelector('link[rel="canonical"]');
        if (linkCanonical) {
            linkCanonical.setAttribute('href', canonical || window.location.href);
        } else {
            linkCanonical = document.createElement('link');
            linkCanonical.setAttribute('rel', 'canonical');
            linkCanonical.setAttribute('href', canonical || window.location.href);
            document.head.appendChild(linkCanonical);
        }
    }, [title, description, canonical, ogType]);

    return null;
};

export default SEO;
