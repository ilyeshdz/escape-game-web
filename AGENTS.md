# AGENTS.md - Guidelines for AI Coding Agents

This document provides guidelines for AI agents operating on this codebase.

---

## 1. Build, Lint, and Test Commands

```bash
# Development
pnpm dev              # Start dev server at http://localhost:3000

# Linting
pnpm lint             # Run ESLint on all files
pnpm lint:fix         # Auto-fix ESLint issues

# Formatting
pnpm format           # Format all files with Prettier
pnpm format:check     # Check formatting without modifying

# Changelog
pnpm changelog        # Generate initial CHANGELOG.md
pnpm changelog:update # Update CHANGELOG from commits

# Release
pnpm release          # Trigger semantic-release (runs on main branch merge)
```

**Pre-commit hooks:** Husky runs `lint-staged` automatically before commits, executing `eslint --fix` and `prettier --write` on staged JS files.

---

## 2. Code Style Guidelines

### 2.1 General Rules

| Rule                    | Enforcement                  |
| ----------------------- | ---------------------------- |
| ES Modules              | Required (`import`/`export`) |
| `const` by default      | Error                        |
| No `var`                | Error                        |
| Strict equality (`===`) | Error                        |
| No `console.log`        | Error                        |
| No unused variables     | Error                        |

### 2.2 Formatting (Prettier)

```json
{
    "semi": true,
    "tabWidth": 4,
    "printWidth": 100,
    "singleQuote": true,
    "trailingComma": "none",
    "endOfLine": "lf"
}
```

### 2.3 Naming Conventions

| Type              | Convention           | Example            |
| ----------------- | -------------------- | ------------------ |
| Variables         | camelCase            | `inventorySize`    |
| Constants         | SCREAMING_SNAKE_CASE | `STORAGE_KEY`      |
| Functions         | camelCase            | `initInventory()`  |
| Classes           | PascalCase           | `StateMachine`     |
| Files             | kebab-case           | `state-machine.js` |
| Private internals | Prefix with `_`      | `_internalCache`   |

### 2.4 Imports

```javascript
// Correct
import { initInventory, getInventory } from './inventory.js';

// Group by type: absolute → relative
import { StateMachine } from './core/StateMachine.js';
import { loadHubspotsData } from './hubspotsData.js';

// Avoid side-effect imports
import './utils.js'; // ❌ Not allowed
```

### 2.5 JSDoc Requirements

All exported functions and public methods must have JSDoc:

```javascript
/**
 * Initializes the inventory system
 * @returns {Promise<void>}
 */
export async function initInventory() {}

/**
 * Gets the current state from the state machine
 * @returns {string} Current state name
 */
export function getState() {}
```

### 2.6 Error Handling

```javascript
// Correct: Use try/catch with proper error messages
try {
    const data = await fetchData();
} catch (error) {
    throw new Error(`Failed to load data: ${error.message}`);
}

// Incorrect: Empty catch blocks
try {
    something();
} catch {
    // Empty - not allowed
}

// Incorrect: Console logging errors
try {
    something();
} catch (error) {
    console.error(error); // Not allowed - use throw
}
```

### 2.7 Control Flow

```javascript
// Use early returns (no-else-return)
if (!isValid) {
    return null;
}
// ... rest of logic

// No empty blocks
if (condition) {
    doSomething();
} else {
    doOtherThing();
}
```

---

## 3. Commit Message Format

**Required format:** `<type>(<scope>): <subject>`

**Types:** `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`, `release`

**Examples:**

```
feat(inventory): add item drag and drop
fix(hubspots): resolve visibility condition
docs(readme): update installation instructions
chore: update dependencies
```

---

## 4. Branch Strategy

| Branch      | Purpose                 |
| ----------- | ----------------------- |
| `main`      | Production-ready code   |
| `dev`       | Development integration |
| `feat/*`    | New features            |
| `fix/*`     | Bug fixes               |
| `release/*` | Release preparation     |

**All changes must be based on `dev` branch.**

---

## 5. Important Notes

- This is a **vanilla JavaScript project** (no Node.js runtime dependencies)
- All JS runs in browser via ES modules
- JSON files in `data/` are game configuration (not database)
- The project uses Semantic Release for automated versioning
- CHANGELOG.md is auto-generated - do not edit manually
- All linting/formatting is enforced via Husky pre-commit hooks

---

## 6. Adding New Features

When adding new features:

1. Create feature branch from `dev`
2. Update `data/*.json` for configuration changes
3. Add new JS modules in `scripts/` following existing patterns
4. Update `docs/` with any new concepts
5. Run `pnpm lint:fix && pnpm format` before committing
6. Create PR targeting `dev` branch
