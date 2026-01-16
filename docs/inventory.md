# Inventory

The inventory system allows players to collect and use items. The inventory is displayed as a hotbar with 9 slots at the bottom of the screen.

## Centralized Item Definitions

Items are defined centrally in `data/items.json` to avoid duplication and ensure consistency across the game. This allows items to be referenced by ID across multiple hubspots without redefining them.

### Item Definition Structure

| Property           | Type    | Required | Default | Description                                     |
| ------------------ | ------- | -------- | ------- | ----------------------------------------------- |
| `id`               | string  | Yes      | -       | Unique item identifier (key in items object)    |
| `name`             | string  | Yes      | -       | Display name shown to player                    |
| `shortDescription` | string  | No       | null    | Brief description for tooltips                  |
| `description`      | string  | No       | ""      | Full description for item inspection            |
| `emoji`            | string  | No       | null    | Emoji icon displayed in inventory               |
| `icon`             | string  | No       | null    | Path to custom icon image                       |
| `category`         | string  | No       | "misc"  | Item category (key, consumable, resource, lore) |
| `stackable`        | boolean | No       | false   | Whether item can stack in inventory             |
| `maxStack`         | number  | No       | 99      | Maximum stack size when stackable               |
| `usable`           | boolean | No       | false   | Can be selected and used by player              |
| `consumable`       | boolean | No       | false   | Item is consumed on use                         |
| `destroyable`      | boolean | No       | true    | Player can discard/destroy the item             |
| `pickupMessage`    | string  | No       | null    | Message shown when item is picked up            |
| `useMessage`       | string  | No       | null    | Message shown when item is used                 |

**Example `data/items.json`:**

```json
{
    "version": "1.0.0",
    "description": "Centralized item definitions for the escape game",
    "items": {
        "goldenKey": {
            "name": "Golden Key",
            "shortDescription": "A golden key that shines slightly",
            "description": "A golden key that shines slightly. It seems made for a special lock.",
            "emoji": "🔑",
            "category": "key",
            "usable": true,
            "consumable": true,
            "destroyable": false,
            "pickupMessage": "You find a golden key!"
        },
        "potion": {
            "name": "Health Potion",
            "shortDescription": "Restores 50 HP",
            "description": "A red potion that restores 50 HP.",
            "emoji": "🧪",
            "category": "consumable",
            "stackable": true,
            "maxStack": 10,
            "pickupMessage": "You found a potion!"
        }
    }
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

### Tooltips

Hovering over an item shows a tooltip with:

- Item icon (emoji or image)
- Item name
- Item description
- Category badges (Utilisable, Consommable)

## Using the Inventory

| Action                     | Description                               |
| -------------------------- | ----------------------------------------- |
| Left click                 | Select/deselect an item                   |
| Double-click               | Show item details                         |
| Keys 1-9                   | Quickly select item in corresponding slot |
| Click on "useItem" hubspot | Use selected item on the hubspot          |

## Inventory Conditions

You can control hubspot visibility based on items the player possesses. Use item IDs (not full objects) for conditions.

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

## Complete Examples

### Giving an Item (Recommended: itemId)

Use `itemId` to reference items defined in `data/items.json`:

```json
{
    "id": "chest",
    "type": "modal",
    "visibleIn": ["room1"],
    "emoji": "📦",
    "modalText": "You find a treasure chest!",
    "giveItems": [{ "itemId": "goldenKey" }]
}
```

### Giving Multiple Items

```json
{
    "id": "treasureRoom",
    "type": "modal",
    "visibleIn": ["room2"],
    "emoji": "💎",
    "modalText": "You find a treasure room!",
    "giveItems": [
        { "itemId": "potion", "quantity": 3 },
        { "itemId": "goldenKey" },
        { "itemId": "scroll" }
    ]
}
```

### Legacy: Inline Item Definition (Backward Compatible)

For custom one-off items, you can still define items inline:

```json
{
    "id": "chest",
    "type": "modal",
    "visibleIn": ["room1"],
    "emoji": "📦",
    "modalText": "You find a unique item!",
    "giveItems": [
        {
            "id": "specialKey",
            "name": "Special Key",
            "emoji": "🗝️",
            "usable": true,
            "consumable": true
        }
    ]
}
```

### Template with Overrides (Advanced)

You can extend a template with custom overrides using `_template`:

```json
{
    "id": "chest",
    "type": "modal",
    "visibleIn": ["room1"],
    "emoji": "📦",
    "modalText": "You find a special key!",
    "giveItems": [
        {
            "_template": "goldenKey",
            "name": "Ancient Golden Key",
            "pickupMessage": "You found an ancient golden key!"
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

## Debug Commands

When debug mode is enabled, you can use console commands to manage items:

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `/spawn <itemId>` | Add an item to inventory by its ID |
| `/items`          | List all available item IDs        |
| `/clear`          | Clear inventory                    |

**Example:**

```
/spawn goldenKey
/items
/clear
```

## Debug Commands

When debug mode is enabled, you can use console commands to manage items:

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `/spawn <itemId>` | Add an item to inventory by its ID |
| `/items`          | List all available item IDs        |
| `/clear`          | Clear inventory                    |

**Example:**

```
/spawn goldenKey
/items
/clear
```

## Item Categories

Items can be categorized for organizational purposes. The category affects tooltips and can be used for game logic.

| Category     | Description             | Example Items        |
| ------------ | ----------------------- | -------------------- |
| `key`        | Keys that unlock things | goldenKey, silverKey |
| `consumable` | Items that are used up  | potion, apple, food  |
| `resource`   | Collectible resources   | gem, ore, coin       |
| `lore`       | Story items and notes   | scroll, book, letter |
| `misc`       | Miscellaneous items     | tool, material       |

**Tooltip Display:**

The tooltip shows category-specific badges for usable and consumable items:

- **Utilisable** (green) - Item can be selected and used
- **Consommable** (red) - Item is consumed on use

## Complete Examples

### 1. Collectible Key (Non-usable until needed)

```json
{
    "id": "goldenKey",
    "name": "Golden Key",
    "shortDescription": "A golden key that shines slightly",
    "description": "A golden key that shines slightly. It seems made for a special lock.",
    "emoji": "🔑",
    "category": "key",
    "usable": true,
    "consumable": true,
    "destroyable": false,
    "pickupMessage": "You find a golden key!"
}
```

### 2. Stackable Consumable

```json
{
    "id": "potion",
    "name": "Health Potion",
    "shortDescription": "Restores 50 HP",
    "description": "A red potion that restores 50 HP.",
    "emoji": "🧪",
    "category": "consumable",
    "stackable": true,
    "maxStack": 10,
    "pickupMessage": "You found a potion!"
}
```

### 3. Lore Item

```json
{
    "id": "scroll",
    "name": "Ancient Scroll",
    "shortDescription": "An ancient spellbook",
    "description": "An ancient spellbook containing forgotten knowledge.",
    "emoji": "📜",
    "category": "lore",
    "stackable": false,
    "destroyable": true,
    "pickupMessage": "You found an ancient scroll!"
}
```

## Persistence

The inventory automatically saves to `localStorage`, so player progress is preserved across browser sessions. This includes:

- Collected items
- Selected item
- Item order in inventory

To clear the inventory, the player can clear their browser cache or use the browser's developer tools to remove the `escape-game-web` localStorage data.
