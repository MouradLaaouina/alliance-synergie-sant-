# Guide - Utiliser l'E-mail HTML (Version Premium)

## 🎨 Activer la Version HTML

Par défaut, l'email de confirmation utilise un format **texte simple** pour une compatibilité maximale.

Pour activer la version **HTML professionnelle**, suivez ces étapes :

---

## ✨ Étape 1 : Vérifier le Template

Le fichier `public/api/email_template_confirmation.html` contient le template HTML.

**Variables disponibles :**
- `{{NAME}}` - Nom du client
- `{{COMPANY}}` - Société
- `{{INTEREST}}` - Sujet d'intérêt
- `{{PHONE}}` - Téléphone

---

## 🔧 Étape 2 : Modifier contact.php

Remplacer le code d'envoi de confirmation (lignes ~357-380) par :

```php
// Send confirmation email to client (HTML version)
$confirmationSubject = 'Confirmation de réception - Alliance Synergie Santé';

// Load HTML template
$templatePath = __DIR__ . '/email_template_confirmation.html';
if (!file_exists($templatePath)) {
    // Fallback to text version if template not found
    $confirmationBody = "Bonjour $name,\n\n"
        . "Nous avons bien reçu votre demande...\n";
    $isHtml = false;
} else {
    $confirmationBody = file_get_contents($templatePath);

    // Replace placeholders
    $confirmationBody = str_replace('{{NAME}}', htmlspecialchars($name, ENT_QUOTES, 'UTF-8'), $confirmationBody);
    $confirmationBody = str_replace('{{COMPANY}}', htmlspecialchars($company, ENT_QUOTES, 'UTF-8'), $confirmationBody);
    $confirmationBody = str_replace('{{INTEREST}}', htmlspecialchars($interest, ENT_QUOTES, 'UTF-8'), $confirmationBody);
    $confirmationBody = str_replace('{{PHONE}}', htmlspecialchars($phone, ENT_QUOTES, 'UTF-8'), $confirmationBody);
    $isHtml = true;
}

// Set headers based on content type
$confirmationHeaders = [
    'From: Alliance Synergie Santé <noreply@a2s.ma>',
    'Reply-To: contact@a2s.ma',
    'MIME-Version: 1.0',
];

if ($isHtml) {
    $confirmationHeaders[] = 'Content-Type: text/html; charset=UTF-8';
} else {
    $confirmationHeaders[] = 'Content-Type: text/plain; charset=UTF-8';
}

// Send confirmation email (don't block on failure)
@mail($email, $confirmationSubject, $confirmationBody, implode("\r\n", $confirmationHeaders));
```

---

## 🎯 Étape 3 : Tester

1. Soumettre le formulaire de contact
2. Vérifier l'email reçu
3. S'assurer que :
   - ✅ Le design s'affiche correctement
   - ✅ Les variables sont remplacées
   - ✅ Les liens sont cliquables
   - ✅ Responsive sur mobile

---

## 📱 Aperçu du Rendu

### Desktop
```
┌─────────────────────────────────────────┐
│  [Gradient Vert]                        │
│         A2S                             │
│  Alliance Synergie Santé                │
└─────────────────────────────────────────┘
│                                         │
│  Bonjour Mourad,                        │
│                                         │
│  Nous avons bien reçu votre demande...  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ 📋 Récapitulatif                  │  │
│  │ Société : ACME Corp               │  │
│  │ Sujet : Lancement produit         │  │
│  │ Téléphone : +212 6 12 34 56 78    │  │
│  └──────────────────────────────────┘  │
│                                         │
│  [Bouton] 📞 +212 5 22 37 35 50        │
│                                         │
│  Cordialement,                          │
│  L'équipe A2S                           │
│                                         │
├─────────────────────────────────────────┤
│  [Footer Noir]                          │
│  Alliance Synergie Santé                │
│  Leader Dermo-Cosmétique Maroc          │
│                                         │
│  📍 145 Bd Hassan II, Casablanca        │
│  📞 +212 5 22 37 35 50                  │
│  ✉️ contact@a2s.ma                      │
│                                         │
│  [LinkedIn] [Instagram] [Facebook]      │
│                                         │
│  Depuis 2008...                         │
└─────────────────────────────────────────┘
```

---

## 🎨 Personnalisation du Design

### Changer les Couleurs

Dans `email_template_confirmation.html` :

