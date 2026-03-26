# 2026_FULLSTACK_KERELLO_Alexandre

## Description

Ce projet est une application fullstack permettant la gestion de ses comptes bancaires. Il englobe une partie backend et une partie frontend.

---

## Prérequis

- **Git**
- **Docker et Docker Compose**  
- **Un navigateur web**

---

## Installation & Lancement

Suivez les étapes ci-dessous pour installer et lancer le projet en local.

### 1. Cloner le dépôt

```bash
git clone https://github.com/Alexandre-Kerello/2026_FULLSTACK_KERELLO_Alexandre.git
cd 2026_FULLSTACK_KERELLO_Alexandre
```

### 2. Renommer et remplir le .env

Renommez le fichier `.env.example` situé dans `/backend`

```bash
cp backend/.env.example backend/.env.development.local
```

Remplissez le fichier `.env.development.local`

```bash
nano backend/.env.development.local
```

### 3. Lancer le projet dockerisée

Assurez-vous que Docker est démarré, puis exécutez :

```bash
docker-compose up --build -d
```

Cela lancera le conteneur de la base de données MongoDB.

Accédez ensuite à l'URL suivante : http://localhost:5173.

---

## Structure du projet

```
.
├── backend/       # Code source du backend (API, logique métier)
│   ├── src/
│   ├── package.json
│   └── ...
├── frontend/      # Code source du frontend (application web)
│   ├── src/
│   ├── package.json
│   └── ...
├── documentation/ # Documentation et fichiers de suivi
│   ├── Evaluation.pdf
│   └── ...
├── docker-compose.yml
├── README.md
└── ...
```

---

## Fonctionnalités principales

- Authentification des utilisateurs
- Gestion des comptes bancaires et des transactions associées à chaque compte.
- Interface responsive
- Analyse des comptes avec des graphiques

---

## Technologies utilisées

- Frontend : React avec Tailwindcss et Recharts
- Backend : Node.js/Express
- Base de données : MongoDB
- Docker, Docker Compose

---

## Contact

Alexandre Kerello
https://github.com/Alexandre-Kerello