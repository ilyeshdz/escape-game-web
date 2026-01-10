# Machine à états

La machine à états (state machine) gère la progression du jeu. Elle est définie dans le fichier `data/gameConfig.json`.

## `gameConfig.json`

Ce fichier contient la configuration de la machine à états.

```json
{
  "initialState": "room1",
  "transitions": {
    "room1": {
      "openSafe": "safeOpen"
    },
    "safeOpen": {
      "unlockDoor": "safeOpen",
      "escape": "finished"
    },
    "finished": {}
  }
}
```

### `initialState`

*   **Type:** `string`
*   **Description:** L'état dans lequel le jeu commence.

### `transitions`

*   **Type:** `object`
*   **Description:** Un objet qui définit toutes les transitions possibles dans le jeu.
*   **Structure:**
    *   Chaque clé de cet objet est le nom d'un état (par exemple, `"room1"`).
    *   La valeur de chaque état est un autre objet où:
        *   La clé est le nom d'une **action** (par exemple, `"openSafe"`).
        *   La valeur est le nom de l'**état de destination** (par exemple, `"safeOpen"`).

## Comment ça marche

Le jeu est toujours dans un seul état à la fois. Les actions, généralement déclenchées par les [hubspots](./hubspots.md), provoquent des transitions d'un état à un autre.

La visibilité des hubspots est contrôlée par la propriété `visibleIn` de chaque hubspot, qui est un tableau de noms d'états.

Par exemple, si le jeu est dans l'état `"room1"`, seuls les hubspots avec `"room1"` dans leur tableau `visibleIn` seront affichés.
