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

Ce projet utilise un workflow structuré avec des branches dédiées pour chaque type de contribution.

#### Vue d'ensemble des types de contributions

| Type                    | Préfixe         | Branche Source | Branche Cible  |
| ----------------------- | --------------- | -------------- | -------------- |
| Nouvelle fonctionnalité | `feat/`         | `dev`          | `dev`          |
| Correction de bug       | `fix/`          | `dev`          | `dev`          |
| Documentation           | `docs/`         | `dev`          | `dev`          |
| Style/formatage         | `style/`        | `dev`          | `dev`          |
| Refactorisation         | `refactor/`     | `dev`          | `dev`          |
| Maintenance             | `chore/`        | `dev`          | `dev`          |
| Hotfix (production)     | `hotfix/`       | `main`         | `main` → `dev` |
| Préparation release     | `release/x.y.z` | `dev`          | `main`         |

---

#### Convention de nommage des versions (Semantic Versioning)

Le format est `MAJOR.MINOR.PATCH` (ex: `1.2.0`)

| Composant       | Signification                                 | Quand incrémenter                                                                 |
| --------------- | --------------------------------------------- | --------------------------------------------------------------------------------- |
| **MAJOR** (`x`) | Breaking changes, refonte majeure             | Nouveau épisode, changement structurel affectant la compatibilité des sauvegardes |
| **MINOR** (`y`) | Nouvelles fonctionnalités backward-compatible | Nouvelle salle, nouveau puzzle, nouveau type de hubspot                           |
| **PATCH** (`z`) | Corrections de bugs et améliorations          | Bug fixes, perf improvements, ajustements CSS                                     |

**Exemples :**

- `1.0.0` → Version initiale
- `1.1.0` → Ajout d'une nouvelle salle de puzzle
- `1.1.1` → Correction d'un bug de persistance de l'inventaire
- `2.0.0` → Nouvel épisode avec refonte de l'interface

---

#### Workflow 1 : Ajouter une nouvelle fonctionnalité

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. SYNCHRONISER                                                  │
├─────────────────────────────────────────────────────────────────┤
│ git checkout dev                                                 │
│ git pull origin dev                                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. CRÉER LA BRANCHE DE FEATURE                                   │
├─────────────────────────────────────────────────────────────────┤
│ git checkout -b feat/nom-de-la-fonctionnalite                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. DÉVELOPPER                                                     │
│ - Implémenter la fonctionnalité                                  │
│ - Ajouter/Modifier les tests si applicable                      │
│ - Mettre à jour la documentation si nécessaire                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. VÉRIFICATION QUALITÉ                                           │
├─────────────────────────────────────────────────────────────────┤
│ pnpm lint:fix                                                    │
│ pnpm format                                                      │
│ # Tester dans le navigateur                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. COMMITTER                                                      │
├─────────────────────────────────────────────────────────────────┤
│ git add .                                                        │
│ git commit -m "feat(inventory): add item combination system"     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. PUSHER & CRÉER PR                                             │
├─────────────────────────────────────────────────────────────────┤
│ git push origin feat/nom-de-la-fonctionnalite                   │
│ # Créer PR sur GitHub ciblant "dev"                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. REVIEW & MERGE                                                │
│ - Les mainteneurs review la PR                                   │
│ - Corriger les retours si nécessaire                             │
│ - PR mergée dans dev par le mainteneur                           │
└─────────────────────────────────────────────────────────────────┘
```

---

#### Workflow 2 : Corriger un bug (en développement)

Même workflow que pour les features, mais avec le préfixe `fix/`

```bash
git checkout dev
git pull origin dev
git checkout -b fix/fix-inventory-persistence

# Corriger le bug
pnpm lint:fix && pnpm format

git add .
git commit -m "fix(inventory): resolve localStorage sync issue"
git push origin fix/fix-inventory-persistence

