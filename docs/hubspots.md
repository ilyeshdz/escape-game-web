# Hubspots

Hubspots are the interactive elements of the game. They are defined in the `data/hubspots.json` file.

## Basic Structure

Each hubspot is a JSON object with the following properties:

| Property    | Type    | Required | Description                                       |
| ----------- | ------- | -------- | ------------------------------------------------- |
| `id`        | string  | Yes      | Unique identifier for the hubspot                 |
| `type`      | string  | Yes      | Hubspot type (see below)                          |
| `visibleIn` | array   | Yes      | Array of states where the hubspot is visible      |
| `x`         | number  | Yes      | Horizontal position as percentage (0-100)         |
| `y`         | number  | Yes      | Vertical position as percentage (0-100)           |
| `size`      | number  | No       | Hubspot size in pixels (default: 40)              |
| `emoji`     | string  | No       | Emoji to display instead of white circle          |
| `tooltip`   | string  | No       | Text displayed on hover                           |
| `isHidden`  | boolean | No       | If true, hubspot is invisible but still clickable |

## Hubspot Display

Hubspots with the `emoji` property are displayed as emojis on the canvas. Other hubspots are displayed as semi-transparent white circles.

## Hubspot Types

### modal

Displays a modal window with text.

**Additional Properties:**

| Property    | Type   | Required | Description                                     |
| ----------- | ------ | -------- | ----------------------------------------------- |
| `modalText` | string | Yes      | Text to display in the modal (can contain HTML) |

**Example:**

```json
{
    "id": "note",
    "type": "modal",
    "visibleIn": ["room1"],
    "x": 25,
    "y": 60,
    "emoji": "📜",
    "modalText": "<p>You find a torn note:</p><p><em>The code is 1234</em></p>"
}
```

### action

Triggers an action in the state machine.

**Additional Properties:**

| Property | Type   | Required | Description                |
| -------- | ------ | -------- | -------------------------- |
| `action` | string | Yes      | The action name to trigger |

**Example:**

```json
{
    "id": "openDoor",
    "type": "action",
    "visibleIn": ["room1"],
    "x": 80,
    "y": 50,
    "emoji": "🚪",
    "action": "enterCorridor"
}
```

### finish

Ends the game (win or lose).

**Additional Properties:**

| Property | Type    | Required | Description                                               |
| -------- | ------- | -------- | --------------------------------------------------------- |
| `win`    | boolean | No       | If true, game is won. If false or undefined, game is lost |

**Example (Win):**

```json
{
    "id": "exit",
    "type": "finish",
    "visibleIn": ["corridor"],
    "x": 50,
    "y": 80,
    "emoji": "🏆",
    "win": true
}
```

**Example (Lose):**

```json
{
    "id": "trap",
    "type": "finish",
    "visibleIn": ["room2"],
    "x": 50,
    "y": 50,
    "emoji": "💀",
    "win": false
}
```

### link

Opens a URL in a new tab.

**Additional Properties:**

| Property | Type   | Required | Description |
| -------- | ------ | -------- | ----------- |
| `url`    | string | Yes      | URL to open |

**Example:**

```json
{
    "id": "clueLink",
    "type": "link",
    "visibleIn": ["room1"],
    "x": 70,
    "y": 30,
    "emoji": "🔗",
    "url": "https://example.com/clue"
}
```

### secret

Displays a modal asking for a secret code.

**Additional Properties:**

| Property     | Type   | Required | Description                                       |
| ------------ | ------ | -------- | ------------------------------------------------- |
| `prompt`     | string | No       | Text to display above the input field             |
| `secretCode` | string | Yes      | The secret code to enter                          |
| `onSuccess`  | object | No       | Object defining what happens when code is correct |

**Example with onSuccess:**

```json
{
    "id": "safe",
    "type": "secret",
    "visibleIn": ["room1"],
    "x": 50,
    "y": 50,
    "emoji": "🔐",
    "prompt": "Enter the 4-digit code:",
    "secretCode": "1234",
    "onSuccess": {
        "type": "modal",
        "modalText": "The safe opens! You find a golden key.",
        "giveFlags": ["safeOpened"],
        "giveItems": [
            {
                "id": "goldenKey",
                "name": "Golden Key",
                "emoji": "🔑",
                "usable": true,
                "consumable": true
            }
        ]
    }
}
```

