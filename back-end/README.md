Système de Signalement API
Une API RESTful développée avec FastAPI pour gérer un système de signalements.
Fonctionnalités

Gestion complète des utilisateurs (inscription, authentification, etc.)
Gestion des signalements avec différentes catégories et niveaux de gravité
Filtrage des signalements par ville, catégorie, et utilisateur
Sécurité avec OAuth2 et JWT

Prérequis

Python 3.9+
MySQL ou MariaDB

Installation

Cloner le dépôt

bashgit clone <url-du-depot>
cd <nom-du-dossier>

Créer et activer un environnement virtuel

bashpython -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

Installer les dépendances

bashpip install -r requirements.txt

Configurer les variables d'environnement
Créez un fichier .env à la racine du projet en vous basant sur le fichier .env.example et ajustez les valeurs selon votre configuration.
Initialiser la base de données

bashpython -m app.core.init_db
Démarrage
Pour lancer l'application en mode développement :
bashuvicorn app.main:app --reload
L'API sera disponible à l'adresse http://localhost:8000.
Documentation API
Une fois l'application lancée, vous pouvez accéder à la documentation interactive :

Swagger UI: http://localhost:8000/docs
ReDoc: http://localhost:8000/redoc

Structure du projet
.
│   .env
│   README.md
│   requirements.txt
│
└───app
    │   main.py
    │   __init__.py
    │
    ├───api
    │   │   auth.py
    │   │   signalement.py
    │   │   user.py
    │   │   __init__.py
    │
    ├───core
    │   │   config.py
    │   │   database.py
    │   │   init_db.py
    │
    ├───crud
    │   │   signalement.py
    │   │   user.py
    │
    ├───models
    │   │   signalement.py
    │   │   user.py
    │
    ├───schemas
    │   │   signalement.py
    │   │   user.py
    │
    └───utils
        │   security.py
Endpoints principaux
Authentification

POST /api/auth/token - Obtenir un token d'accès
GET /api/auth/me - Obtenir les informations de l'utilisateur connecté

Utilisateurs

POST /api/users - Créer un utilisateur
GET /api/users - Liste des utilisateurs
GET /api/users/{user_id} - Détails d'un utilisateur
PUT /api/users/{user_id} - Mettre à jour un utilisateur
DELETE /api/users/{user_id} - Supprimer un utilisateur

Signalements

POST /api/signalements - Créer un signalement
GET /api/signalements - Liste des signalements
GET /api/signalements/{signalement_id} - Détails d'un signalement
PUT /api/signalements/{signalement_id} - Mettre à jour un signalement
DELETE /api/signalements/{signalement_id} - Supprimer un signalement
GET /api/signalements/user/{user_id} - Signalements d'un utilisateur
GET /api/signalements/ville/{ville} - Signalements par ville
GET /api/signalements/categorie/{categorie} - Signalements par catégorie