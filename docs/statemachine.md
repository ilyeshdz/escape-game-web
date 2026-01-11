# State Machine

The state machine manages game progression. It is defined in the `data/gameConfig.json` file.

## Overview

The state machine controls:

- Current game location/room
- Available actions
- Visible hubspots
- Game flow and progression

The game is always in exactly one state at a time. Actions (typically triggered by hubspots) cause transitions from one state to another.

## Configuration File

The `gameConfig.json` file contains the state machine configuration:

```json
{
    "initialState": "room1",
    "transitions": {
        "room1": {
            "openSafe": "safeOpen"
        },
        "safeOpen": {
            "unlockDoor": "finished",
            "escape": "finished"
        },
        "finished": {}
    }
}
```

## Configuration Properties

### initialState

| Property       | Type   | Description                     |
| -------------- | ------ | ------------------------------- |
| `initialState` | string | The state where the game starts |

### transitions

| Property      | Type   | Description                            |
| ------------- | ------ | -------------------------------------- |
| `transitions` | object | Defines all possible state transitions |

**Structure:**

- Each key is a state name (e.g., `"room1"`)
- Each value is an object where:
    - Key is an **action** name (e.g., `"openSafe"`)
    - Value is the **destination state** (e.g., `"safeOpen"`)

## How It Works

1. The game starts in `initialState`
2. Hubspots with that state in their `visibleIn` array are displayed
3. When a hubspot triggers an action, the state machine transitions to the new state
4. The game now shows hubspots for the new state
5. This continues until the game reaches a terminal state (like `"finished"`)

**Example Flow:**

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
            "goToExit": "finished"
        },
        "kitchen": {
            "goToMainRoom": "mainRoom",
            "findKey": "mainRoom"
        },
        "library": {
            "goToMainRoom": "mainRoom",
            "readBook": "library"
        },
        "finished": {}
    }
}
```

## Visual Flow

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

## Complete Example

Here's a more complex example showing a complete game:

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

The `doorToKitchen` hubspot only appears in the `mainRoom` state. When clicked, it triggers the `goToKitchen` action, transitioning to the `kitchen` state where the `kitchenDoor` hubspot becomes visible.

## Best Practices

1. **Keep states simple**: Each state should represent one clear situation
2. **Use consistent naming**: Follow a naming convention throughout
3. **Plan your flow**: Sketch the state diagram before implementing
4. **Test transitions**: Verify all state transitions work correctly
5. **Document complex logic**: Add comments for non-obvious state changes

## Debugging Tips

1. Open browser developer tools (F12)
2. Check the console for errors
3. Use `console.log` in `scripts/stateMachine.js` to trace state changes
4. Verify all action names in hubspots match transitions in `gameConfig.json`
5. Ensure every state in `visibleIn` has a corresponding entry in `transitions`
