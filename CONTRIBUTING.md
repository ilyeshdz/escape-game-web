# Contribuer au projet Escape Game

Merci de votre intérêt pour ce projet ! Ce document présente les lignes directrices pour contribuer.

## Comment contribuer

### 1. Fork et clonage

```bash
# Forkez le dépôt sur GitHub, puis clonez votre fork
git clone https://github.com/YOUR_USERNAME/escape-game-web.git
cd escape-game-web
```

### 2. Configuration de l'environnement de développement

Ce projet utilise HTML, CSS et JavaScript pur (ES modules) avec pnpm pour la gestion des dépendances de développement.

```bash
# Installer pnpm si nécessaire
npm install -g pnpm

# Installer les dépendances
pnpm install

# Lancer le serveur de développement
# Avec Python:
python -m http.server 8000

# Ou avec Node.js (si installé):
pnpm exec serve .
```

### 3. Créer une branche

```bash
# Assurez-vous d'être sur la branche dev
git checkout dev

# Récupérez les dernières modifications
git pull origin dev

# Créez une nouvelle branche pour vos modifications depuis dev
git checkout -b feat/nom-de-votre-fonctionnalite
```

> **Important** : Toute modification doit partir de la branche `dev`, jamais de `main`.

### 4. Faire des modifications

#### Structure du projet

```
escape-game-web/
├── assets/          # Images et ressources du jeu
├── data/            # Fichiers de configuration JSON
│   ├── gameConfig.json    # Configuration de la machine à états
│   └── hubspots.json      # Éléments interactifs
├── docs/            # Documentation
│   ├── getting-started.md
│   ├── hubspots.md
│   ├── inventory.md
│   ├── flags.md
│   └── statemachine.md
├── scripts/         # Modules JavaScript
│   ├── canvasScene.js    # Rendu canvas
│   ├── flags.js          # Système de flags
│   ├── hubspots.js       # Gestionnaires de hubspots
│   ├── hubspotsData.js   # Chargement des hubspots
│   ├── inventory.js      # Système d'inventaire
│   ├── resizeHandler.js  # Gestion du responsive
│   ├── script.js         # Point d'entrée principal
│   └── stateMachine.js   # Machine à états
├── style.css        # Styles principaux
├── index.html       # Fichier HTML d'entrée
├── package.json     # Configuration pnpm et scripts
├── eslint.config.js # Configuration ESLint
├── .prettierrc      # Configuration Prettier
└── .husky/          # Git hooks (Husky)
```

### Outils de qualité de code

Ce projet utilise des outils pour maintenir la qualité du code :

- **ESLint** : Détecte les erreurs et enforce les bonnes pratiques
- **Prettier** : Formate automatiquement le code
- **Husky** : Git hooks pour vérifier le code avant chaque commit
- **lint-staged** : Ne vérifie que les fichiers modifiés

#### Commandes disponibles

```bash
# Vérifier le code avec ESLint
pnpm lint

# Corriger automatiquement les erreurs ESLint
pnpm lint:fix

# Formater le code avec Prettier
pnpm format

# Vérifier le formatage sans modifier
pnpm format:check
```

#### Workflow de développement

1. Créez une branche pour vos modifications
2. Travaillez sur votre code
3. Avant de committez, lancez `pnpm lint:fix && pnpm format`
4. Committez vos modifications (le hook Husky vérifiera le code automatiquement)

#### Concepts clés

Les **hubspots** sont des éléments interactifs définis dans `data/hubspots.json`. Chaque hubspot possède :

- `id`: Identifiant unique
- `type`: Un parmi : `modal`, `action`, `finish`, `link`, `secret`, `useItem`
- `x`, `y`: Position (0-100%)
- `visibleIn`: Tableau des états où le hubspot est visible
- `emoji`: Émoji optionnel à afficher sur le canvas

Les objets de l'**inventaire** peuvent avoir :

- `id`, `name`, `description`: Propriétés de base
- `emoji`: Icône optionnelle (emoji)
- `icon`: Chemin optionnel vers une image
- `usable`: Booléen pour l'utilisation de l'objet
- `consumable`: Booléen pour une utilisation unique

Les transitions de la **machine à états** sont définies dans `data/gameConfig.json`.

### Workflow de release

Ce projet utilise un workflow de release structuré :

#### Étape 1 : Développement (branche `dev`)

- Toute nouvelle fonctionnalité, correction de bug ou amélioration est développée sur la branche `dev`
- Les Pull Requests doivent cibler la branche `dev`
- La branche `dev` représente toujours l'état de développement le plus récent

#### Étape 2 : Préparation de la release (branche `release/x.y.z`)

Quand une release est prête à être finalisée :

```bash
# Depuis dev, créez une branche de release
git checkout dev
git pull origin dev
git checkout -b release/x.y.z
```

**Sur une branche de release, seuls les éléments suivants sont autorisés :**

