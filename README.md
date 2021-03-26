# slideshow

Ce projet permet de réaliser des diaporamas qui peuvent inclure : 
- des photos
- des videos
- des musics
- du texte

Il est composé d'un [slideshowPlayer](documentation/slideshowPlayer.md) et d'un [slideshowTools](documentation/slideshowTools.md)

Tout le code s'exécute en local.
- Les photos sont dans le dossier local : photos
- Les videos dans le dossier local : videos
- les musics dans le dossier local : musics

Pour exporter votre animation, 
- copir le dernier fichier sauvegardé : slideshowData-1616342130635.json qui se situe dans votre répertoire de téléchargement dans le répertoire d'installation.
- puis de zipper tout le dossier 

# Demo on line

- Cliquez [ici](https://rejan73.github.io/slideshow/)

# Pré-requis
- Navigateur web google chrome (les tests ont été fait que sous google chrome)

# Installation
- Téléchargez [la dernière version](https://github.com/Rejan73/slideshow/releases/)
- Dézippez l'archive dans un dossier
- Allez dans le dossier slideshow-1.0.0 (1.0.0 correspond à la version téléchargée)

# Démarrage
Lancement du player : 
- Lancez dans le navigateur la page slideshowPlayer.html pour le player
- Cliquez sur l'icône et sélectionnez le fichier du dossier slideshowDataDemo.json
- Cliquez sur l'icône play

Lancement de la boite à outils :
- Lancer dans le navigateur la page slideshowTools.html pour les outils qui permettent de modifier ou de créer votre propre animation


# Versions

Les versions sont disponibles [ici](https://github.com/Rejan73/slideshow/releases/)

## Next version 
- ajout d'un fichier de démo
- offline version (pas besoin de connexion internet pour fonctionner)

## 1.0.0
Première version qui contient le slideshowPlayer et le slideshowTools 
Les effects disponibles dans cette version :
- Pour les photos : sépia et noir et blanc
- Pour le texte : effec starwars
- Pour les photos et textes : movement de haut en bas, de bas en haut, de gauche à droite et de droite vers gauche
- Pour les photos et textes : apparation progression(fadeIn) et disparation progression(fadeOut)
