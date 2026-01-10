# Inventaire

Le système d'inventaire permet au joueur de collecter et d'utiliser des objets.

## Structure d'un objet

Les objets sont définis directement dans les [hubspots](./hubspots.md) de type `pickup`.

Voici la structure d'un objet:

```json
{
  "id": "goldenKey",
  "name": "Clé dorée",
  "description": "Une clé qui semble importante.",
  "icon": "assets/golden-key-icon.png",
  "usable": true,
  "consumable": true
}
```

*   `id` (string, requis): Un identifiant unique pour l'objet.
*   `name` (string, requis): Le nom de l'objet qui sera affiché dans l'inventaire.
*   `description` (string, optionnel): Une description de l'objet, visible en double-cliquant dessus.
*   `icon` (string, optionnel): Le chemin vers l'icône de l'objet. Si non fourni, les deux premières lettres du nom seront affichées.
*   `usable` (boolean, optionnel): Si `true`, le joueur peut sélectionner l'objet pour l'utiliser.
*   `consumable` (boolean, optionnel): Si `true`, l'objet est retiré de l'inventaire après avoir été utilisé avec succès.

## Conditions d'inventaire

Vous pouvez contrôler la visibilité des hubspots en fonction des objets que le joueur possède.

*   `requireItems`: Le hubspot ne sera visible que si le joueur possède **tous** les objets de la liste.
*   `requireAnyItems`: Le hubspot ne sera visible que si le joueur possède **au moins un** des objets de la liste.
*   `requireNotItems`: Le hubspot ne sera visible que si le joueur ne possède **aucun** des objets de la liste.

**Exemple:**

```json
{
  "id": "lockedChest",
  "type": "modal",
  "visibleIn": ["room2"],
  "requireNotItems": ["chestKey"],
  "modalText": "Ce coffre est verrouillé."
}
```
