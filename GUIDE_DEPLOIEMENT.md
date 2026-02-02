# Guide de deploiement Hostinger (A a Z, simple)

Objectif : publier le site (Vite) + formulaire de contact **avec** envoi email **et** enregistrement en base, **avec captcha**.

---

## A) Creer la base de donnees (hPanel)
1. hPanel > **Bases de donnees MySQL**.
2. **Creer une base** (ex: `a2s_site`).
3. **Creer un utilisateur** (ex: `a2s_user`) + mot de passe.
4. **Assigner l'utilisateur** a la base (tous privileges).
5. Ouvrir **phpMyAdmin** > **Importer** > choisir `schema_contact.sql`.

## B) Configurer la base (fichier hors public_html)
Fichier : `config_db.php`

Remplacer :
- `host` (souvent `localhost` sur Hostinger),
- `name`,
- `user`,
- `pass`.

Securite :
- Ce fichier doit etre place **en dehors** de `public_html`.
- Permissions conseillees : `config_db.php` en 600/640, `contact.php` en 644.
- Test : l'URL `https://votredomaine.tld/config_db.php` ne doit **pas** exister (404).

## B3) Permissions conseillees (Hostinger)
Si Hostinger ne permet pas un niveau, prendre le plus proche.

Fichiers sensibles (hors `public_html`) :
- `config_db.php` : 600 (ou 640)
- `config_admin.php` : 600 (ou 640)

Fichiers PHP exposes (dans `public_html`) :
- `public/api/contact.php` : 644
- `public/admin/index.php` : 644
- `public/api/.htaccess` : 644
- `public/.htaccess` : 644

Fichiers publics :
- `public/robots.txt` : 644
- `public/sitemap.xml` : 644
- `public/sitemap-index.xml` : 644
- `public/assets/*` : 644
- `public/images/*` : 644
- `public/index.html` : 644

Dossiers :
- `public_html/` : 755
- `public_html/api/` : 755
- `public_html/admin/` : 755
- `public_html/images/` : 755

## B2) Configurer l'acces admin (hors public_html)
Fichier : `config_admin.php`

Etapes :
1. Generer un hash de mot de passe sur votre machine :
   ```bash
   php -r "echo password_hash('VotreMotDePasse', PASSWORD_DEFAULT);"
   ```
2. Ouvrir `config_admin.php` et renseigner :
   - `enabled` = true
   - `username` = votre identifiant
   - `password_hash` = le hash genere
   - `session_timeout_minutes` = 30 (ou selon besoin)
   - `rate_limit_*` pour limiter les tentatives de login
   - `ip_allowlist` si vous voulez autoriser uniquement certaines IP
   - `trust_proxy` a true uniquement si vous savez que Hostinger envoie un X-Forwarded-For fiable
3. Uploader `config_admin.php` **au meme niveau que** `config_db.php` (hors `public_html`).

## C) Activer le captcha (Cloudflare Turnstile)
1. Creer un compte Cloudflare Turnstile.
2. Ajouter votre domaine et recuperer :
   - **Site Key** (public)
   - **Secret Key** (serveur)

Dans le front (avant build) :
- Creer un fichier `.env.production` a la racine :
  ```
  VITE_TURNSTILE_SITE_KEY=VOTRE_SITE_KEY
  ```

Dans le back :
- Ouvrir `public/api/contact.php`
- Mettre votre secret dans :
  ```
  $turnstileSecret = 'VOTRE_SECRET_KEY';
  ```

## D) Configurer l'email de reception
Fichier : `public/api/contact.php`

Verifier :
- `$recipientEmail` (email qui recoit les messages)
- `$fromEmail` (email d'envoi, sur le meme domaine si possible)

## E) (Optionnel) API sur un autre domaine
Si **l'API PHP est sur le meme domaine**, ne rien faire ici.
Si l'API PHP est sur un autre domaine :
- Ajouter CORS dans `public/api/contact.php` via `$allowedOrigins`.
- Mettre `VITE_API_URL=https://votre-api-domaine.tld` dans `.env.production`.

## F) Builder le site
```bash
npm install
npm run build
```

Le dossier `dist/` contiendra **le site + l'API**.

## G) Deployer sur Hostinger
1. Ouvrir **File Manager** (ou FTP).
2. Aller dans `public_html/`.
3. Uploader **le contenu** de `dist/` (pas le dossier `dist`).
4. Verifier que ces fichiers existent :
   - `public_html/index.html`
   - `public_html/api/contact.php`
   - `public_html/api/.htaccess`
5. Remonter **un niveau au-dessus** de `public_html` (ex: `domains/votredomaine.tld/`).
6. Uploader `config_db.php` dans ce dossier (au meme niveau que `public_html`).
7. Uploader `config_admin.php` dans ce dossier (au meme niveau que `public_html`).

## H) Tester
1. Ouvrir `https://votredomaine.tld/contact`
2. Remplir et envoyer le formulaire.
3. Verifier :
  - email recu,
  - ligne inseree dans `contact_messages` (phpMyAdmin).

Test admin :
- Ouvrir `https://votredomaine.tld/admin/`
- Se connecter avec vos identifiants

Test API (optionnel) :
```bash
curl -X POST "https://votredomaine.tld/api/contact.php" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test\",\"company\":\"A2S\",\"email\":\"test@example.com\",\"phone\":\"+212600000000\",\"interest\":\"Distribution au Maroc\",\"otherInterest\":\"\",\"message\":\"Test message\",\"website_url\":\"\",\"captchaToken\":\"TOKEN\"}"
```

---

## Securite incluse
- Validation serveur stricte (formats + longueurs).
- Honeypot anti-bot.
- Rate limiting basique.
- Captcha (Turnstile).
- Requetes preparees PDO.
- En-tetes HTTP de securite.

## Si un probleme
- **Email non recu** : activer SPF/DKIM/DMARC, sinon passer a SMTP (PHPMailer).
- **Captcha invalide** : verifier Site/Secret key + domaine autorise.
- **Erreur base** : verifier identifiants + privileges + import SQL.
