# Contributing to Escape Game

Thank you for your interest in contributing! This document outlines the guidelines for contributing to this project.

## How to Contribute

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/escape-game-web.git
cd escape-game-web
```

### 2. Set Up Development Environment

This project uses plain HTML, CSS, and JavaScript (ES modules). No build tools required.

```bash
# Open in your browser by serving the directory
# Using Python:
python -m http.server 8000

# Or using Node.js (if installed):
npx serve .
```

### 3. Create a Branch

```bash
# Create a new branch for your changes
git checkout -b feat/your-feature-name
```

### 4. Make Changes

#### Project Structure

```
escape-game-web/
├── assets/          # Images and game assets
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
│   ├── flags.js          # Flag system
│   ├── hubspots.js       # Hubspot handlers
│   ├── hubspotsData.js   # Hubspot data loading
│   ├── inventory.js      # Inventory system
│   ├── resizeHandler.js  # Responsive handling
│   ├── script.js         # Main entry point
│   └── stateMachine.js   # State machine
├── style.css        # Main styles
└── index.html       # Entry HTML file
```

#### Key Concepts

**Hubspots** are interactive elements defined in `data/hubspots.json`. Each hubspot has:
- `id`: Unique identifier
- `type`: One of: `modal`, `action`, `finish`, `link`, `secret`, `useItem`
- `x`, `y`: Position (0-100%)
- `visibleIn`: Array of states where the hubspot is visible
- `emoji`: Optional emoji to display on canvas

**Inventory** items can have:
- `id`, `name`, `description`: Basic properties
- `emoji`: Optional emoji icon
- `icon`: Optional image path
- `usable`: Boolean for item use
- `consumable`: Boolean for one-time use

**State Machine** transitions are defined in `data/gameConfig.json`.

### 5. Test Your Changes

1. Open `index.html` in your browser
2. Test the feature thoroughly
3. Check for console errors
4. Verify responsive behavior

### 6. Commit Your Changes

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Examples:
git commit -m "feat: add new hubspot type"
git commit -m "fix: resolve inventory persistence issue"
git commit -m "docs: update getting started guide"
git commit -m "style: improve finish screen appearance"
```

**Commit types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: CSS/styling changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### 7. Push and Create PR

```bash
git push origin feat/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Style Guidelines

### JavaScript

- Use ES6 modules (`import`/`export`)
- Use `const` by default, `let` when needed
- Use template literals for string concatenation
- Use arrow functions for callbacks
- Add JSDoc comments for functions

```javascript
/**
 * Adds an item to the inventory
 * @param {Object} item - Item to add
 * @returns {boolean} True if item was added
 */
export function addItem(item) {
    // ...
}
```

### CSS

- Use CSS custom properties for colors
- Keep styles modular
- Use `rem` for sizing
- Mobile-first approach

### JSON

- Use consistent indentation (2 spaces)
- Add comments where helpful (JSON allows this in some parsers)
- Validate JSON syntax

## Testing Checklist

Before submitting a PR, verify:

- [ ] No console errors
- [ ] Works on different screen sizes
- [ ] Inventory persists correctly
- [ ] State transitions work as expected
- [ ] Hubspot visibility conditions work
- [ ] Documentation is updated if needed

## Reporting Issues

When reporting issues, include:

1. **Browser and version** (e.g., Chrome 120)
2. **Operating system** (e.g., macOS 14)
3. **Steps to reproduce**
4. **Expected behavior**
5. **Actual behavior**
6. **Screenshots** if applicable

## Questions?

Feel free to open an issue for discussion or ask questions.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
