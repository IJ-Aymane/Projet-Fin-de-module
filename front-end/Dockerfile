# Utiliser une image légère de Node.js
FROM node:20-alpine

# Définir le dossier de travail dans le conteneur
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package*.json ./

# Installer les dépendances de production uniquement (pas besoin des devDependencies pour servir l'app)
RUN npm install --production

# Copier le reste du code source
COPY . .

# Construire l'application Vite (génère le dossier dist/)
RUN npm run build

# Exposer le port 3000
EXPOSE 3000

# Lancer le serveur pour servir les fichiers statiques depuis dist/
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
