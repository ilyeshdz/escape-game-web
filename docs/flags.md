# Flags

Flags are boolean variables that track the state of certain conditions in the game (e.g., whether a door has been unlocked).

## Overview

Flags are used to:

- Track player progress
- Control hubspot visibility
- Enable/disable game features
- Remember player choices

## Setting Flags

Flags are typically activated (`true`) or deactivated (`false`) through hubspots.

| Property      | Description                                 |
| ------------- | ------------------------------------------- |
| `giveFlags`   | Array of flag names to activate (`true`)    |
| `removeFlags` | Array of flag names to deactivate (`false`) |

**Example:**

```json
{
    "id": "doorUnlock",
    "type": "useItem",
    "visibleIn": ["room1"],
    "requireItems": ["goldenKey"],
    "action": "unlockDoor",
    "giveFlags": ["doorUnlocked"]
}
```

In this example, when the player uses the `goldenKey` on the door, the `doorUnlocked` flag is activated.

## Flag Conditions

You can control hubspot visibility based on flag states.

| Condition         | Description                                         |
| ----------------- | --------------------------------------------------- |
| `requireFlags`    | Hubspot visible only if **all** flags are active    |
| `requireAnyFlags` | Hubspot visible if **at least one** flag is active  |
| `requireNotFlags` | Hubspot visible if **none** of the flags are active |

**Example:**

```json
{
    "id": "exitDoor",
    "type": "finish",
    "visibleIn": ["room1"],
    "emoji": "🚪",
    "requireFlags": ["doorUnlocked"],
    "win": true
}
```

In this example, the exit door is only visible if the `doorUnlocked` flag is active.

## Common Use Cases

### Door Unlocking

```json
[
    {
        "id": "lockedDoor",
        "type": "useItem",
        "visibleIn": ["corridor"],
        "x": 80,
        "y": 50,
        "emoji": "🚪",
        "requireItems": ["goldenKey"],
        "noItemMessage": "The door is locked.",
        "wrongItemMessage": "That key doesn't fit.",
        "action": "enterTreasureRoom",
        "giveFlags": ["doorUnlocked"]
    },
    {
        "id": "openDoor",
        "type": "action",
        "visibleIn": ["corridor"],
        "x": 80,
        "y": 50,
        "emoji": "🚪🚪",
        "action": "enterTreasureRoom",
        "requireFlags": ["doorUnlocked"]
    }
]
```

### Puzzle Progress

```json
[
    {
        "id": "puzzle1",
        "type": "secret",
        "visibleIn": ["puzzleRoom"],
        "x": 30,
        "y": 50,
        "emoji": "🔐",
        "prompt": "Enter the code:",
        "secretCode": "1234",
        "onSuccess": {
            "type": "modal",
            "modalText": "Correct! The first mechanism unlocks.",
            "giveFlags": ["puzzle1Solved"]
        }
    },
    {
        "id": "puzzle2",
        "type": "secret",
        "visibleIn": ["puzzleRoom"],
        "x": 70,
        "y": 50,
        "emoji": "🔐",
        "prompt": "Enter the code:",
        "secretCode": "5678",
        "onSuccess": {
            "type": "modal",
            "modalText": "Correct! The second mechanism unlocks.",
            "giveFlags": ["puzzle2Solved"]
        }
    },
    {
        "id": "finalDoor",
        "type": "action",
        "visibleIn": ["puzzleRoom"],
        "x": 50,
        "y": 80,
        "emoji": "🏆",
        "action": "victory",
        "requireFlags": ["puzzle1Solved", "puzzle2Solved"]
    }
]
```

### Choice Tracking

```json
[
    {
        "id": "choosePathA",
        "type": "action",
        "visibleIn": ["crossroads"],
        "x": 30,
        "y": 60,
        "emoji": "🌲",
        "action": "forestPath",
        "giveFlags": ["choseForest"]
    },
    {
        "id": "choosePathB",
        "type": "action",
        "visibleIn": ["crossroads"],
        "x": 70,
        "y": 60,
        "emoji": "🏔️",
        "action": "mountainPath",
        "giveFlags": ["choseMountain"]
    },
    {
        "id": "forestEncounter",
        "type": "modal",
        "visibleIn": ["forestPath"],
        "emoji": "🐺",
        "modalText": "A wolf appears!",
        "requireFlags": ["choseForest"]
    },
    {
        "id": "mountainEncounter",
        "type": "modal",
        "visibleIn": ["mountainPath"],
        "emoji": "🦅",
        "modalText": "An eagle soars overhead!",
        "requireFlags": ["choseMountain"]
    }
]
```

## Removing Flags

You can also deactivate flags using the `removeFlags` property:

```json
{
    "id": "resetPuzzle",
    "type": "action",
    "visibleIn": ["puzzleRoom"],
    "x": 10,
    "y": 10,
    "emoji": "🔄",
    "action": "resetPuzzle",
    "removeFlags": ["puzzle1Solved", "puzzle2Solved"],
    "modalText": "The puzzle resets."
}
```

## Combining with Inventory Conditions

Flags can be combined with inventory conditions for complex game logic:

```json
{
    "id": "conditionalDoor",
    "type": "useItem",
    "visibleIn": ["hallway"],
    "x": 80,
    "y": 50,
    "emoji": "🚪",
    "requireItems": ["masterKey"],
    "requireFlags": ["keyCollected", "bossDefeated"],
    "requireNotFlags": ["doorOpened"],
    "noItemMessage": "You need a key to open this door.",
    "action": "enterSecretRoom",
    "giveFlags": ["doorOpened"]
}
```

This hubspot will only be visible if:

- Player has the `masterKey` item
- The `keyCollected` flag is active
- The `bossDefeated` flag is active
- The `doorOpened` flag is NOT active

## Best Practices

1. **Use descriptive names**: Name flags clearly (e.g., `doorUnlocked` not `flag1`)
2. **Group related flags**: Use prefixes for related flags (e.g., `puzzle1Solved`, `puzzle2Solved`)
3. **Keep flags minimal**: Only create flags when necessary for game logic
4. **Document complex logic**: Add comments or documentation for complex flag combinations
5. **Test thoroughly**: Verify all flag combinations work correctly