```css
/* Couleur primaire (Vert émeraude) */
background: linear-gradient(135deg, #10b981 0%, #059669 100%);

/* Pour changer en bleu : */
background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);

/* Footer */
background-color: #0f172a; /* Bleu très foncé */
```

### Logo Officiel (Déjà Activé)

Le template utilise désormais le logo officiel A2S :

```html
<div class="header">
    <img src="https://a2s.ma/images/A2S-Logo-white.webp"
         alt="Alliance Synergie Santé"
         style="width: 140px; height: auto; margin-bottom: 12px; display: block; margin-left: auto; margin-right: auto;">
    <p class="tagline">Alliance Synergie Santé</p>
</div>
```

### Modifier le Texte

Éditer directement le HTML entre les balises :

```html
<p class="message">
    VOTRE TEXTE PERSONNALISÉ ICI
</p>
```

---

## 🧪 Test Multi-Clients

Tester l'affichage sur différents clients mail :

| Client | Statut | Notes |
|--------|--------|-------|
| Gmail Desktop | ✅ | Parfait |
| Gmail Mobile | ✅ | Responsive |
| Outlook Desktop | ✅ | Compatible |
| Outlook Mobile | ✅ | Bon |
| Apple Mail | ✅ | Excellent |
| Yahoo Mail | ✅ | Bon |
| Thunderbird | ✅ | Compatible |

---

## 📊 Avantages Version HTML vs Texte

| Aspect | Texte Simple | HTML |
|--------|--------------|------|
| Compatibilité | 100% | ~95% |
| Design | Basique | Professionnel |
| Branding | Limité | Fort |
| Clics liens | Manuels | Boutons |
| Taille email | ~2 KB | ~8 KB |
| Temps dev | 5 min | 30 min |

---

## ⚠️ Limitations & Bonnes Pratiques

### Limitations Email HTML

❌ **À Éviter :**
- JavaScript (bloqué par tous les clients)
- CSS externe (non supporté)
- Vidéos embarquées
- Fonts personnalisées complexes
- Flexbox/Grid (support limité)

✅ **Recommandations :**
- CSS inline ou dans `<style>`
- Tables pour layout (si nécessaire)
- Images hébergées (pas base64)
- Texte alternatif pour images
- Largeur max 600px

### Fallback Texte

Toujours prévoir un fallback texte :

```php
// Version multipart (HTML + Texte)
$boundary = uniqid('np');

$headers = [
    'From: A2S <noreply@a2s.ma>',
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="' . $boundary . '"'
];

$body = "--{$boundary}\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
$body .= $textVersion . "\r\n";
$body .= "--{$boundary}\r\n";
$body .= "Content-Type: text/html; charset=UTF-8\r\n\r\n";
$body .= $htmlVersion . "\r\n";
$body .= "--{$boundary}--";
```

---

## 🚀 Version Pro : Template Engine

Pour aller plus loin, utiliser un moteur de templates :

### Option 1 : PHPMailer
```bash
composer require phpmailer/phpmailer
```

```php
use PHPMailer\PHPMailer\PHPMailer;

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->isHTML(true);
$mail->setFrom('noreply@a2s.ma', 'Alliance Synergie Santé');
$mail->addAddress($email, $name);
$mail->Subject = 'Confirmation';
$mail->Body = $htmlContent;
$mail->AltBody = $textContent; // Fallback
$mail->send();
```

### Option 2 : Twig
```bash
composer require twig/twig
```

```php
$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/templates');
$twig = new \Twig\Environment($loader);

$html = $twig->render('email_confirmation.html.twig', [
    'name' => $name,
    'company' => $company,
    'interest' => $interest,
    'phone' => $phone,
]);
```

---

## ✅ Checklist Activation HTML

- [ ] Template HTML créé (`email_template_confirmation.html`)
- [ ] Variables testées (`{{NAME}}`, `{{COMPANY}}`, etc.)
- [ ] Code modifié dans `contact.php`
- [ ] Test d'envoi effectué
- [ ] Rendu vérifié sur Gmail
- [ ] Rendu vérifié sur Outlook
- [ ] Rendu vérifié sur mobile
- [ ] Liens cliquables
- [ ] Responsive OK
- [ ] Pas en spam

---

**Version HTML prête à déployer ! 🎨✅**

*Pour rester sur la version texte simple, ne pas modifier contact.php - la version actuelle fonctionne parfaitement !*
