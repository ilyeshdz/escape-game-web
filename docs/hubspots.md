# Hubspots

Les "hubspots" sont les éléments interactifs du jeu. Ils sont définis dans le fichier `data/hubspots.json`.

Chaque hubspot est un objet JSON avec les propriétés suivantes:

*   `id` (string, requis): Un identifiant unique pour le hubspot.
*   `type` (string, requis): Le type de hubspot. Voir les types ci-dessous.
*   `visibleIn` (array, requis): Un tableau d'états dans lesquels le hubspot est visible.
*   `x` (number, requis): La position horizontale du hubspot en pourcentage (0-100).
*   `y` (number, requis): La position verticale du hubspot en pourcentage (0-100).
*   `size` (number, optionnel): La taille du hubspot en pixels.
*   `tooltip` (string, optionnel): Un texte qui s'affiche au survol du hubspot.
*   `isHidden` (boolean, optionnel): Si `true`, le hubspot est invisible mais toujours cliquable.

## Types de Hubspot

### `modal`

Affiche une fenêtre modale avec du texte.

**Propriétés supplémentaires:**

*   `modalText` (string, requis): Le texte à afficher dans la modale (peut contenir du HTML).

### `action`

Déclenche une action dans la machine à états.

**Propriétés supplémentaires:**

*   `action` (string, requis): Le nom de l'action à déclencher.

### `finish`

Termine le jeu (gagné ou perdu).

**Propriétés supplémentaires:**

*   `win` (boolean, optionnel): Si `true`, le jeu est gagné. Si `false` ou non défini, le jeu est perdu.

### `link`

Ouvre un lien dans un nouvel onglet.

**Propriétés supplémentaires:**

*   `url` (string, requis): L'URL à ouvrir.

### `secret`

Affiche une modale demandant un code secret.

**Propriétés supplémentaires:**

*   `prompt` (string, optionnel): Le texte à afficher au-dessus du champ de saisie.
*   `secretCode` (string, requis): Le code secret à entrer.
*   `onSuccess` (object, optionnel): Un objet qui définit ce qui se passe lorsque le code est correct. Peut contenir les mêmes propriétés qu'un hubspot (`type`, `action`, `modalText`, `win`).

### `pickup`

Permet au joueur de ramasser un objet.

**Propriétés supplémentaires:**

*   `item` (object, requis): L'objet à ramasser. Voir la documentation sur l'inventaire pour le format de l'objet.
*   `requireMessage` (string, optionnel): Un message à afficher si le joueur n'a pas les objets requis pour ramasser cet objet.

### `useItem`

Permet au joueur d'utiliser un objet sur le hubspot.

**Propriétés supplémentaires:**

*   `requireItems` (array, requis): Un tableau d'IDs d'objets qui peuvent être utilisés sur ce hubspot.
*   `noItemMessage` (string, optionnel): Le message à afficher si le joueur n'a pas sélectionné d'objet.
*   `wrongItemMessage` (string, optionnel): Le message à afficher si le joueur utilise le mauvais objet.
*   `action` (string, optionnel): L'action à déclencher si l'objet est utilisé avec succès.
*   `giveFlags` (array, optionnel): Un tableau de "flags" à activer.
