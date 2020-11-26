# Groupomania
[![forthebadge](https://forthebadge.com/images/badges/made-with-vue.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/powered-by-coffee.svg)](https://forthebadge.com)

Projet n°7 réalisé dans le cadre de la formation de Développeur Web d'OpenClassroom.

## Pour commencer

### Pré-requis

Il est nécéssaire que certaines technologies soient installées sur votre machine si vous souhaitez lancer ce projet.

- Node.JS
- Vue CLI
- MySQL

### Installation

Dans le dossier frontend, comme dans le dossier backend, executez la commande ``npm install``.

Ensuite :

- Créez une base de donnée MySQL appelée **bddp7** avec la commande ``CREATE DATABASE bddp7 CHARACTER SET 'utf8';``.
- Créez un utilisateur appelé **adminP7** et donnez lui le mot de passe **1234** avec la commande ``CREATE USER 'adminP7'@'localhost' IDENTIFIED BY '1234';``.
- Donnez a cet utilisateur tout les droits sur cette base de donnée avec la commande ``GRANT ALL PRIVILEGES ON bddp7.* TO 'adminP7'@'localhost';``.
- Travaillez dans la base de donnée **bddp7** avec la commande ``USE bddp7``.
- Executez le script **bddp7.sql** avec la commande ``SOURCE chemin_vers_bddp7.sql;``. (Si ça ne fonctionne pas en tant que **adminP7**, essayez en tant que **root**.)

## Démarrage

- Lancez le backend avec la commande ``node server``.
- Lancez le frontend avec la commande ``npm run serve``.

## Précisions

Les identifiants de l'admin sont :
- email : spiderman@gmail.com
- mdp : Admin1234

## Auteurs
- [@Iki1337](https://github.com/Iki1337)
