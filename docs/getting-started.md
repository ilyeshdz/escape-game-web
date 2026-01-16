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
│   ├── gameConfig.json    # State machine and scene configuration
│   ├── scenes.json        # Scene definitions (multi-room games)
│   └── hubspots.json      # Interactive elements
├── docs/            # Documentation
│   ├── getting-started.md
│   ├── hubspots.md
│   ├── inventory.md
│   ├── flags.md
│   ├── statemachine.md
│   └── scenes.md         # Multi-room game documentation
├── scripts/         # JavaScript modules
│   ├── canvasScene.js    # Canvas rendering and scene loading
│   ├── flags.js          # Flags system
│   ├── hubspots.js       # Hubspot handlers
│   ├── hubspotsData.js   # Hubspot loading
│   ├── inventory.js      # Inventory system
│   ├── resizeHandler.js  # Responsive handling
│   ├── script.js         # Main entry point
│   └── stateMachine.js   # State and scene management
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
- [Scenes](./scenes.md) - Creating multi-room escape games
- [Hubspots](./hubspots.md) - Creating interactive elements
- [Inventory](./inventory.md) - Managing collectible items
- [Flags](./flags.md) - Using variables to control hubspot visibility

### Single-Room Games

For single-room games, customize the background image and hubspots:

```json
// data/gameConfig.json
{
    "initialState": "room1",
    "transitions": {
        "room1": {
            "openSafe": "safeOpen"
        },
        "safeOpen": {},
        "finished": {}
    }
}
```

### Multi-Room Games

For multi-room games, configure scenes and transitions:

```json
// data/scenes.json
{
    "scenes": [
        {
            "id": "foyer",
            "backgroundImage": "assets/foyer.png",
            "default": true
        },
        {
            "id": "library",
            "backgroundImage": "assets/library.png"
        }
    ]
}
```

```json
// data/gameConfig.json
{
    "initialState": "room1",
    "initialScene": "foyer",
    "sceneTransitions": {
        "foyer": {
            "toLibrary": "library"
        },
        "library": {
            "toFoyer": "foyer"
        }
    },
    "transitions": {
        "room1": {},
        "finished": {}
    }
}
```

See the [Scenes documentation](./scenes.md) for complete multi-room game setup.

### Changing the Background Image

To change the background image for a single room, replace `assets/scene1.png` with your own image.

For multi-room games, configure different background images per scene in `data/scenes.json`:

```json
{
    "scenes": [
        {
            "id": "foyer",
            "backgroundImage": "assets/foyer.png"
        },
        {
            "id": "library",
            "backgroundImage": "assets/library.png"
        }
    ]
}
```

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

For scene transition hubspots:

```json
{
    "id": "toLibrary",
    "type": "scene",
    "visibleInScenes": ["foyer"],
    "targetScene": "library",
    "emoji": "📚",
    "x": 30,
    "y": 50
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
2. Learn about [Scenes](./scenes.md) to create multi-room escape games
3. Explore [Hubspots](./hubspots.md) to create interactive elements
4. Understand the [Inventory](./inventory.md) system for item management
5. Use [Flags](./flags.md) to track player progress
6. Customize the game by editing the JSON files in `data/`
