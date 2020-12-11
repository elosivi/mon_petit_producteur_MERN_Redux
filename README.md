# `Mon petit producteur`

__Type__ : Final project

__Technologies__ : MERN Stack

__Repository name__ :  pff

__Repository rights__ :  ramassage-tek

## Set up before running project

After cloning the repository, install packages and dependencies both for server and client

```npm install```

In order to run properly the website, please import the MongoDB collections located inside MongoDB_collections/ directory

```mongoimport --db=MonPetitProducteur --collection=Products --file=products.json --host="localhost:27042"```

```mongoimport --db=MonPetitProducteur --collection=Producers --file=producers.json --host="localhost:27042"```

```mongoimport --db=MonPetitProducteur --collection=Consumers --file=consumers.json --host="localhost:27042"```

```mongoimport --db=MonPetitProducteur --collection=Categories --file=categories.json --host="localhost:27042"```

Finally, start both servers and have fun !

```npm start```

## **Middleware used :** ##
* Passport / Oauth
* Redux


## **Google Api keys ** ##
keys.js file was not pushed because it contain confidential clientID and client secret from Google API
To init your owen keys.js, you can follow this tutorial:
https://www.youtube.com/watch?v=or1_A4sJ-oY&list=PL4cUxeGkcC9jdm7QX143aMLAqyM-jTZ2x&index=8