# Créer PR ciblant dev
```

---

#### Workflow 3 : Mettre à jour la documentation

```bash
git checkout dev
git pull origin dev
git checkout -b docs/update-setup-guide

# Faire les modifications de documentation
# Pas de changements de code généralement

git add .
git commit -m "docs: clarify installation requirements in README"
git push origin docs/update-setup-guide

# Créer PR ciblant dev
```

**La documentation inclut :**

- Fichiers `.md` dans `docs/`
- README.md
- CONTRIBUTING.md
- Commentaires de code (JSDoc)
- Commentaires inline pour la logique complexe

---

#### Workflow 4 : Changements de style/formatage

```bash
git checkout dev
git pull origin dev
git checkout -b style/improve-code-formatting

# Exécuter les formatters automatiques
pnpm lint:fix
pnpm format

git add .
git commit -m "style: apply prettier to all CSS files"
git push origin style/improve-code-formatting

# Créer PR ciblant dev
```

**Quand utiliser :**

- Mises à jour de formatage Prettier
- Améliorations des règles ESLint
- Améliorations de cohérence du style de code

---

#### Workflow 5 : Refactorisation (sans changement de comportement)

```bash
git checkout dev
git pull origin dev
git checkout -b refactor/optimize-hubspot-loader

# Refactoriser le code
# IMPORTANT : Ne pas changer le comportement utilisateur
# Ajouter des tests supplémentaires si possible

pnpm lint:fix && pnpm format

git add .
git commit -m "refactor(hubspots): extract loading logic to separate module"
git push origin refactor/optimize-hubspot-loader

# Créer PR ciblant dev
```

**Règles de refactorisation :**

- Ne doit pas changer le comportement visible par l'utilisateur
- Doit améliorer la maintenabilité, performance ou lisibilité
- Peut nécessiter des tests supplémentaires pour vérifier l'absence de régressions

---

#### Workflow 6 : Maintenance/Chores

```bash
git checkout dev
git pull origin dev
git checkout -b chore/update-dependencies

# Tâches de maintenance :
# - Mettre à jour les dépendances pnpm
# - Mettre à jour les versions GitHub Actions
# - Améliorer le pipeline CI/CD
# - Ajouter/Modifier des fichiers de configuration

pnpm lint:fix && pnpm format

git add .
git commit -m "chore(deps): update pnpm lock file to v9.0"
git push origin chore/update-dependencies

# Créer PR ciblant dev
```

**Exemples de chores :**

- Mises à jour de dépendances
- Changements de configuration
- Améliorations des scripts de build
- Mises à jour des outils de développement

---

#### Workflow 7 : Hotfix (Bug critique en production)

Utilisé quand un bug critique est trouvé en production (branche `main`)

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. CRÉER BRANCHE HOTFIX DEPUIS MAIN                              │
├─────────────────────────────────────────────────────────────────┤
│ git checkout main                                                │
│ git pull origin main                                             │
│ git checkout -b hotfix/critical-security-fix                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. CORRIGER LE PROBLÈME                                          │
│ - Corriger le bug                                                │
│ - Incrémenter la version PATCH dans package.json                 │
│ - Mettre à jour CHANGELOG.md                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. COMMIT & PUSH                                                 │
├─────────────────────────────────────────────────────────────────┤
│ git add .                                                        │
│ git commit -m "fix: resolve critical authentication bypass"      │
│ git tag -a v1.2.1 -m "Hotfix v1.2.1"                            │
│ git push origin hotfix/critical-security-fix --tags              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. CRÉER PR                                                      │
│ # Créer PR : hotfix/xxx → main                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. MERGER & SYNCHRONISER DEV                                     │
│ Après merge de la PR dans main :                                 │
│ git checkout dev                                                 │
│ git merge main                                                   │
│ git push origin dev                                              │
└─────────────────────────────────────────────────────────────────┘
```

**Règles de hotfix :**

- Uniquement pour les bugs critiques affectant la production
- Changements minimaux possibles
- Incrémenter la version PATCH
- Créer le tag immédiatement
- Doit synchroniser avec dev après le merge

