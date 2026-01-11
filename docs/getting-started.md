# Getting Started

This guide explains how to set up and customize the escape game engine.

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- A text editor (VS Code, Sublime Text, etc.)
- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (recommended) or npm

## Installation

```bash
# Install pnpm if needed
npm install -g pnpm

# Install development dependencies
pnpm install

# Start the development server
pnpm dev
```

The development server will start at `http://localhost:3000`. Open this URL in your browser to test the game.

## Project Structure

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

## Customization

Game customization is primarily done by modifying JSON files in the `data/` folder.

For detailed documentation on each part of the game engine, see:

- [State Machine](./statemachine.md) - Understanding states and transitions
- [Hubspots](./hubspots.md) - Creating interactive elements
- [Inventory](./inventory.md) - Managing collectible items
- [Flags](./flags.md) - Using variables to control hubspot visibility

### Changing the Background Image

To change the background image, replace `assets/scene1.png` with your own image. You can also modify the filename in `index.html`.

### Customizing Hubspot Appearance

Hubspots can display emojis instead of white circles. Simply add the `emoji` property to a hubspot:

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

## Running the Game

Start the development server:

```bash
pnpm dev
```

Then open `http://localhost:3000` in your browser.

## Development Tools

This project uses tools to maintain code quality:

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

## Next Steps

1. Read the [State Machine](./statemachine.md) documentation to understand game progression
2. Learn about [Hubspots](./hubspots.md) to create interactive elements
3. Explore the [Inventory](./inventory.md) system for item management
4. Use [Flags](./flags.md) to track player progress
5. Customize the game by editing the JSON files in `data/`
