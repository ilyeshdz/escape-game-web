# Flags (Drapeaux)

Les "flags" sont des variables booléennes qui permettent de suivre l'état de certaines conditions dans le jeu (par exemple, si une porte a été déverrouillée).

## Utilisation

Les flags sont généralement activés (`true`) ou désactivés (`false`) via les [hubspots](./hubspots.md).

- `giveFlags`: Un tableau de noms de flags à activer (`true`).
- `removeFlags`: Un tableau de noms de flags à désactiver (`false`).

**Exemple:**

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

Dans cet exemple, lorsque le joueur utilise la `goldenKey` sur la porte, le flag `doorUnlocked` est activé.

## Conditions de Flags

Vous pouvez contrôler la visibilité des hubspots en fonction de l'état des flags.

- `requireFlags`: Le hubspot ne sera visible que si **tous** les flags de la liste sont activés.
- `requireAnyFlags`: Le hubspot ne sera visible que si **au moins un** des flags de la liste est activé.
- `requireNotFlags`: Le hubspot ne sera visible que si **aucun** des flags de la liste n'est activé.

**Exemple:**

```json
{
    "id": "exitDoor",
    "type": "finish",
    "visibleIn": ["room1"],
    "requireFlags": ["doorUnlocked"],
    "win": true
}
```

Dans cet exemple, la porte de sortie n'est visible que si le flag `doorUnlocked` est activé.
