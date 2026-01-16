# State Machine

The state machine manages game progression. It is defined in the `data/gameConfig.json` file.

## Overview

The state machine controls:

- Current game location/room
- Available actions
- Visible hubspots
- Game flow and progression
- Scene management (for multi-room games)

The game is always in exactly one state at a time. Actions (typically triggered by hubspots) cause transitions from one state to another.

Additionally, for multi-room games, the state machine also manages scenes, allowing players to navigate between different areas while preserving their progress (inventory, flags).

## Single-Room vs Multi-Room Games

### Single-Room Games

In single-room games, the state machine only manages game states:

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

### Multi-Room Games

In multi-room games, the state machine manages both states and scenes:

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
        "room1": {},
        "safeOpen": {},
        "finished": {}
    }
}
```

## Configuration File

The `gameConfig.json` file contains the state machine configuration:

### Single-Room Configuration

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

### Multi-Room Configuration

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
        "room1": {},
        "safeOpen": {},
        "finished": {}
    }
}
```

See the [Scenes documentation](./scenes.md) for complete multi-room game setup.

## Configuration Properties

### initialState

| Property       | Type   | Description                     |
| -------------- | ------ | ------------------------------- |
| `initialState` | string | The state where the game starts |

### initialScene (Multi-Room Only)

| Property       | Type   | Description                     |
| -------------- | ------ | ------------------------------- |
| `initialScene` | string | The scene where the game starts |

### sceneTransitions (Multi-Room Only)

| Property           | Type   | Description                                |
| ------------------ | ------ | ------------------------------------------ |
| `sceneTransitions` | object | Defines allowed scene-to-scene transitions |

### transitions

| Property      | Type   | Description                            |
| ------------- | ------ | -------------------------------------- |
| `transitions` | object | Defines all possible state transitions |

**Structure:**

- Each key is a state name (e.g., `"room1"`)
- Each value is an object where:
    - Key is an **action** name (e.g., `"openSafe"`)
    - Value is the **destination state** (e.g., `"safeOpen"`)

## Scene Transitions

For multi-room games, scene transitions define how players can move between rooms:

```json
{
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
    }
}
```

This configuration:

- Allows transitions from `foyer` to `library` and `garden`
- Allows transitions from `library` back to `foyer`
- Allows transitions from `garden` back to `foyer`
- Prevents direct transitions from `library` to `garden`

## How It Works

### Single-Room Games

1. The game starts in `initialState`
2. Hubspots with that state in their `visibleIn` array are displayed
3. When a hubspot triggers an action, the state machine transitions to the new state
4. The game now shows hubspots for the new state
5. This continues until the game reaches a terminal state (like `"finished"`)

### Multi-Room Games

1. The game starts in `initialScene` and `initialState`
2. Hubspots with matching `visibleIn` and `visibleInScenes` are displayed
3. When a scene hubspot is clicked, the scene transitions to the target scene
4. The new scene background loads, and hubspots are re-evaluated
5. Player inventory and flags persist across scene transitions
6. State transitions work the same way as in single-room games

**Example Flow:**

```json
{
    "initialScene": "foyer",
    "initialState": "room1",
    "sceneTransitions": {
        "foyer": { "toLibrary": "library" },
        "library": { "toFoyer": "foyer" }
    }
}
```

```
[foyer, room1]
    |
    | toLibrary (scene transition)
    v
[library, room1]
    |
    | openSafe (state transition)
    v
[library, safeOpen]
    |
    | toFoyer (scene transition)
    v
[foyer, safeOpen]
```

## Visual Flow

### Single-Room State Flow

```
[entrance]
    |
    | enterMainRoom
    v
[mainRoom] ----goToKitchen----> [kitchen] ----goToMainRoom--+
    |                           | findKey                    |
    | goToLibrary               +--> (returns to mainRoom)    |
    v                                                       |
[library] ----goToMainRoom----------------------------------+
    |
    | readBook
    +--> (stays in library, displays new content)

goToExit ----> [finished] (game over)
```

### Multi-Room Scene + State Flow

```
[foyer, room1] --toLibrary--> [library, room1] --toFoyer--> [foyer, room1]
       |                              |
       | openSafe                     | openSafe
       v                              v
[foyer, safeOpen]              [library, safeOpen]
```

## State Naming Conventions

Use descriptive state names that indicate location or situation:

| Good Names  | Description     |
| ----------- | --------------- |
| `entrance`  | Starting area   |
| `kitchen`   | Kitchen room    |
| `corridor`  | Hallway         |
| `safeRoom`  | Puzzle room     |
| `finalBoss` | Final encounter |

| Avoid              | Reason          |
| ------------------ | --------------- |
| `state1`, `state2` | Not descriptive |
| `room`             | Too generic     |
| `done`             | Ambiguous       |

## Scene Naming Conventions

Use descriptive scene names that indicate the room or area:

