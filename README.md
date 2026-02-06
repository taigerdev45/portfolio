# Portfolio Moderne - Next.js & Firebase

Un portfolio professionnel, dynamique et entièrement administrable, conçu pour mettre en avant vos projets et compétences avec une expérience utilisateur fluide.

## Fonctionnalités

### Interface Publique
- **Design Réactif & Moderne** : Optimisé pour mobile, tablette et desktop avec Tailwind CSS.
- **Mode Sombre/Clair** : Support complet du thème selon les préférences système.
- **Section Projets** : Affichage dynamique des projets récupérés depuis Firestore.
- **Contact Card** : Liens vers les réseaux sociaux (GitHub, LinkedIn, Email) synchronisés en temps réel.

### Interface Administration (`/admin`)
- **Tableau de Bord Complet** : Vue d'ensemble des statistiques de visite (via Firestore).
- **Gestion des Paramètres** : Modification directe du titre, sous-titre, texte "À propos" et liens de contact.
- **Gestion des Projets** : CRUD complet (Ajout, Modification, Suppression) des projets avec support d'image.
- **Gestion des Compétences** : Personnalisation des cartes de compétences sur la page d'accueil.

### Optimisations Techniques
- **Compression d'Image Auto** : Redimensionnement et compression JPEG côté client pour respecter les limites de Firestore (1Mo) tout en gardant une haute qualité.
- **Sync Firestore** : Synchronisation en temps réel des données pour une mise à jour instantanée du portfolio.
- **Export Statique** : Configuration pour un déploiement ultra-rapide sur Firebase Hosting.

## Technologies utilisées

- **Framework** : [Next.js 15+](https://nextjs.org/) (App Router)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Style** : [Tailwind CSS](https://tailwindcss.com/)
- **Base de données & Auth** : [Firebase](https://firebase.google.com/) (Firestore & Authentication)
- **Icônes** : [Lucide React](https://lucide.dev/)

## Installation et Développement
  ```

 **Installer les dépendances** :
   ```bash
   npm install
   ```
 **Lancer en local** :
   ```bash
   npm run dev
   ```

## Déploiement

Le projet est configuré pour être déployé sur **Firebase Hosting** :

```bash
# Build du projet (export statique)
npm run build

# Déploiement sur Firebase
npx firebase deploy --only hosting
```

---
Réalisé par **Taiger Dev** 2026.
