# Escape Game - Projet NSI

Ce projet a été réalisé dans le cadre de l'enseignement de spécialité **Numérique et Sciences Informatiques (NSI)** en classe de Première au **Lycée Lavoisier**.

L'objectif de ce projet est de mettre en pratique les bases du développement web (HTML, CSS, JavaScript) en créant un mini jeu d'évasion (escape game).

## Philosophie du projet

Au lieu de simplement créer un escape game unique, ce projet a été conçu comme un **moteur de jeu d'évasion**. L'idée est de fournir un outil qui permet de créer des escape games de manière **ultra-configurable**, rapidement et sans avoir à modifier le code source.

Cette approche présente plusieurs avantages :

- **Maintenabilité :** Il est plus facile de corriger les bugs et d'ajouter des fonctionnalités au moteur de jeu, qui seront ensuite disponibles pour tous les jeux créés avec.
- **Lisibilité et Simplicité :** La logique du jeu est entièrement définie dans des fichiers de configuration JSON, ce qui la rend plus facile à lire et à comprendre pour des non-développeurs.
- **Rapidité de création :** Une fois le moteur en place, la création de nouveaux scénarios, énigmes et interactions se fait très rapidement en modifiant simplement les fichiers JSON.

Le principal défi de cette approche est de concevoir un moteur suffisamment générique pour gérer tous les cas de figure possibles et imaginables dans un escape game.

## Documentation

Pour un guide détaillé sur la façon de personnaliser le jeu, veuillez consulter notre [documentation](./docs/getting-started.md).

## Comment jouer

Ouvrez le fichier `index.html` dans votre navigateur web.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.
