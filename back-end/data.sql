-- Création de la base de données
CREATE DATABASE IF NOT EXISTS signalement_db;
USE signalement_db;

-- Table des administrateurs
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des citoyens avec informations personnelles
CREATE TABLE citizen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    numero_telephone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des signalements (sans informations personnelles du citoyen)
CREATE TABLE signalements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    citizen_id INT NOT NULL,
    titre VARCHAR(255) NOT NULL,
    localisation VARCHAR(255) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    commentaire TEXT,
    categorie ENUM('police', 'hopital', 'admin') NOT NULL,
    gravite ENUM('mineur', 'majeur', 'urgent') DEFAULT 'mineur',
    status ENUM('nouveau', 'en_cours', 'résolu') DEFAULT 'nouveau',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES citizen(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optionnel : Ajout d'un index pour améliorer les recherches par ville
CREATE INDEX idx_ville ON signalements(ville);

-- Optionnel : Ajout d'un index pour améliorer les recherches par catégorie
CREATE INDEX idx_categorie ON signalements(categorie);


INSERT INTO admin (email, password_hash)
VALUES (
    'admin2@example.com',
    '$2b$12$kLNfGDMUgAd8Rybj6Z7Aa.ZdlrqUtuFujYQLlrTZ/ciNMTvY3KoBW'
);
