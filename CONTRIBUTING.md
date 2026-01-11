# Contributing to the Escape Game Project

Thank you for your interest in contributing! This document outlines the guidelines for contributing to this project.

## Table of Contents

- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Code Quality Tools](#code-quality-tools)
- [Development Workflow](#development-workflow)
- [Release Workflow](#release-workflow)
- [Code Conventions](#code-conventions)
- [Testing Your Changes](#testing-your-changes)
- [Submitting Changes](#submitmitting-changes)

## How to Contribute

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/escape-game-web.git
cd escape-game-web
```

### 2. Set Up Development Environment

This project uses HTML, CSS, and vanilla JavaScript (ES modules) with pnpm for development dependencies.

```bash
# Install pnpm if needed
npm install -g pnpm

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The development server will start at `http://localhost:3000`. Open this URL in your browser to test the game.

### 3. Create a Branch

```bash
# Ensure you're on the dev branch
git checkout dev

# Pull the latest changes
git pull origin dev

# Create a new branch for your changes from dev
git checkout -b feat/your-feature-name
```

> **Important:** All changes must be based on the `dev` branch, never from `main`.

### 4. Make Changes

#### Project Structure

```
escape-game-web/
├── assets/          # Game images and resources
├── data/            # JSON configuration files
│   ├── gameConfig.json    # State machine configuration
│   └── hubspots.json      # Interactive elements
├── docs/            # Documentation
│   ├── getting-started.md
│   ├── hubspots.md
│   ├── inventory.md
│   ├── flags.md
│   └── statemachine.md
├── scripts/         # JavaScript modules
│   ├── canvasScene.js    # Canvas rendering
│   ├── flags.js          # Flags system
│   ├── hubspots.js       # Hubspot handlers
│   ├── hubspotsData.js   # Hubspot loading
│   ├── inventory.js      # Inventory system
│   ├── resizeHandler.js  # Responsive handling
│   ├── script.js         # Main entry point
│   └── stateMachine.js   # State machine
├── style.css        # Main styles
├── index.html       # Entry HTML file
├── package.json     # pnpm configuration and scripts
├── eslint.config.js # ESLint configuration
├── .prettierrc      # Prettier configuration
└── .husky/          # Git hooks (Husky)
```

### Code Quality Tools

This project uses tools to maintain code quality:

- **ESLint**: Detects errors and enforces best practices
- **Prettier**: Automatically formats code
- **Husky**: Git hooks to verify code before each commit
- **lint-staged**: Only checks modified files

#### Available Commands

```bash
# Check code with ESLint
pnpm lint

# Automatically fix ESLint errors
pnpm lint:fix

# Format code with Prettier
pnpm format

# Check formatting without modifying
pnpm format:check
```

#### Development Workflow

1. Create a branch for your changes
2. Work on your code
3. Before committing, run `pnpm lint:fix && pnpm format`
4. Commit your changes (Husky will automatically verify the code)

#### Key Concepts

**Hubspots** are interactive elements defined in `data/hubspots.json`. Each hubspot has:

- `id`: Unique identifier
- `type`: One of: `modal`, `action`, `finish`, `link`, `secret`, `useItem`
- `x`, `y`: Position (0-100%)
- `visibleIn`: Array of states where the hubspot is visible
- `emoji`: Optional emoji to display on the canvas

**Inventory** items can have:

- `id`, `name`, `description`: Basic properties
- `emoji`: Optional icon (emoji)
- `icon`: Optional path to an image
- `usable`: Boolean for item usage
- `consumable`: Boolean for single-use items

**State machine** transitions are defined in `data/gameConfig.json`.

### Release Workflow

This project uses a structured workflow with dedicated branches for each type of contribution.

#### Contribution Types Overview

| Type                | Prefix          | Source Branch | Target Branch   |
| ------------------- | --------------- | ------------- | --------------- |
| New Feature         | `feat/`         | `dev`         | `dev`           |
| Bug Fix             | `fix/`          | `dev`         | `dev`           |
| Documentation       | `docs/`         | `dev`         | `dev`           |
| Style/Formatting    | `style/`        | `dev`         | `dev`           |
| Refactoring         | `refactor/`     | `dev`         | `dev`           |
| Maintenance         | `chore/`        | `dev`         | `dev`           |
| Hotfix (production) | `hotfix/`       | `main`        | `main` -> `dev` |
| Release Preparation | `release/x.y.z` | `dev`         | `main`          |

---

#### Version Naming Convention (Semantic Versioning)

Format is `MAJOR.MINOR.PATCH` (e.g., `1.2.0`)

| Component       | Meaning                          | When to Increment                                           |
| --------------- | -------------------------------- | ----------------------------------------------------------- |
| **MAJOR** (`x`) | Breaking changes, major refactor | New episode, structural change affecting save compatibility |
| **MINOR** (`y`) | New backward-compatible features | New room, new puzzle, new hubspot type                      |
| **PATCH** (`z`) | Bug fixes and improvements       | Bug fixes, perf improvements, CSS adjustments               |

**Examples:**

- `1.0.0` -> Initial version
- `1.1.0` -> Added new puzzle room
- `1.1.1` -> Fixed inventory persistence bug
- `2.0.0` -> New episode with interface overhaul

---

#### Workflow 1: Add a New Feature

```
+-----------------------------------------------------------+
| 1. SYNCHRONIZE                                            |
+-----------------------------------------------------------+
| git checkout dev                                          |
| git pull origin dev                                       |
+-----------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------+
| 2. CREATE FEATURE BRANCH                                  |
+-----------------------------------------------------------+
| git checkout -b feat/your-feature-name                    |
+-----------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------+
| 3. DEVELOP                                                |
| - Implement the feature                                   |
| - Add/Modify tests if applicable                          |
| - Update documentation if necessary                       |
+-----------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------+
| 4. QUALITY CHECK                                          |
+-----------------------------------------------------------+
| pnpm lint:fix                                             |
| pnpm format                                               |
| # Test in the browser                                     |
+-----------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------+
| 5. COMMIT                                                 |
+-----------------------------------------------------------+
| git add .                                                 |
| git commit -m "feat(inventory): add item combination system"|
+-----------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------+
| 6. PUSH & CREATE PR                                       |
+-----------------------------------------------------------+
| git push origin feat/your-feature-name                    |
| # Create PR on GitHub targeting "dev"                     |
+-----------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------+
| 7. REVIEW & MERGE                                         |
| - Maintainers review the PR                               |
| - Fix feedback if necessary                               |
| - PR merged into dev by maintainer                        |
+-----------------------------------------------------------+
```

---

#### Workflow 2: Fix a Bug (in Development)

Same workflow as features, but with `fix/` prefix.

```bash
git checkout dev
git pull origin dev
git checkout -b fix/fix-inventory-persistence

# Fix the bug
pnpm lint:fix && pnpm format

git add .
git commit -m "fix(inventory): resolve localStorage sync issue"
git push origin fix/fix-inventory-persistence

# Create PR targeting dev
```

---

#### Workflow 3: Update Documentation

```bash
git checkout dev
git pull origin dev
git checkout -b docs/update-setup-guide

# Make documentation changes
# Usually no code changes

git add .
git commit -m "docs: clarify installation requirements in README"
git push origin docs/update-setup-guide

# Create PR targeting dev
```

**Documentation includes:**

- `.md` files in `docs/`
- README.md
- CONTRIBUTING.md
- Code comments (JSDoc)
- Inline comments for complex logic

---

#### Workflow 4: Style/Formatting Changes

```bash
git checkout dev
git pull origin dev
git checkout -b style/improve-code-formatting

# Run automatic formatters
pnpm lint:fix
pnpm format

git add .
git commit -m "style: apply prettier to all CSS files"
git push origin style/improve-code-formatting

# Create PR targeting dev
```

**When to use:**

- Prettier formatting updates
- ESLint rule improvements
- Code style consistency improvements

---

#### Workflow 5: Refactoring (No Behavior Change)

```bash
git checkout dev
git pull origin dev
git checkout -b refactor/optimize-hubspot-loader

# Refactor the code
# IMPORTANT: Don't change user behavior
# Add additional tests if possible

pnpm lint:fix && pnpm format

git add .
git commit -m "refactor(hubspots): extract loading logic to separate module"
git push origin refactor/optimize-hubspot-loader

# Create PR targeting dev
```

**Refactoring Rules:**

- Must not change user-visible behavior
- Must improve maintainability, performance, or readability
- May require additional tests to verify no regressions

---

#### Workflow 6: Maintenance/Chores

```bash
git checkout dev
git pull origin dev
git checkout -b chore/update-dependencies

# Maintenance tasks:
# - Update pnpm dependencies
# - Update GitHub Actions versions
# - Improve CI/CD pipeline
# - Add/Modify configuration files

pnpm lint:fix && pnpm format

git add .
git commit -m "chore(deps): update pnpm lock file to v9.0"
git push origin chore/update-dependencies

# Create PR targeting dev
```

**Chore Examples:**

- Dependency updates
- Configuration changes
- Build script improvements
- Development tool updates

---

#### Workflow 7: Hotfix (Critical Bug in Production)

Used when a critical bug is found in production (branch `main`)

```
+-----------------------------------------------------------+
| 1. CREATE HOTFIX BRANCH FROM MAIN                         |
+-----------------------------------------------------------+
| git checkout main                                         |
| git pull origin main                                      |
| git checkout -b hotfix/critical-security-fix              |
+-----------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------+
| 2. FIX THE ISSUE                                          |
| - Fix the bug                                             |
| - Increment PATCH version in package.json                 |
| - Update CHANGELOG.md                                     |
+-----------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------+
| 3. COMMIT & PUSH                                          |
+-----------------------------------------------------------+
| git add .                                                 |
| git commit -m "fix: resolve critical authentication bypass"|
| git tag -a v1.2.1 -m "Hotfix v1.2.1"                     |
| git push origin hotfix/critical-security-fix --tags       |
+-----------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------+
| 4. CREATE PR                                              |
| # Create PR: hotfix/xxx -> main                           |
+-----------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------+
| 5. MERGE & SYNC DEV                                       |
| After PR merge into main:                                 |
| git checkout dev                                          |
| git merge main                                            |
| git push origin dev                                       |
+-----------------------------------------------------------+
```

**Hotfix Rules:**

- Only for critical bugs affecting production
- Minimal possible changes
- Increment PATCH version
- Create tag immediately
- Must sync with dev after merge

---

#### Workflow 8: Create a Release (Semantic Release)

This project uses **Semantic Release** to automate releases.

```
+-----------------------------------------------------------+
| 1. MERGE INTO MAIN                                        |
+-----------------------------------------------------------+
| - All features are in dev                                 |
| - The release/x.y.z PR is merged into main               |
| - The Release workflow triggers automatically             |
+-----------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------+
| 2. SEMANTIC RELEASE ANALYZES COMMITS                     |
+-----------------------------------------------------------+
| - Analyzes commit messages                                |
| - Determines version type (MAJOR.MINOR.PATCH)             |
| - Generates CHANGELOG automatically                       |
| - Updates package.json and CHANGELOG.md                   |
| - Creates GitHub release with assets                      |
+-----------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------+
| 3. SYNC DEV                                               |
+-----------------------------------------------------------+
| git checkout dev                                          |
| git merge main                                            |
| git push origin dev                                       |
+-----------------------------------------------------------+
```

**Semantic Release Benefits:**

- Automatic version based on commits
- CHANGELOG generated automatically
- No manual version handling
- Tags created automatically

**Commit Types and Version Impact:**

| Commit Type | Increment | Example      |
| ----------- | --------- | ------------ |
| `feat`      | MINOR     | 1.0 -> 1.1   |
| `fix`       | PATCH     | 1.1 -> 1.1.1 |
| `feat!:`    | MAJOR     | 1.x -> 2.0   |
| `break!:`   | MAJOR     | 1.x -> 2.0   |

**Release Branch Rules:**

- Bug fixes
- Formatting improvements
- Documentation updates
- New features (announcing a MINOR)
- Breaking changes (unless preparing MAJOR)

---

#### Version Decision Guide

Semantic Release automatically determines the version by analyzing your commits.

| Change Type                   | Commit Type     | Increment |
| ----------------------------- | --------------- | --------- |
| New room/puzzle               | `feat`          | MINOR     |
| New game mechanism            | `feat`          | MINOR     |
| Bug fix                       | `fix`           | PATCH     |
| Performance improvement       | `fix` or `perf` | PATCH     |
| Visual/UI improvement         | `style`         | PATCH     |
| Breaking change (save format) | `feat!`         | MAJOR     |

---

#### Quick Reference Table

| Goal            | From Branch | Branch Name     | Commit Type | PR Target   |
| --------------- | ----------- | --------------- | ----------- | ----------- |
| Add feature     | dev         | `feat/xxx`      | `feat:`     | dev         |
| Fix bug         | dev         | `fix/xxx`       | `fix:`      | dev         |
| Update docs     | dev         | `docs/xxx`      | `docs:`     | dev         |
| Format code     | dev         | `style/xxx`     | `style:`    | dev         |
| Refactor        | dev         | `refactor/xxx`  | `refactor:` | dev         |
| Maintenance     | dev         | `chore/xxx`     | `chore:`    | dev         |
| Hotfix release  | main        | `hotfix/xxx`    | `fix:`      | main -> dev |
| Prepare release | dev         | `release/x.y.z` | `feat:`     | main        |

### Testing Your Changes

1. Start the development server: `pnpm dev`
2. Open `http://localhost:3000` in your browser
3. Test the feature thoroughly
4. Check for errors in the console
5. Verify responsive behavior

### Validate Your Changes

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Examples:
git commit -m "feat: add new hubspot type"
git commit -m "fix: resolve inventory persistence issue"
git commit -m "docs: update getting started guide"
git commit -m "style: improve end screen appearance"
```

**Commit Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: CSS/styling changes
- `refactor`: Code refactoring
- `test`: Test additions
- `chore`: Maintenance tasks

### Push and Create a PR

```bash
git push origin feat/your-feature-name
```

Then create a Pull Request on GitHub targeting the **dev** branch.

## Code Conventions

### JavaScript

- Use ES6 modules (`import`/`export`)
- Use `const` by default, `let` when needed
- Use template literals for concatenation
- Use arrow functions for callbacks
- Add JSDoc comments for functions

```javascript
/**
 * Adds an item to the inventory
 * @param {Object} item - The item to add
 * @returns {boolean} True if the item was added
 */
export function addItem(item) {
    // ...
}
```

### CSS

- Use CSS custom properties for colors
- Keep styles modular
- Use `rem` for sizes
- Mobile-first approach

### JSON

- Use consistent indentation (2 spaces)
- Validate JSON syntax

### Commit Message Validation

This project uses **commitlint** to automatically validate commit messages according to the [Conventional Commits](https://conventionalcommits.org/) standard.

If your commit message is invalid, the commit will be rejected. Here's the expected format:

```
<type>(<scope>): <description>
```

**Available Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting (CSS, JS without logic changes)
- `refactor` - Code restructuring
- `test` - Test addition or modification
- `chore` - Maintenance tasks (dependencies, tools, etc.)

**Examples:**

```
feat(inventory): add item usage system
fix(hubspots): resolve visibility condition issue
docs(readme): update installation instructions
style(css): improve modal animation
```

The scope (`<scope>`) is optional and corresponds to the module involved (`inventory`, `hubspots`, `canvas`, etc.).

### CHANGELOG Generation

The CHANGELOG is **automatically generated** by Semantic Release during each release.

You only need to generate it manually for consultation:

```bash
pnpm changelog
```

To view changes without writing to the file:

```bash
pnpm changelog --dry-run
```

**Note:** Never manually modify the CHANGELOG. Semantic Release updates it automatically during releases.

## Testing Checklist

Before submitting a PR, check:

- [ ] No errors in the console
- [ ] Works on different screen sizes
- [ ] Inventory persists correctly
- [ ] State transitions work as expected
- [ ] Hubspot visibility conditions work
- [ ] Documentation updated if necessary
- [ ] PR targets `dev` branch (except for releases)

## Reporting Issues

When reporting issues, include:

1. **Browser and version** (e.g., Chrome 120)
2. **Operating system** (e.g., macOS 14)
3. **Steps to reproduce**
4. **Expected behavior**
5. **Current behavior**
6. **Screenshots** if applicable

## Questions?

Feel free to open an issue to discuss or ask questions.

## License

By contributing, you agree that your contributions will be under the MIT License.
