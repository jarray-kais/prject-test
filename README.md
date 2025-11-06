# Projet MERN – Gestion de Projets

Application MERN (MongoDB, Express, React, Node) avec authentification (cookie), création/édition de projets, et reviews.

## Stack
- Client: React + Vite, React Router, Bootstrap 5
- Serveur: Node.js, Express, Mongoose, JWT cookie
- Base: MongoDB Atlas

## Prérequis
- Node.js >= 18
- Compte MongoDB Atlas (ou instance MongoDB locale)

## Structure
```
projet/
  client/
  server/
```

## Configuration des variables d'environnement

### Server (.env dans `server/`)
Exemple:
```
PORT=5000
MONGODB_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/<DB>?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:5173
JWT_SECRET=changeme
```

- MONGODB_URI: utilisez l'URI SRV d'Atlas (veillez à autoriser votre IP dans Atlas).
- FRONTEND_URL: l’URL du client pour CORS avec credentials.

### Client (.env dans `client/`)
Exemple:
```
VITE_API_URL=http://localhost:5000/api
```

## Installation et démarrage

### 1) Server
```bash
cd server
npm install
npm run dev
```
- Démarre sur `http://localhost:5000`
- Routes API principales: `/api/users`, `/api/projets`, `/api/reviews`, `/api/check-auth`

### 2) Client
```bash
cd client
npm install
npm run dev
```
- Ouvre `http://localhost:5173`

## Fonctionnalités principales
- Authentification (login/logout) par cookie HTTPOnly
- Navbar avec bouton "Créer projet" visible si connecté
- Pages protégées: `/projet/create`, `/projet/:id`, `/projet/:id/edit`
- Liste paginée des projets (Home)
- Détails d’un projet + CRUD reviews (si connecté)
- Création/édition de projet (auteur seulement)

## Scripts utiles
### Server
- `npm run dev`: nodemon en développement

### Client
- `npm run dev`: Vite en développement

## Notes de dev
- CORS: `server/server.js` utilise `FRONTEND_URL` et `credentials: true`.
- Axios client: `client/src/services/api.js` centralise les appels (`authAPI`, `projetAPI`, `reviewAPI`).
- Contexte utilisateur: `StoreContext` stocke `user` (dérivé de `localStorage`).


