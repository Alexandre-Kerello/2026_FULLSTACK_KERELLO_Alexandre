# 🛠️ Stack technologique recommandée
## Frontend

* React + Vite (build ultra rapide)  
* Tailwind CSS + shadcn/ui → le combo gagnant pour une UI pro et rapide à coder. shadcn te donne des composants prêts à l'emploi (modals, tables, forms, charts) que tu personnalises avec Tailwind 
* lucide-react pour les icônes 
* React Router v6 pour la navigation  
* Recharts pour les graphiques (parfait pour une app bancaire)  
* Axios pour les appels API  

## Backend

Node.js + Express + TypeScript (fortement recommandé pour une app bancaire, ça t'évite les bugs de types sur des montants)
Mongoose (ODM pour MongoDB)
JWT pour l'auth (access token + refresh token)
bcrypt pour le hashage des mots de passe
Zod pour la validation des données

## Base de données

MongoDB via Docker Compose

---


# 🗂️ Architecture du projet  
bank-manager/  
├── docker-compose.yml  
├── README.md  
│  
├── backend/  
│   ├── src/  
│   │   ├── config/  
│   │   │   └── db.ts              # Connexion MongoDB  
│   │   ├── middleware/  
│   │   │   ├── auth.middleware.ts  # Vérif JWT  
│   │   │   └── error.middleware.ts  
│   │   ├── modules/  
│   │   │   ├── auth/  
│   │   │   │   ├── auth.routes.ts  
│   │   │   │   ├── auth.controller.ts  
│   │   │   │   └── auth.service.ts  
│   │   │   ├── users/  
│   │   │   │   ├── user.model.ts  
│   │   │   │   ├── user.routes.ts  
│   │   │   │   └── user.controller.ts  
│   │   │   ├── accounts/          # Ressource principale  
│   │   │   │   ├── account.model.ts  
│   │   │   │   ├── account.routes.ts  
│   │   │   │   └── account.controller.ts  
│   │   │   └── transactions/           # Ressource secondaire  
│   │   │       ├── transaction.model.ts  
│   │   │       ├── transaction.routes.ts  
│   │   │       └── transaction.controller.ts  
│   │   └── index.ts  
│   ├── package.json  
│   └── tsconfig.json  
│  
└── frontend/  
    ├── src/  
    │   ├── assets/  
    │   ├── components/  
    │   │   ├── ui/                # Composants shadcn  
    │   │   ├── layout/  
    │   │   │   ├── Navbar.tsx  
    │   │   │   └── Sidebar.tsx  
    │   │   └── shared/  
    │   │       ├── TransactionCard.tsx  
    │   │       └── AccountCard.tsx  
    │   ├── pages/  
    │   │   ├── public/  
    │   │   │   ├── Home.tsx       # Landing page publique  
    │   │   │   └── Login.tsx  
    │   │   └── private/  
    │   │       ├── Dashboard.tsx  
    │   │       ├── Accounts.tsx  
    │   │       ├── Transactions.tsx  
    │   │       └── Settings.tsx  
    │   ├── hooks/  
    │   │   └── useAuth.ts  
    │   ├── services/  
    │   │   ├── api.ts             # Instance Axios  
    │   │   ├── auth.service.ts  
    │   │   └── account.service.ts  
    │   ├── store/                 # Context API ou Zustand  
    │   │   └── authStore.ts  
    │   └── router/  
    │       ├── AppRouter.tsx  
    │       └── ProtectedRoute.tsx  
    └── package.json  

# 📅 Planning des fonctionnalités
## 🧱 Sprint 1 — Fondations (Jours 1–2)
**Objectif :** Mise en place d'un environnement de développement stable et conteneurisé.

| État | Tâche | Détail |
| :---: | :--- | :--- |
| [x] | **Setup Docker + MongoDB** | Configuration du `docker-compose.yml` avec MongoDB + Mongo Express. |
| [x] | **Init Backend Express/TS** | Structure de dossiers, connexion DB, middleware de gestion d'erreurs. |
| [x] | **Init Frontend Vite/React** | Installation de Tailwind CSS + configuration de **shadcn/ui**. |
| [x] | **Repo GitHub** | Création du dépôt, `.gitignore`, branches et README initial. |

---

## 🔐 Sprint 2 — Auth & Sécurité (Jours 3–4)
**Objectif :** Sécuriser l'accès aux données utilisateur.

| État | Tâche | Détail |
| :---: | :--- | :--- |
| [ ] | **Register / Login (Backend)** | Hachage des mots de passe (bcrypt) + génération de tokens **JWT**. |
| [ ] | **Routes Protégées (API)** | Création d'un middleware d'authentification pour sécuriser les endpoints. |
| [ ] | **Pages Login / Register** | Formulaires avec validation (Zod) et gestion des erreurs. |
| [ ] | **Gestion du Token (Front)** | Stockage local/cookie, persistance de session et `ProtectedRoute`. |

---

## 💳 Sprint 3 — Ressource principale : Comptes (Jours 5–6)
**Objectif :** Gérer les différents portefeuilles (Courant, Épargne, Cash).

| État | Tâche | Détail |
| :---: | :--- | :--- |
| [ ] | **CRUD Accounts (API)** | Endpoints `GET`, `POST`, `PUT`, `DELETE` pour `/api/accounts`. |
| [ ] | **Page Accounts (Frontend)** | Liste des comptes, formulaires de création, édition et suppression. |
| [ ] | **Solde Dynamique** | Logique de calcul automatique du solde basé sur les transactions. |

---

## 💸 Sprint 4 — Transactions (Jours 7–8)
**Objectif :** Manipulation des flux financiers.

| État | Tâche | Détail |
| :---: | :--- | :--- |
| [ ] | **CRUD Transactions (API)** | Endpoints avec filtres par compte, date et catégorie. |
| [ ] | **Page Transactions (Front)** | Tableau paginé, filtres de recherche et ajout rapide. |
| [ ] | **Catégories** | Système de tags (Alimentation, Transport, Loisirs, Santé...). |

---

## 📊 Sprint 5 — Dashboard & Dataviz (Jours 9–10)
**Objectif :** Rendre les données parlantes pour l'utilisateur.

| État | Tâche | Détail |
| :---: | :--- | :--- |
| [ ] | **Dashboard Principal** | Vue globale du solde total et des dernières transactions. |
| [ ] | **Graphiques Recharts** | Visualisation de l'évolution du solde et dépenses par catégorie. |
| [ ] | **Page Publique (Landing)** | Présentation de l'application et statistiques anonymisées. |

---

## ✨ Sprint 6 — Finitions & Bonus (Jours 11–12)
**Objectif :** Optimisation UX et documentation finale.

| État | Tâche | Détail |
| :---: | :--- | :--- |
| [ ] | **Settings Utilisateur** | Modification du profil et du mot de passe. |
| [ ] | **Export CSV** | Fonctionnalité d'exportation des transactions pour tableur. |
| [ ] | **Responsive Mobile** | Optimisation des breakpoints Tailwind pour tous les écrans. |
| [ ] | **README Complet** | Guide d'installation, variables d'environnement et schéma d'architecture. |

# ⭐ Fonctionnalités bonus à valoriser

* Export CSV des transactions
* Virement entre comptes (ex : courant → épargne)
* Objectifs d'épargne avec barre de progression
* Notifications (solde bas, dépense inhabituelle)
* Mode sombre (trivial avec Tailwind + shadcn)