- Corrections de bugs
- Améliorations de formatage (Prettier, ESLint)
- Mises à jour de documentation
- Ajustements de configuration pour la release

**Interdit sur une branche de release :**

- Nouvelles fonctionnalités
- Changements structurels majeurs
- Refactorisations importantes

#### Étape 3 : Publication de la release

Une fois les ajustements terminés sur la release :

1. Créez une Pull Request de `release/x.y.z` vers `main`
2. Mettez à jour le numéro de version dans les fichiers pertinents
3. Créez un tag Git avec le numéro de version :
    ```bash
    git tag -a vx.y.z -m "Release version x.y.z"
    git push origin vx.y.z
    ```
4. Mergez la PR dans `main`
5. Mergez `main` dans `dev` pour synchroniser :
    ```bash
    git checkout dev
    git merge main
    git push origin dev
    ```

### 5. Tester vos modifications

1. Ouvrez `index.html` dans votre navigateur
2. Testez la fonctionnalité en profondeur
3. Vérifiez l'absence d'erreurs dans la console
4. Vérifiez le comportement responsive

### 6. Valider vos modifications

Utilisez les [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
# Exemples :
git commit -m "feat: ajouter un nouveau type de hubspot"
git commit -m "fix: résoudre le problème de persistance de l'inventaire"
git commit -m "docs: mettre à jour le guide de démarrage"
git commit -m "style: améliorer l'apparence de l'écran de fin"
```

**Types de commits :**

- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Modifications de documentation
- `style` : Modifications CSS/stylage
- `refactor` : Refactorisation du code
- `test` : Ajout de tests
- `chore` : Tâches de maintenance

### 7. Pusher et créer une PR

```bash
git push origin feat/nom-de-votre-fonctionnalite
```

Créez ensuite une Pull Request sur GitHub ciblant la branche **dev**.

## Conventions de code

### JavaScript

- Utilisez les modules ES6 (`import`/`export`)
- Utilisez `const` par défaut, `let` quand nécessaire
- Utilisez les littéraux de gabarit pour la concaténation
- Utilisez les fonctions fléchées pour les callbacks
- Ajoutez des commentaires JSDoc pour les fonctions

```javascript
/**
 * Ajoute un objet à l'inventaire
 * @param {Object} objet - L'objet à ajouter
 * @returns {boolean} Vrai si l'objet a été ajouté
 */
export function addItem(objet) {
    // ...
}
```

### CSS

- Utilisez les propriétés personnalisées CSS pour les couleurs
- Gardez les styles modulaires
- Utilisez `rem` pour les tailles
- Approche mobile-first

### JSON

- Utilisez une indentation cohérente (2 espaces)
- Validez la syntaxe JSON

### Validation des messages de commit

Ce projet utilise **commitlint** pour valider automatiquement les messages de commit selon le standard [Conventional Commits](https://conventionalcommits.org/).

Si votre message de commit n'est pas valide, le commit sera rejeté. Voici le format attendu :

```
<type>(<scope>): <description>
```

**Types disponibles :**

- `feat` - Nouvelle fonctionnalité
- `fix` - Correction de bug
- `docs` - Documentation
- `style` - Formatage (CSS, JS sans changement de logique)
- `refactor` - Restructuration du code
- `test` - Ajout ou modification de tests
- `chore` - Tâches de maintenance (dépendances, outils, etc.)

**Exemples :**

```
feat(inventory): add item usage system
fix(hubspots): resolve visibility condition issue
docs(readme): update installation instructions
style(css): improve modal animation
```

Le scope (`<scope>`) est optionnel et correspond généralement au module concerné (`inventory`, `hubspots`, `canvas`, etc.).

### Génération du CHANGELOG

Le fichier `CHANGELOG.md` est automatiquement mis à jour via le hook `post-commit` après chaque commit valide.

Pour mettre à jour manuellement :

```bash
pnpm changelog:update
```

Pour générer un CHANGELOG complet depuis le début :

```bash
pnpm changelog
```

## Liste de vérification des tests

Avant de soumettre une PR, vérifiez :

- [ ] Pas d'erreurs dans la console
- [ ] Fonctionne sur différentes tailles d'écran
- [ ] L'inventaire persiste correctement
- [ ] Les transitions d'état fonctionnent comme prévu
- [ ] Les conditions de visibilité des hubspots fonctionnent
- [ ] La documentation est mise à jour si nécessaire
- [ ] La PR cible la branche `dev` (sauf pour les releases)

## Signaler des problèmes

Lorsque vous signalez des problèmes, incluez :

1. **Navigateur et version** (ex: Chrome 120)
2. **Système d'exploitation** (ex: macOS 14)
3. **Étapes pour reproduire**
4. **Comportement attendu**
5. **Comportement actuel**
6. **Captures d'écran** si applicable

## Questions ?

N'hésitez pas à ouvrir une issue pour discuter ou poser des questions.

## Licence

En contribuant, vous acceptez que vos contributions soient sous licence MIT.
