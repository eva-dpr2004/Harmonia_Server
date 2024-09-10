# Harmonia - Backend (Server)

## Description

Ce serveur backend fait partie de l'application Harmonia. Il est développé en Node.js avec Express pour gérer les routes et les requêtes HTTP. Il utilise Sequelize pour interagir avec une base de données MySQL. Le backend gère les opérations telles que l'authentification des utilisateurs, la gestion des animaux, des activités, et d'autres fonctionnalités essentielles.

## Structure du Projet

Le projet est organisé comme suit :

- **`config/`** : Contient les fichiers de configuration, comme `config.json` pour les paramètres de la base de données.
- **`controllers/`** : Contient les contrôleurs qui gèrent la logique métier pour chaque modèle.
- **`middlewares/`** : Contient les middlewares comme `AuthMiddleware.js` pour la gestion de l'authentification et d'autres vérifications.
- **`models/`** : Contient les définitions de modèles Sequelize qui représentent les tables de la base de données.
- **`routes/`** : Contient les définitions des routes pour les différentes API, comme les routes pour les activités, les animaux, et les utilisateurs.
- **`.env`** : Fichier d'environnement contenant les variables sensibles comme les secrets JWT, les identifiants de la base de données, etc.
- **`server.js`** : Fichier principal qui démarre le serveur Express.

## Prérequis

- Node.js (version recommandée : 14.x ou supérieure)
- npm
- WAMP Server (ou tout autre serveur MySQL) pour gérer la base de données MySQL

## Installation

1. **Cloner le dépôt :**

   ```bash
   git clone https://github.com/eva-dpr2004/harmonia_server.git
   cd harmonia-server

    Installer les dépendances :

    bash

npm install

Configurer les variables d'environnement :

Créez un fichier .env dans le répertoire racine du projet et configurez les variables d'environnement nécessaires.

Configurer la base de données :
Assurez-vous que MySQL est installé et configuré sur votre WAMP Server. Vous devez créer une base de données pour l'application :
    Nom de la base de données : harmonia
    Importez les migrations et les modèles Sequelize en utilisant la commande suivante pour créer les tables dans la base de données :

bash

    npx sequelize-cli db:migrate

Lancer l'application

Pour lancer le serveur en mode développement avec Nodemon, utilisez la commande suivante :

bash

npm start

Le serveur sera lancé et écoutera sur le port 3000 (ou un autre port spécifié dans votre configuration).
Scripts Disponibles

    npm start : Démarre le serveur avec Nodemon pour recharger automatiquement le code lors des changements.
    npx sequelize-cli db:migrate : Applique les migrations pour mettre à jour la base de données.

Technologies Utilisées

    Node.js : Environnement d'exécution JavaScript côté serveur.
    Express : Framework web pour Node.js.
    Sequelize : ORM pour interagir avec une base de données MySQL.
    JWT (jsonwebtoken) : Utilisé pour l'authentification et la gestion des tokens.
    bcrypt : Pour le hachage des mots de passe.
    dotenv : Pour la gestion des variables d'environnement.
    cors : Pour gérer les problèmes de politique de même origine.
    Validator : Pour valider et nettoyer les données.
    Nodemon : Outil pour développer des applications Node.js avec rechargement automatique.

Auteure

Eva de Palma-Rosario