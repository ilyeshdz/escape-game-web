# Inventaire

Le système d'inventaire permet au joueur de collecter et d'utiliser des objets. L'inventaire est affiché sous forme de hotbar de 9 emplacements en bas de l'écran.

## Structure d'un objet

Les objets sont définis dans les hubspots via la propriété `giveItems`.

Voici la structure d'un objet:

```json
{
  "id": "goldenKey",
  "name": "Clé dorée",
  "description": "Une clé qui semble importante.",
  "emoji": "🔑",
  "usable": true,
  "consumable": true
}
```

*   `id` (string, requis): Un identifiant unique pour l'objet.
*   `name` (string, requis): Le nom de l'objet qui sera affiché dans l'inventaire.
*   `description` (string, optionnel): Une description de l'objet, visible en double-cliquant dessus.
*   `icon` (string, optionnel): Le chemin vers l'icône de l'objet.
*   `emoji` (string, optionnel): Un émoji à afficher comme icône. Si non fourni, les deux premières lettres du nom seront affichées.
*   `usable` (boolean, optionnel): Si `true`, le joueur peut sélectionner l'objet pour l'utiliser.
*   `consumable` (boolean, optionnel): Si `true`, l'objet est retiré de l'inventaire après avoir été utilisé avec succès.

**Priorité d'affichage:** `icon` → `emoji` → 2 premières lettres du nom

## Visuels de l'inventaire

L'inventaire est affiché sous forme de hotbar de 9 emplacements en bas de l'écran.

- **Emplacements vides**: Affichés avec une bordure en traits pointillés et une opacité réduite
- **Emplacements occupés**: Affichés avec une bordure solide
- **Objet sélectionné**: Bordure verte avec effet de brillance
- **Emplacements numérotés**: Les numéros 1-9 sont affichés en haut à gauche de chaque emplacement

## Utilisation de l'inventaire

- **Clic gauche**: Sélectionne/désélectionne un objet
- **Double-clic**: Affiche les détails de l'objet
- **Touches 1-9**: Sélectionne rapidement l'objet dans l'emplacement correspondant
- **Clic sur un hubspot "useItem"**: Utilise l'objet sélectionné sur le hubspot

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
