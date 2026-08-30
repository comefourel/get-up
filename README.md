# Semaine — PWA

Application de suivi nutrition / entraînement, sélections nageur sauveteur Gironde, avril 2027.

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `index.html` | L'application entière |
| `manifest.webmanifest` | Nom, icônes, couleurs — permet l'installation |
| `sw.js` | Service worker : fonctionnement hors ligne |
| `icon-*.png` | Icônes d'écran d'accueil |

**Les quatre fichiers doivent rester ensemble, à la racine.**

## Mise en ligne

1. Créer un dépôt public sur github.com (par exemple `semaine`)
2. « Add file » → « Upload files » → déposer les 7 fichiers → « Commit changes »
3. Settings → Pages → Source : « Deploy from a branch », branche `main`, dossier `/ (root)` → Save
4. Après 1–2 minutes, le site est sur `https://TON-PSEUDO.github.io/semaine/`

## Installation sur iPhone

Ouvrir l'adresse **dans Safari** → bouton Partager → « Sur l'écran d'accueil ».
Le mode hors ligne s'active après cette première visite en ligne.

## Mise à jour

Remplacer le fichier dans le dépôt **et** incrémenter `VERSION` en haut de `sw.js`
(`v2` → `v3`). Sans ça, l'iPhone continuera d'afficher l'ancienne version.
