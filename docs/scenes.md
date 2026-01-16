# Scenes

Scenes allow you to create multi-room escape games where players can navigate between different areas. Each scene can have its own background image, hubspots, and transitions to other scenes.

## Overview

The multi-scene system provides:

- Multiple named scenes/rooms in `data/scenes.json`
- Scene-to-scene transitions via hubspots
- Persistent state across scenes (inventory, flags, player progress)
- Background images per scene
- Scene-specific visibility rules for hubspots

## Configuration Files

### scenes.json

Define your scenes in `data/scenes.json`:

```json
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
        },
        {
            "id": "garden",
            "backgroundImage": "assets/garden.png"
        }
    ]
}
```

### gameConfig.json

Configure scene transitions in `data/gameConfig.json`:

```json
{
    "initialState": "room1",
    "initialScene": "foyer",
    "sceneTransitions": {
        "foyer": {
            "toLibrary": "library",
            "toGarden": "garden"
        },
        "library": {
            "toFoyer": "foyer"
        },
        "garden": {
            "toFoyer": "foyer"
        }
    },
    "transitions": {
        "room1": {
            "openSafe": "safeOpen"
        },
        "safeOpen": {},
        "finished": {}
    }
}
```

## Scene Properties

| Property          | Type    | Required | Description                         |
| ----------------- | ------- | -------- | ----------------------------------- |
| `id`              | string  | Yes      | Unique scene identifier             |
| `backgroundImage` | string  | Yes      | Path to the scene background image  |
| `default`         | boolean | No       | If true, this is the starting scene |

## Scene Transition Properties

| Property           | Type   | Required | Description                                |
| ------------------ | ------ | -------- | ------------------------------------------ |
| `initialScene`     | string | Yes      | The scene where the game starts            |
| `sceneTransitions` | object | Yes      | Defines allowed scene-to-scene transitions |

### sceneTransitions Structure

- Each key is a **source scene** ID (e.g., `"foyer"`)
- Each value is an object where:
    - Key is an **action** name (e.g., `"toLibrary"`)
    - Value is the **destination scene** ID (e.g., `"library"`)

## Hubspot Scene Transitions

Use the `scene` hubspot type to create scene transitions:

```json
{
    "id": "doorToLibrary",
    "type": "scene",
    "visibleInScenes": ["foyer"],
    "visibleIn": ["room1", "safeOpen"],
    "targetScene": "library",
    "emoji": "🚪",
    "tooltip": "Aller à la bibliothèque",
    "x": 30,
    "y": 50
}
```

### Scene Hubspot Properties

| Property              | Type   | Required | Description                                 |
| --------------------- | ------ | -------- | ------------------------------------------- |
| `type`                | string | Yes      | Must be `"scene"`                           |
| `targetScene`         | string | Yes      | The scene ID to transition to               |
| `visibleInScenes`     | array  | No       | Array of scene IDs where hubspot is visible |
| `visibleIn`           | array  | No       | Array of states where hubspot is visible    |
| `notificationMessage` | string | No       | Message to display after transition         |
| `blockedMessage`      | string | No       | Message if transition is not allowed        |

## Scene-Specific Hubspots

You can restrict hubspots to specific scenes using `visibleInScenes`:

```json
{
    "id": "libraryBook",
    "type": "modal",
    "visibleInScenes": ["library"],
    "visibleIn": ["room1", "safeOpen"],
    "emoji": "📖",
    "tooltip": "Livre ancien",
    "modalText": "Vous trouvez un livre ancien...",
    "x": 50,
    "y": 50
}
```

## How It Works

1. Game starts in the `initialScene` defined in `gameConfig.json`
2. Hubspots with matching `visibleInScenes` are displayed
3. When a scene hubspot is clicked:
    - The system checks if transition is allowed via `sceneTransitions`
    - If allowed, current scene changes to `targetScene`
    - New scene background loads
    - Hubspots are re-evaluated for the new scene
4. Player state (inventory, flags) persists across scenes

## Example: Multi-Room Mansion

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
        },
        {
            "id": "kitchen",
            "backgroundImage": "assets/kitchen.png"
        },
        {
            "id": "garden",
            "backgroundImage": "assets/garden.png"
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
            "toLibrary": "library",
            "toKitchen": "kitchen",
            "toGarden": "garden"
        },
        "library": {
            "toFoyer": "foyer"
        },
        "kitchen": {
            "toFoyer": "foyer"
        },
        "garden": {
            "toFoyer": "foyer",
            "toAttic": "attic"
        },
        "attic": {
            "toGarden": "garden"
        }
    },
    "transitions": {
        "room1": {},
        "safeOpen": {},
        "finished": {}
    }
}
```

```json
// data/hubspots.json
[
    {
        "id": "toLibrary",
        "type": "scene",
        "visibleInScenes": ["foyer"],
        "visibleIn": ["room1"],
        "targetScene": "library",
        "emoji": "📚",
        "tooltip": "Aller à la bibliothèque",
        "x": 20,
        "y": 30
    },
    {
        "id": "toKitchen",
        "type": "scene",
        "visibleInScenes": ["foyer"],
        "visibleIn": ["room1"],
        "targetScene": "kitchen",
        "emoji": "🍳",
        "tooltip": "Aller à la cuisine",
        "x": 50,
        "y": 30
    },
    {
        "id": "toGarden",
        "type": "scene",
        "visibleInScenes": ["foyer"],
        "visibleIn": ["room1"],
        "targetScene": "garden",
        "emoji": "🌳",
        "tooltip": "Aller au jardin",
        "x": 80,
        "y": 30
    },
    {
        "id": "toFoyerFromLibrary",
        "type": "scene",
        "visibleInScenes": ["library"],
        "visibleIn": ["room1"],
        "targetScene": "foyer",
        "emoji": "🚪",
        "tooltip": "Retour au hall d'entrée",
        "x": 10,
        "y": 50
    },
    {
        "id": "rareBook",
        "type": "modal",
        "visibleInScenes": ["library"],
        "visibleIn": ["room1"],
        "emoji": "📖",
        "tooltip": "Livre rare",
        "modalText": "Vous trouvez un livre rare avec des indices!",
        "x": 50,
        "y": 50
    }
]
```

## Backward Compatibility

For single-room games, the multi-scene system is optional. If no scenes are configured, the engine falls back to a single default scene:

```json
// Automatic fallback when no scenes defined
{
    "scenes": {
        "room1": { "id": "room1", "backgroundImage": "assets/scene1.png" }
    },
    "currentScene": "room1"
}
```

Hubspots without `visibleInScenes` work as before, visible in all scenes.

## Best Practices

1. **Plan your room layout**: Sketch how rooms connect before implementing
2. **Use descriptive scene IDs**: `library`, `kitchen`, `attic` are better than `room1`, `room2`, `room3`
3. **Define clear transitions**: Only allow logical room-to-room navigation
4. **Test scene transitions**: Verify all transitions work correctly
5. **Consider state persistence**: Inventory and flags persist across scenes

## Debugging Tips

1. Open browser developer tools (F12)
2. Check the console for scene transition errors
3. Verify `targetScene` IDs match scene IDs in `scenes.json`
4. Ensure transitions are defined in `sceneTransitions`
5. Check that hubspots have both `visibleIn` and `visibleInScenes` for multi-scene games
