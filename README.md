# Portfolio Moderne - Next.js & Firebase

Un portfolio professionnel, dynamique et entièrement administrable, conçu pour mettre en avant vos projets et compétences avec une expérience utilisateur fluide.

## 🚀 Fonctionnalités

### Interface Publique
- **Design Réactif & Moderne** : Optimisé pour mobile, tablette et desktop avec Tailwind CSS.
- **Mode Sombre/Clair** : Support complet du thème selon les préférences système.
- **Exploration Contextuelle** : Les détails des projets s'ouvrent dans une fenêtre modale élégante, permettant de visionner des vidéos et d'explorer les technologies sans quitter la page.
- **Barre de Progression & Statut** : Affichage du niveau de réalisation (barre animée) et du statut (En ligne / Local) pour chaque projet.
- **Contact Dynamique** : Formulaire de contact fonctionnel avec intégration Brevo et liens vers les réseaux sociaux.

### Interface Administration (`/admin`)
- **Tableau de Bord Complet** : Vue d'ensemble des statistiques de visite et d'interaction.
- **Configuration Brevo** : Paramétrage simple de la clé API pour l'envoi d'emails.
- **Gestion des Projets** : CRUD complet avec ajout de liens GitHub, URL vidéo, technologies et niveaux de progression.
- **Gestion des Paramètres** : Modification instantanée des textes Hero, À propos et informations de contact.

## 📧 Configuration de l'envoi d'emails (Brevo)

Pour activer le formulaire de contact :
1. Créez un compte sur [Brevo](https://www.brevo.com/).
2. Allez dans **SMTP & API** et générez une **Clé API v3**.
3. Dans l'interface admin de votre portfolio (`/admin/settings`), collez cette clé dans le champ "Clé API Brevo".
4. **Important** : L'adresse email de contact définie dans les paramètres doit être un **expéditeur vérifié** dans votre compte Brevo.

## 🛠 Technologies utilisées

- **Framework** : [Next.js 15+](https://nextjs.org/) (App Router)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Style** : [Tailwind CSS](https://tailwindcss.com/)
- **Base de données & Auth** : [Firebase](https://firebase.google.com/) (Firestore & Authentication)
- **Envoi de mail** : [Brevo API v3](https://developers.brevo.com/)
- **Icônes** : [Lucide React](https://lucide.dev/)

## 📦 Installation et Développement

1. **Installer les dépendances** :
   ```bash
   npm install
   ```
2. **Configurer Firebase** :
   Créez un fichier `.env.local` avec vos identifiants Firebase (voir `src/lib/firebase.ts`).
3. **Lancer en local** :
   ```bash
   npm run dev
   ```

## 🚀 Déploiement

Le projet est optimisé pour **Firebase Hosting** :

```bash
# Build du projet
npm run build

# Déploiement
npx firebase deploy --only hosting
```

---
Réalisé par **Taiger Dev** 2026.
