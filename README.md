# CIVIX - Plateforme Citoyenne de Signalement

## 📋 Table des matières

- [À propos](#à-propos)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [API Endpoints](#api-endpoints)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [CI/CD](#cicd)
- [Diagrammes UML](#diagrammes-uml)
- [Contribution](#contribution)
- [Licence](#licence)

## 🎯 À propos

CIVIX est une application web citoyenne conçue pour permettre aux citoyens marocains de signaler des abus de pouvoir dans les services publics (hôpitaux, police, mairies, etc.). La plateforme offre un système sécurisé, centralisé et transparent pour renforcer la relation entre citoyens et institutions publiques.

### Contexte et Justification

Le projet répond à un besoin réel : de nombreux abus administratifs restent impunis ou ignorés faute de mécanismes de signalement accessibles et transparents. CIVIX vise à :

- 🗣️ **Donner la parole aux citoyens**
- ⚡ **Accélérer le traitement des abus signalés**
- 📊 **Analyser les tendances pour améliorer les services publics**

## ✨ Fonctionnalités

### Pour les Citoyens
- ✅ Inscription et authentification sécurisée
- 📝 Soumission de signalements en ligne
- 📎 Ajout de preuves (documents, photos)
- 🔍 Suivi de l'état des plaintes
- 📈 Consultation des statistiques publiques
- 📱 Interface responsive (mobile, tablette, desktop)

### Pour l'Administration
- 🔐 Authentification avec gestion des rôles
- 📋 Analyse et classification des signalements
- ⚙️ Traitement et transfert des cas
- 📊 Génération de rapports et statistiques
- 👥 Gestion des utilisateurs

## 🛠️ Technologies utilisées

### Backend
- **FastAPI** (Python) - Framework API REST moderne et performant
- **MySQL** - Base de données relationnelle
- **JWT** - Authentification sécurisée
- **SQLAlchemy** - ORM pour la gestion de base de données
- **Pydantic** - Validation des données

### Frontend
- **React.js** - Framework JavaScript pour interfaces utilisateur
- **Tailwind CSS** - Framework CSS utilitaire
- **Axios** - Client HTTP pour les appels API
- **React Router** - Navigation côté client

### DevOps
- **Docker** - Conteneurisation
- **GitHub Actions** - CI/CD
- **MySQL** - Base de données en conteneur

## 🏗️ Architecture

```
civix/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .github/
│   └── workflows/
└── docs/
    ├── uml/
    └── api/
```

## 📋 Prérequis

- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **Node.js** >= 16.0 (pour développement local)
- **Python** >= 3.9 (pour développement local)
- **Git**

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/IJ-Aymane/civix.git
cd civix
```

### 2. Installation avec Docker (Recommandé)

```bash
# Construire et lancer tous les services
docker-compose up --build

# En arrière-plan
docker-compose up -d --build
```

### 3. Installation manuelle (Développement)

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

#### Frontend
```bash
cd frontend
npm install
```

#### Base de données
```bash
# Démarrer MySQL avec Docker
docker run --name civix-mysql -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=civix -p 3306:3306 -d mysql:8.0
```

## ⚙️ Configuration

### Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
# Base de données
DATABASE_URL=mysql://root:rootpassword@localhost:3306/civix
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=civix
MYSQL_USER=civix_user
MYSQL_PASSWORD=civix_password

# JWT
SECRET_KEY=your-super-secret-jwt-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API
API_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_FOLDER=./uploads
```

## 💻 Utilisation

### Démarrage des services

```bash
# Avec Docker Compose
docker-compose up

# Services disponibles :
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8000
# - Documentation API: http://localhost:8000/docs
# - MySQL: localhost:3306
```

### Développement local

```bash
# Backend (Terminal 1)
cd backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Frontend (Terminal 2)
cd frontend
npm start
```

### Comptes de test

```
# Administrateur
Email: admin@civix.ma
Mot de passe: admin123

# Citoyen
Email: citoyen@example.com
Mot de passe: citoyen123
```

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/refresh` - Renouvellement token

### Signalements
- `GET /api/reports` - Liste des signalements
- `POST /api/reports` - Créer un signalement
- `GET /api/reports/{id}` - Détails d'un signalement
- `PUT /api/reports/{id}` - Modifier un signalement
- `DELETE /api/reports/{id}` - Supprimer un signalement

### Utilisateurs
- `GET /api/users/me` - Profil utilisateur
- `PUT /api/users/me` - Modifier le profil
- `GET /api/users` - Liste des utilisateurs (admin)

### Statistiques
- `GET /api/stats/public` - Statistiques publiques
- `GET /api/stats/admin` - Statistiques administrateur

### Documentation complète
Accédez à la documentation Swagger : `http://localhost:8000/docs`

## 🧪 Tests

### Tests Backend
```bash
cd backend
pytest tests/ -v
pytest tests/ --cov=app --cov-report=html
```

### Tests Frontend
```bash
cd frontend
npm test
npm run test:coverage
```

### Tests d'intégration
```bash
docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
```

## 🚀 Déploiement

### Production avec Docker

```bash
# Construire pour la production
docker-compose -f docker-compose.prod.yml up --build -d

# Variables d'environnement de production
cp .env.example .env.prod
# Modifier .env.prod avec vos valeurs de production
```

### Déploiement sur serveur

```bash
# Sur votre serveur
git clone https://github.com/IJ-Aymane/civix.git
cd civix
cp .env.example .env
# Configurer les variables d'environnement
docker-compose -f docker-compose.prod.yml up -d
```

## 🔄 CI/CD

Le projet utilise GitHub Actions pour l'intégration et le déploiement continus :

### Pipeline automatisé
1. **Tests** - Exécution des tests backend et frontend
2. **Build** - Construction des images Docker
3. **Security** - Scan de sécurité des dépendances
4. **Deploy** - Déploiement automatique (sur push vers main)

### Configuration
Les workflows sont définis dans `.github/workflows/` :
- `ci.yml` - Tests et validation
- `cd.yml` - Déploiement automatique

### Secrets GitHub requis
```
DOCKER_HUB_USERNAME
DOCKER_HUB_ACCESS_TOKEN
SERVER_HOST
SERVER_USER
SERVER_SSH_KEY
```

## 📊 Diagrammes UML

### Diagramme de classes
![Diagramme de classes](docs/uml/class-diagram.png)

**Entités principales :**
- `User` - Utilisateurs (citoyens et administrateurs)
- `Report` - Signalements
- `Category` - Catégories de signalements
- `Status` - États des signalements
- `Attachment` - Pièces jointes

### Diagramme de cas d'utilisation
![Diagramme de cas d'utilisation](docs/uml/use-case-diagram.png)

**Acteurs :**
- **Citoyen** : Soumettre signalement, suivre statut, consulter statistiques
- **Administrateur** : Gérer signalements, analyser données, gérer utilisateurs
- **Système** : Notifications, rapports automatiques

## 🤝 Contribution

1. Fork du projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit des changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

### Standards de code
- **Backend** : Suivre PEP 8, utiliser Black pour le formatage
- **Frontend** : Utiliser ESLint et Prettier
- **Commits** : Messages en français, format conventionnel

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Contact

- **Développeur** : IJ-Aymane
- **Email** : ibenjellalaymane@gmail.com
- **GitHub** : [https://github.com/IJ-Aymane

## 🙏 Remerciements

- Communauté FastAPI pour la documentation excellente
- Contributeurs React.js
- Communauté open source

---

**CIVIX** - Pour une administration publique plus transparente et responsable 🇲🇦
