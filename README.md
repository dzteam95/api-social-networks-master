# api-social-networks




Table des matières
Installation
Configuration
Usage
Installation du facteur
Tables Mongodb
Codes d'état


Installation
Utilisez git clone pour installer cette application.

git clone https://github.com/dzteam95/api-social-networks-master.git

installation de npm

Configuration
 
remplacer dans le fichier server.js dans le répertoire app racine et écrivez la configuration ci-dessous.

const host = 'mongodb+srv://user:mdp@cluster0-sfcbp.gcp.mongodb.net/test?retryWrites=true&w=majority'

Ou vous pouvre utiliser une configuration adaptée .env en créant la variable de connexion nécessaires et
en remplacant les donnée par les votres .

Pour toutes vos demandes, ajoutez un en-tête x-access-tokenavec valeuryour token above

Usage
npm run start

Installation du facteur
Téléchargez le fichier des collections postman ici
https://documenter.getpostman.com/view/11431772/SzmmTE6s?version=latest ( en cours de finition)

Tables Mongodb
Voici toutes les tables utilisées pour ce projet

Table
albums
albums_pictures
comments
discussions
events
groups
invitations
messages
Sondages_questions
Sondages_reponses
Sondages_questions_reponses
shoopings
shopping_items
billet_vendu
billet_type
users
Codes d'état

Cette API renvoie les codes d'état suivants:

Code d'état	La description
200	OK
201	CREATED
400	BAD REQUEST
404	NOT FOUND
500	INTERNAL SERVER ERROR
URL de base: http://localhost:3030/v1
