# Inventory

The inventory system allows players to collect and use items. The inventory is displayed as a hotbar with 9 slots at the bottom of the screen.

## Item Structure

Items are given to players through hubspots via the `giveItems` property.

### Basic Properties

| Property      | Type    | Required | Description                                   |
| ------------- | ------- | -------- | --------------------------------------------- |
| `id`          | string  | Yes      | Unique identifier for the item                |
| `name`        | string  | Yes      | Item name displayed in inventory              |
| `description` | string  | No       | Item description (shown on double-click)      |
| `icon`        | string  | No       | Path to item icon image                       |
| `emoji`       | string  | No       | Emoji to display as icon                      |
| `usable`      | boolean | No       | If true, player can select and use the item   |
| `consumable`  | boolean | No       | If true, item is removed after successful use |

**Display Priority:** `icon` -> `emoji` -> First 2 letters of name

**Example:**

```json
{
    "id": "goldenKey",
    "name": "Golden Key",
    "description": "An ornate key that looks important.",
    "emoji": "🔑",
    "usable": true,
    "consumable": true
}
```

## Inventory Display

The inventory is displayed as a hotbar with 9 slots at the bottom of the screen.

| State          | Visual                                   |
| -------------- | ---------------------------------------- |
| Empty slots    | Dashed border, reduced opacity           |
| Occupied slots | Solid border                             |
| Selected item  | Green border with glow effect            |
| Numbered slots | Numbers 1-9 displayed in top-left corner |

## Using the Inventory

| Action                     | Description                               |
| -------------------------- | ----------------------------------------- |
| Left click                 | Select/deselect an item                   |
| Double-click               | Show item details                         |
| Keys 1-9                   | Quickly select item in corresponding slot |
| Click on "useItem" hubspot | Use selected item on the hubspot          |

## Inventory Conditions

You can control hubspot visibility based on items the player possesses.

| Condition         | Description                                         |
| ----------------- | --------------------------------------------------- |
| `requireItems`    | Hubspot visible only if player has **all** items    |
| `requireAnyItems` | Hubspot visible if player has **at least one** item |
| `requireNotItems` | Hubspot visible if player has **none** of the items |

**Example:**

```json
{
    "id": "lockedChest",
    "type": "modal",
    "visibleIn": ["room2"],
    "requireNotItems": ["chestKey"],
    "modalText": "This chest is locked. You need a key."
}
```

## Complete Example

Here's an example showing different item types and how to use them:

### 1. Collectible Item (Non-usable)

```json
{
    "id": "note",
    "name": "Torn Note",
    "description": "A piece of paper with numbers written on it.",
    "emoji": "📜"
}
```

### 2. Usable Item (Single-use)

```json
{
    "id": "goldenKey",
    "name": "Golden Key",
    "description": "An ornate key that looks important.",
    "emoji": "🔑",
    "usable": true,
    "consumable": true
}
```

### 3. Usable Item (Multi-use)

```json
{
    "id": "flashlight",
    "name": "Flashlight",
    "description": "A battery-powered flashlight.",
    "emoji": "🔦",
    "usable": true,
    "consumable": false
}
```

### 4. Item with Custom Icon

```json
{
    "id": "map",
    "name": "Treasure Map",
    "description": "An old map showing the location of treasure.",
    "icon": "/assets/icons/map.png"
}
```

## Usage in Hubspots

### Giving an Item

```json
{
    "id": "chest",
    "type": "modal",
    "visibleIn": ["room1"],
    "emoji": "📦",
    "modalText": "You find a treasure chest!",
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
```

### Requiring an Item

```json
{
    "id": "door",
    "type": "action",
    "visibleIn": ["room1"],
    "x": 80,
    "y": 50,
    "emoji": "🚪",
    "action": "enterCorridor",
    "requireItems": ["goldenKey"]
}
```

### Using an Item on a Hubspot

```json
{
    "id": "door",
    "type": "useItem",
    "visibleIn": ["room1"],
    "x": 80,
    "y": 50,
    "emoji": "🚪",
    "requireItems": ["goldenKey", "flashlight"],
    "noItemMessage": "You need to select an item to use here.",
    "wrongItemMessage": "That item doesn't work on this door.",
    "action": "enterCorridor",
    "giveFlags": ["doorUnlocked"]
}
```

## Persistence

The inventory automatically saves to `localStorage`, so player progress is preserved across browser sessions. This includes:

- Collected items
- Selected item
- Item order in inventory

To clear the inventory, the player can clear their browser cache or use the browser's developer tools to remove the `escape-game-web` localStorage data.