### useItem

Allows the player to use an item on the hubspot.

**Additional Properties:**

| Property           | Type   | Required | Description                         |
| ------------------ | ------ | -------- | ----------------------------------- |
| `requireItems`     | array  | Yes      | Array of item IDs that can be used  |
| `noItemMessage`    | string | No       | Message if no item selected         |
| `wrongItemMessage` | string | No       | Message if wrong item used          |
| `action`           | string | No       | Action to trigger on successful use |
| `giveFlags`        | array  | No       | Flags to activate on successful use |

**Example:**

```json
{
    "id": "door",
    "type": "useItem",
    "visibleIn": ["room1", "corridor"],
    "x": 85,
    "y": 50,
    "emoji": "🚪",
    "requireItems": ["goldenKey"],
    "noItemMessage": "You need a key to open this door.",
    "wrongItemMessage": "This key doesn't fit.",
    "action": "enterTreasureRoom",
    "giveFlags": ["doorUnlocked"]
}
```

## Giving Items to Players

Multiple hubspot types can give items to the player via the `giveItems` property:

```json
{
    "id": "treasureChest",
    "type": "modal",
    "visibleIn": ["room1"],
    "emoji": "📦",
    "modalText": "You find a treasure chest!",
    "giveItems": [
        {
            "id": "potion",
            "name": "Health Potion",
            "description": "Restores 50 health points.",
            "emoji": "🧪"
        },
        {
            "id": "goldenKey",
            "name": "Golden Key",
            "emoji": "🔑",
            "usable": true,
            "consumable": true
        }
    ]
}
```

Each item in `giveItems` can contain all properties described in the inventory documentation.

## Visibility Conditions

You can control hubspot visibility based on flags and items.

### Flag Conditions

| Condition         | Description                                         |
| ----------------- | --------------------------------------------------- |
| `requireFlags`    | Hubspot visible only if **all** flags are active    |
| `requireAnyFlags` | Hubspot visible if **at least one** flag is active  |
| `requireNotFlags` | Hubspot visible if **none** of the flags are active |

**Example:**

```json
{
    "id": "safeSuccess",
    "type": "modal",
    "visibleIn": ["safeOpen"],
    "emoji": "🔓",
    "requireNotFlags": ["safeOpened"],
    "modalText": "The safe opens! You find a key."
}
```

### Inventory Conditions

See the [inventory documentation](./inventory.md) for `requireItems`, `requireAnyItems`, and `requireNotItems` conditions.

**Example:**

```json
{
    "id": "lockedChest",
    "type": "modal",
    "visibleIn": ["room2"],
    "requireNotItems": ["chestKey"],
    "modalText": "This chest is locked."
}
```

## Complete Example

Here's a more complete example showing a room with multiple hubspots:

```json
[
    {
        "id": "door",
        "type": "action",
        "visibleIn": ["entrance"],
        "x": 80,
        "y": 50,
        "emoji": "🚪",
        "action": "enterMainRoom",
        "requireNotFlags": ["doorUnlocked"]
    },
    {
        "id": "doorOpen",
        "type": "action",
        "visibleIn": ["entrance"],
        "x": 80,
        "y": 50,
        "emoji": "🚪",
        "action": "enterMainRoom",
        "requireFlags": ["doorUnlocked"]
    },
    {
        "id": "key",
        "type": "modal",
        "visibleIn": ["entrance"],
        "x": 20,
        "y": 70,
        "emoji": "🔑",
        "modalText": "You find a rusty key on the floor.",
        "giveItems": [
            {
                "id": "rustyKey",
                "name": "Rusty Key",
                "emoji": "🔑",
                "usable": true,
                "consumable": false
            }
        ]
    },
    {
        "id": "useKeyOnDoor",
        "type": "useItem",
        "visibleIn": ["entrance"],
        "x": 80,
        "y": 50,
        "emoji": "🚪",
        "requireItems": ["rustyKey"],
        "noItemMessage": "The door is locked. You need a key.",
        "wrongItemMessage": "That key doesn't fit this door.",
        "action": "enterMainRoom",
        "giveFlags": ["doorUnlocked"]
    }
]
```
