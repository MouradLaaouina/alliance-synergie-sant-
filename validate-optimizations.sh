#!/bin/bash

# Script de validation des optimisations SEO & Performance
# A2S - Alliance Synergie Santé

echo "🔍 Validation des optimisations SEO & Performance A2S"
echo "======================================================"
echo ""

# Couleurs pour output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SITE_URL="https://a2s.ma"
ERRORS=0

# Fonction de test
test_check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        ((ERRORS++))
    fi
}

echo "1️⃣  Tests de Fichiers Locaux"
echo "----------------------------"

# Vérifier fichiers .htaccess
if grep -q "mod_deflate" "public/.htaccess"; then
    test_check 0 "Compression Gzip configurée dans .htaccess"
else
    test_check 1 "Compression Gzip NON configurée"
fi

if grep -q "mod_brotli" "public/.htaccess"; then
    test_check 0 "Compression Brotli configurée dans .htaccess"
else
    test_check 1 "Compression Brotli NON configurée"
fi

if grep -q "mod_expires" "public/.htaccess"; then
    test_check 0 "Cache headers configurés dans .htaccess"
else
    test_check 1 "Cache headers NON configurés"
fi

# Vérifier vite.config.ts
if grep -q "vendor-router" "vite.config.ts"; then
    test_check 0 "Code splitting optimisé (vendor-router)"
else
    test_check 1 "Code splitting NON optimisé"
fi

if grep -q "passes: 2" "vite.config.ts"; then
    test_check 0 "Terser minification avancée configurée"
else
    test_check 1 "Terser minification standard"
fi

# Vérifier sitemap
if grep -q "xmlns:image" "dist/sitemap.xml"; then
    test_check 0 "Sitemap enrichi avec namespace image"
else
    test_check 1 "Sitemap basique sans images"
fi

if grep -q "xhtml:link" "dist/sitemap.xml"; then
    test_check 0 "Sitemap avec liens hreflang"
else
    test_check 1 "Sitemap sans hreflang"
fi

# Vérifier structured data
SCHEMA_COUNT=$(grep -c "@type" "index.html")
if [ $SCHEMA_COUNT -ge 4 ]; then
    test_check 0 "Structured data enrichi ($SCHEMA_COUNT types)"
else
    test_check 1 "Structured data minimal ($SCHEMA_COUNT types)"
fi

echo ""
echo "2️⃣  Tests Réseau (si le site est déployé)"
echo "----------------------------------------"

# Ping le site
if curl -s --head "$SITE_URL" | head -n 1 | grep -q "200"; then
    echo -e "${GREEN}✓${NC} Site accessible : $SITE_URL"

    # Test compression
    COMPRESSION=$(curl -s -I -H "Accept-Encoding: gzip,deflate,br" "$SITE_URL" | grep -i "content-encoding")
    if [ ! -z "$COMPRESSION" ]; then
        test_check 0 "Compression activée : $COMPRESSION"
    else
        test_check 1 "Compression NON détectée"
    fi

    # Test cache headers
    CACHE=$(curl -s -I "$SITE_URL/assets/" 2>/dev/null | grep -i "cache-control")
    if [ ! -z "$CACHE" ]; then
        test_check 0 "Cache headers présents"
    else
        echo -e "${YELLOW}⚠${NC}  Cache headers non vérifiables (nécessite des assets)"
    fi

    # Test security headers
    SECURITY=$(curl -s -I "$SITE_URL" | grep -i "x-content-type-options")
    if [ ! -z "$SECURITY" ]; then
        test_check 0 "Security headers configurés"
    else
        test_check 1 "Security headers manquants"
    fi

    # Test sitemap
    if curl -s "$SITE_URL/sitemap.xml" | grep -q "urlset"; then
        test_check 0 "Sitemap accessible"
    else
        test_check 1 "Sitemap non accessible"
    fi

    # Test robots.txt
    if curl -s "$SITE_URL/robots.txt" | grep -q "Sitemap"; then
        test_check 0 "robots.txt avec référence sitemap"
    else
        test_check 1 "robots.txt sans référence sitemap"
    fi

else
    echo -e "${YELLOW}⚠${NC}  Site non accessible - Tests réseau ignorés"
    echo "   Déployez le site puis relancez ce script"
fi

echo ""
echo "3️⃣  Recommandations de Tests Manuels"
echo "------------------------------------"
echo "📊 PageSpeed Insights : https://pagespeed.web.dev/?url=$SITE_URL"
echo "🔍 Rich Results Test  : https://search.google.com/test/rich-results?url=$SITE_URL"
echo "✅ Schema Validator   : https://validator.schema.org/#url=$SITE_URL"
echo "📈 GTmetrix          : https://gtmetrix.com/?url=$SITE_URL"
echo ""

echo "======================================================"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Toutes les validations ont réussi !${NC}"
    exit 0
else
    echo -e "${RED}⚠️  $ERRORS erreur(s) détectée(s)${NC}"
    echo "Consultez le document OPTIMISATIONS_SEO_PERFORMANCE.md"
    exit 1
fi