| Good Names | Description    |
| ---------- | -------------- |
| `foyer`    | Entry hall     |
| `library`  | Library room   |
| `garden`   | Outdoor garden |
| `kitchen`  | Kitchen area   |
| `attic`    | Attic space    |

| Avoid              | Reason          |
| ------------------ | --------------- |
| `scene1`, `scene2` | Not descriptive |
| `area1`, `area2`   | Not intuitive   |
| `locationA`        | Too abstract    |

## Terminal States

States with no transitions (empty object) are terminal states:

```json
{
    "finished": {},
    "gameOver": {},
    "victory": {}
}
```

These states end the game flow. You can use hubspots with the `finish` type to display win/lose messages.

Scenes do not have terminal states - players can always navigate between defined scenes.

## Complete Example

### Single-Room Game

```json
{
    "initialState": "entrance",
    "transitions": {
        "entrance": {
            "enterMainRoom": "mainRoom"
        },
        "mainRoom": {
            "goToKitchen": "kitchen",
            "goToLibrary": "library",
            "goToExit": "victory"
        },
        "kitchen": {
            "goToMainRoom": "mainRoom",
            "searchCupboard": "kitchenFoundKey"
        },
        "kitchenFoundKey": {
            "goToMainRoom": "mainRoom"
        },
        "library": {
            "goToMainRoom": "mainRoom",
            "searchBooks": "librarySecretPassage"
        },
        "librarySecretPassage": {
            "goToSecretRoom": "secretRoom"
        },
        "secretRoom": {
            "goToMainRoom": "mainRoom",
            "pullLever": "mainRoom",
            "goToTreasure": "treasureRoom"
        },
        "treasureRoom": {
            "goToMainRoom": "mainRoom",
            "claimTreasure": "victory"
        },
        "victory": {}
    }
}
```

### Multi-Room Game

See the [Scenes documentation](./scenes.md) for complete multi-room examples.

## Integration with Hubspots

States work together with hubspots via the `visibleIn` property:

```json
[
    {
        "id": "doorToKitchen",
        "type": "action",
        "visibleIn": ["mainRoom"],
        "x": 20,
        "y": 50,
        "emoji": "🚪",
        "action": "goToKitchen"
    },
    {
        "id": "kitchenDoor",
        "type": "action",
        "visibleIn": ["kitchen", "kitchenFoundKey"],
        "x": 80,
        "y": 50,
        "emoji": "🚪",
        "action": "goToMainRoom"
    }
]
```

For multi-room games, also use `visibleInScenes`:

```json
[
    {
        "id": "toLibrary",
        "type": "scene",
        "visibleInScenes": ["foyer"],
        "visibleIn": ["room1"],
        "targetScene": "library",
        "emoji": "📚",
        "x": 30,
        "y": 10
    },
    {
        "id": "libraryBook",
        "type": "modal",
        "visibleInScenes": ["library"],
        "visibleIn": ["room1"],
        "emoji": "📖",
        "modalText": "A rare book!"
    }
]
```

The `doorToKitchen` hubspot only appears in the `mainRoom` state. When clicked, it triggers the `goToKitchen` action, transitioning to the `kitchen` state where the `kitchenDoor` hubspot becomes visible.

In multi-room games, the `toLibrary` hubspot only appears in the `foyer` scene. When clicked, it transitions to the `library` scene where `libraryBook` becomes visible.

## State Machine API

The state machine provides the following methods:

| Method                  | Returns | Description                    |
| ----------------------- | ------- | ------------------------------ |
| `getState()`            | string  | Returns the current state name |
| `getScene()`            | string  | Returns the current scene ID   |
| `transition(action)`    | boolean | Attempts a state transition    |
| `transitionToScene(id)` | boolean | Attempts a scene transition    |
| `getSceneConfig(id)`    | object  | Returns scene configuration    |

## Best Practices

1. **Keep states simple**: Each state should represent one clear situation
2. **Use consistent naming**: Follow a naming convention throughout
3. **Plan your flow**: Sketch the state diagram before implementing
4. **Plan room layout**: For multi-room games, sketch room connections
5. **Test transitions**: Verify all state and scene transitions work correctly
6. **Document complex logic**: Add comments for non-obvious state/scene changes

## Debugging Tips

1. Open browser developer tools (F12)
2. Check the console for errors
3. Use `console.log` in `scripts/stateMachine.js` to trace state and scene changes
4. Verify all action names in hubspots match transitions in `gameConfig.json`
5. Ensure every state in `visibleIn` has a corresponding entry in `transitions`
6. For multi-room games, verify `targetScene` IDs match scenes in `scenes.json`
7. Check that scene transitions are defined in `sceneTransitions`

## See Also

- [Scenes](./scenes.md) - Multi-room game configuration
- [Hubspots](./hubspots.md) - Interactive elements and scene transitions
