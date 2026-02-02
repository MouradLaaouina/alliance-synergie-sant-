-- Migration pour ajouter les nouvelles colonnes à la table contact_messages
-- Exécutez ce script pour mettre à jour votre base de données existante

-- Ajouter la colonne 'is_read' pour marquer les messages comme lus
ALTER TABLE `contact_messages`
ADD COLUMN `is_read` TINYINT(1) NOT NULL DEFAULT 0 AFTER `ip_address`;

-- Ajouter la colonne 'notes' pour les notes administratives
ALTER TABLE `contact_messages`
ADD COLUMN `notes` TEXT NULL AFTER `is_read`;

-- Ajouter la colonne 'priority' pour la priorité des messages
ALTER TABLE `contact_messages`
ADD COLUMN `priority` ENUM('low', 'normal', 'high') NOT NULL DEFAULT 'normal' AFTER `notes`;

-- Ajouter la colonne 'status' pour le statut de traitement
ALTER TABLE `contact_messages`
ADD COLUMN `status` ENUM('new', 'in_progress', 'resolved', 'archived') NOT NULL DEFAULT 'new' AFTER `priority`;

-- Ajouter la colonne 'updated_at' pour suivre les modifications
ALTER TABLE `contact_messages`
ADD COLUMN `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`;

-- Ajouter des index pour améliorer les performances des requêtes
ALTER TABLE `contact_messages`
ADD INDEX `idx_contact_is_read` (`is_read`),
ADD INDEX `idx_contact_status` (`status`),
ADD INDEX `idx_contact_priority` (`priority`);

/* Créer une table pour les logs d'activité admin (optionnel)
CREATE TABLE IF NOT EXISTS `admin_activity_log` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_user` VARCHAR(100) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `message_id` BIGINT UNSIGNED NULL,
  `details` TEXT NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_activity_created_at` (`created_at`),
  INDEX `idx_activity_admin` (`admin_user`),
  FOREIGN KEY (`message_id`) REFERENCES `contact_messages`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
*/