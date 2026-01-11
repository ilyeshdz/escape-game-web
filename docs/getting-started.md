# Getting Started

Ce guide vous expliquera comment personnaliser le jeu d'évasion.

## Prérequis

- Un navigateur web moderne (Chrome, Firefox, Edge, etc.).
- Un éditeur de texte (VS Code, Sublime Text, etc.).
- [pnpm](https://pnpm.io/) (optionnel, pour les outils de qualité de code)

## Installation

```bash
# Installer pnpm si nécessaire
npm install -g pnpm

# Installer les dépendances de développement
pnpm install
```

## Structure du projet

Le projet est structuré comme suit:

- `index.html`: Le point d'entrée de l'application.
- `style.css`: Les styles CSS pour l'application.
- `assets/`: Contient les images et autres ressources.
- `data/`: Contient les fichiers de configuration JSON.
- `scripts/`: Contient le code JavaScript de l'application.
- `docs/`: Contient la documentation.

## Personnalisation

La personnalisation du jeu se fait principalement en modifiant les fichiers JSON dans le dossier `data`.

Pour une documentation détaillée sur chaque partie du moteur de jeu, veuillez consulter les fichiers suivants:

- [**Machine à états (`statemachine.md`)**](./statemachine.md): Pour comprendre comment gérer les états et les transitions du jeu.
- [**Hubspots (`hubspots.md`)**](./hubspots.md): Pour apprendre à créer et configurer les zones interactives.
- [**Inventaire (`inventory.md`)**](./inventory.md): Pour gérer les objets que le joueur peut collecter et utiliser.
- [**Flags (`flags.md`)**](./flags.md): Pour utiliser des variables afin de contrôler la visibilité et le comportement des hubspots.

### Changer l'image de fond

Pour changer l'image de fond, remplacez le fichier `assets/scene1.png` par votre propre image. Vous pouvez également modifier le nom du fichier dans `index.html` si vous le souhaitez.

### Personnaliser l'apparence des hubspots

Les hubspots peuvent afficher des émojis au lieu de cercles blancs. Ajoutez simplement la propriété `emoji` à un hubspot:

```json
{
    "id": "chest",
    "type": "modal",
    "visibleIn": ["room1"],
    "emoji": "📦",
    "x": 50,
    "y": 50,
    "modalText": "Un coffre au trésor!"
}
```

## Lancer le jeu

Pour jouer, ouvrez simplement le fichier `index.html` dans votre navigateur.

## Outils de développement

Ce projet utilise des outils pour maintenir la qualité du code :

```bash
# Vérifier le code avec ESLint
pnpm lint

# Corriger automatiquement les erreurs ESLint
pnpm lint:fix

# Formater le code avec Prettier
pnpm format
```