---

#### Workflow 8 : Créer une Release

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. PRÉPARER LA RELEASE                                           │
│ - S'assurer que toutes les fonctionnalités sont dans dev        │
│ - Faire tous les tests                                           │
│ - Décider du numéro de version (MAJOR.MINOR.PATCH)              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. CRÉER BRANCHE DE RELEASE                                      │
├─────────────────────────────────────────────────────────────────┤
│ git checkout dev                                                 │
│ git pull origin dev                                              │
│ git checkout -b release/1.2.0                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. PRÉPARATION RELEASE (sur la branche release)                  │
├─────────────────────────────────────────────────────────────────┤
│ - Corrections de bugs FINALES UNIQUEMENT                         │
│ - Exécuter pnpm lint:fix && pnpm format                          │
│ - Mettre à jour la version dans package.json                     │
│ - Mettre à jour CHANGELOG.md avec les notes de release           │
│ - Tester minutieusement                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. COMMIT DES CHANGEMENTS DE RELEASE                             │
├─────────────────────────────────────────────────────────────────┤
│ git add .                                                        │
│ git commit -m "release: prepare v1.2.0"                         │
│ git push origin release/1.2.0                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. CRÉER RELEASE PR                                              │
│ # Créer PR : release/1.2.0 → main                                │
│ # Inclure :                                                       │
│   - Résumé des changements de version                            │
│   - Entries du Changelog                                         │
│   - Notes de test                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. APRÈS LE MERGE DANS MAIN                                      │
├─────────────────────────────────────────────────────────────────┤
│ # Créer la release GitHub avec le tag                            │
│ # Sur GitHub : Releases → Draft new release                      │
│ # Tag: v1.2.0                                                    │
│ # Title: Release v1.2.0                                          │
│ # Description: Copier depuis CHANGELOG.md                        │
│                                                                 │
│ # Synchroniser dev avec main :                                   │
│ git checkout dev                                                 │
│ git merge main                                                   │
│ git push origin dev                                              │
└─────────────────────────────────────────────────────────────────┘
```

**Règles de la branche release :**

- ✅ Corrections de bugs
- ✅ Améliorations de formatage
- ✅ Mises à jour de documentation
- ✅ Mises à jour de version
- ❌ Nouvelles fonctionnalités
- ❌ Refactorisations
- ❌ Breaking changes

---

#### Guide de décision pour les versions

| Type de changement            | Incrément | Exemple     |
| ----------------------------- | --------- | ----------- |
| Nouvelle salle/puzzle         | MINOR     | 1.0 → 1.1   |
| Nouveau mécanisme de jeu      | MINOR     | 1.0 → 1.1   |
| Correction de bug             | PATCH     | 1.1 → 1.1.1 |
| Amélioration performance      | PATCH     | 1.1 → 1.1.1 |
| Amélioration visuelle/UI      | PATCH     | 1.1 → 1.1.1 |
| Breaking change (format save) | MAJOR     | 1.x → 2.0   |

---

#### Tableau de référence rapide

| Objectif         | Branche De | Nom de Branche  | Type Commit | Cible PR   |
| ---------------- | ---------- | --------------- | ----------- | ---------- |
| Ajouter feature  | dev        | `feat/xxx`      | `feat:`     | dev        |
| Fixer bug        | dev        | `fix/xxx`       | `fix:`      | dev        |
| Update docs      | dev        | `docs/xxx`      | `docs:`     | dev        |
| Formater code    | dev        | `style/xxx`     | `style:`    | dev        |
| Refactorer       | dev        | `refactor/xxx`  | `refactor:` | dev        |
| Maintenance      | dev        | `chore/xxx`     | `chore:`    | dev        |
| Hotfix release   | main       | `hotfix/xxx`    | `fix:`      | main → dev |
| Préparer release | dev        | `release/x.y.z` | `release:`  | main       |

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
