# Guide de Démarrage Rapide - Admin v2

## ⚡ Installation en 5 Minutes

### 🎯 Étape 1 : Backup (30 secondes)

```bash
# Backup base de données
mysqldump -u u862214716_a2s_admin1 -p u862214716_a2s_db > backup_$(date +%Y%m%d).sql

# Backup ancien fichier
cp public/admin/index.php public/admin/index_old.php
```

### 🎯 Étape 2 : Mise à Jour Base de Données (1 minute)

**Via phpMyAdmin :**
1. Ouvrir phpMyAdmin
2. Sélectionner la base `u862214716_a2s_db`
3. Onglet "SQL"
4. Copier/coller le contenu de `schema_contact_upgraded.sql`
5. Cliquer "Exécuter"

**Via ligne de commande :**
```bash
mysql -u u862214716_a2s_admin1 -p u862214716_a2s_db < schema_contact_upgraded.sql
```

### 🎯 Étape 3 : Vérification (30 secondes)

```sql
-- Vérifier que les colonnes ont été ajoutées
DESCRIBE contact_messages;

-- Devrait afficher :
-- is_read, notes, priority, status, updated_at
```

### 🎯 Étape 4 : Déploiement (1 minute)

**Option A : Test d'abord (Recommandé)**
```bash
# Garder les 2 versions pour tester
# Ancienne : /admin/index.php
# Nouvelle : /admin/index_v2.php

# Tester : https://a2s.ma/admin/index_v2.php
```

**Option B : Remplacement direct**
```bash
cp public/admin/index_v2.php public/admin/index.php
```

### 🎯 Étape 5 : Test (2 minutes)

1. Ouvrir `https://a2s.ma/admin/index_v2.php`
2. Se connecter (identifiants inchangés)
3. Vérifier que les statistiques s'affichent
4. Tester la recherche
5. Tester l'export CSV

---

## ✅ Checklist Ultra-Rapide

```
□ Backup DB effectué
□ Backup index.php effectué
□ Migration SQL exécutée
□ Colonnes vérifiées (DESCRIBE)
□ index_v2.php copié
□ Test connexion OK
□ Statistiques affichées
□ Recherche fonctionne
□ Export CSV fonctionne
```

---

## 🚨 Problèmes Courants

### ❌ Statistiques affichent 0

**Solution :**
```sql
-- Vérifier si les colonnes existent
SHOW COLUMNS FROM contact_messages LIKE 'is_read';

-- Si vide, relancer la migration
SOURCE schema_contact_upgraded.sql;
```

### ❌ Erreur "Database connection failed"

**Solution :**
Vérifier `config_db.php` :
```php
'host' => 'localhost',
'name' => 'u862214716_a2s_db',
'user' => 'u862214716_a2s_admin1',
'pass' => 'V4NQfj=|hM7',
```

### ❌ Page blanche

**Solution :**
```bash
# Vérifier les logs PHP
tail -f /var/log/php/error.log

# Vérifier les permissions
chmod 644 public/admin/index_v2.php
```

---

## 📊 Fonctionnalités Principales

### 1. Recherche Rapide
```
🔍 [Rechercher...] → Tapez nom/email/société
```

### 2. Filtres
```
[Tous ▼] → Non lus / Lus
[Tous statuts ▼] → Nouveaux / En cours / Résolus
```

### 3. Export CSV
```
[📥 Export CSV] → Téléchargement instantané
```

### 4. Actions Messages
```
[✓ Lire] → Marque comme lu
[🗑 Supprimer] → Supprime (avec confirmation)
```

### 5. Tri
```
Cliquez sur : Date ↓ | Nom | Société | Email
```

---

## 🎨 Personnalisation Rapide

### Changer la couleur primaire (Vert → Bleu)

Dans `index_v2.php`, remplacer :
```css
/* Ligne ~180 */
background: linear-gradient(135deg, #10b981 0%, #34d399 100%);

/* Par : */
background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
```

### Changer le nombre par page par défaut

Dans `index_v2.php`, ligne ~440 :
```php
$perPage = (int)($_GET['per_page'] ?? 25);  // 25 → 50
```

---

## 📞 Support Rapide

### Logs à Vérifier
```bash
# Erreurs PHP
tail -f /var/log/php/error.log

# Erreurs Apache
tail -f /var/log/apache2/error.log

# Erreurs MySQL
tail -f /var/log/mysql/error.log
```

### Rollback Rapide
```bash
# Si problème, revenir à l'ancienne version
cp public/admin/index_old.php public/admin/index.php

# Restaurer la DB (si nécessaire)
mysql -u user -p database < backup_20260202.sql
```

---

## 🎯 Prochaines Étapes

1. ✅ Installation terminée
2. 📖 Lire [ADMIN_UPGRADE_GUIDE.md](ADMIN_UPGRADE_GUIDE.md) pour les détails
3. 📊 Lire [ADMIN_IMPROVEMENTS_SUMMARY.md](ADMIN_IMPROVEMENTS_SUMMARY.md) pour les fonctionnalités
4. 🎓 Former les utilisateurs
5. 📈 Profiter des 7h/mois gagnées !

---

**C'est tout ! Vous êtes prêt ! 🚀**

*Document créé le 2 février 2026*
