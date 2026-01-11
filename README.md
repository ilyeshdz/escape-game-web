# Escape Game Engine

A configurable escape game engine built with vanilla HTML, CSS, and JavaScript. Create immersive escape room experiences without writing code - just configure JSON files!

## Features

- **Zero-code customization**: Configure entire games using JSON files
- **State machine architecture**: Robust game progression system
- **Interactive hubspots**: Multiple interaction types (modals, actions, items, secrets)
- **Inventory system**: Collect and use items throughout the game
- **Flag system**: Track player progress and unlock content dynamically
- **Responsive design**: Works on desktop and mobile devices
- **Persistence**: Game state automatically saves to localStorage

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/ilyeshdz/escape-game-web.git
cd escape-game-web

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open `http://localhost:3000` in your browser to play.

## Project Philosophy

Instead of creating a single escape game, this project is designed as an **escape game engine**. The goal is to provide a tool that allows creating escape games in a **highly configurable**, fast way without modifying source code.

This approach offers several advantages:

- **Maintainability**: Easier to fix bugs and add features to the game engine
- **Readability**: Game logic is entirely defined in JSON configuration files
- **Speed**: Once the engine is set up, creating new scenarios is quick and easy

## Documentation

For detailed guides on customizing the game, check out:

- [Getting Started](./docs/getting-started.md) - Overview and initial setup
- [State Machine](./docs/statemachine.md) - Understanding game states and transitions
- [Hubspots](./docs/hubspots.md) - Creating interactive elements
- [Inventory](./docs/inventory.md) - Managing collectible items
- [Flags](./docs/flags.md) - Tracking player progress

## Customization Guide

### Changing the Background

Replace `assets/scene1.png` with your own image. You can also modify the filename in `index.html`.

### Adding Interactive Elements

Hubspots are defined in `data/hubspots.json`. Here's a simple example:

```json
{
    "id": "chest",
    "type": "modal",
    "visibleIn": ["room1"],
    "emoji": "📦",
    "x": 50,
    "y": 50,
    "modalText": "A treasure chest!"
}
```

### Game Progression

Define states and transitions in `data/gameConfig.json`:

```json
{
    "initialState": "room1",
    "transitions": {
        "room1": {
            "openSafe": "safeOpen"
        },
        "safeOpen": {
            "unlockDoor": "finished"
        },
        "finished": {}
    }
}
```

## Available Scripts

| Command             | Description               |
| ------------------- | ------------------------- |
| `pnpm dev`          | Start development server  |
| `pnpm lint`         | Check code with ESLint    |
| `pnpm lint:fix`     | Auto-fix ESLint errors    |
| `pnpm format`       | Format code with Prettier |
| `pnpm format:check` | Check formatting          |
| `pnpm changelog`    | Generate changelog        |

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **JavaScript ES6+** - Vanilla JS with ES modules
- **pnpm** - Package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks

## Contributing

Interested in contributing? See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT License. See [LICENSE](./LICENSE) for details.
