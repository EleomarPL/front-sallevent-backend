# SallEvent Clone

Sitio web (backend) donde se pueden reservar un sal贸n de eventos con diferentes servicios

# Comenzando 馃殌

Estas instrucciones te permitir谩n obtener una copia del proyecto en funcionamiento en tu m谩quina local para prop贸sitos de desarrollo y pruebas.

### Pre-requisitos 馃搵

- NodeJS versi贸n 10.16 o superior
- NPM versi贸n 5.6 o superior

Como requisitos previos, se debe contar con 4 colecciones creadas manualmente, a continuaci贸n se mostraran
tomando en cuenta el uso de un SGBD de mongodb local:

```
  db.directions.insert({"street" : "Benito Juarez", "state" : "Oaxaca", "municipality" : "Santo Domingo de Morelos", "suburb" : "12"})
```
```
  db.schedules.insert({"sunday" : "Y", "monday" : "Y", "tuesday" : "N", "wednesday" : "N", "thursday" : "N", "friday" : "Y", "saturday" : "Y"})
```
```
  db.inforooms.insert({"idDirection" : [ ObjectId("_aqu铆 id directions_") ], "idSchedule" : [ ObjectId("aqu铆 id schedules") ],})
```
```
  db.room.insert({"idInfo" : [ ObjectId("_aqu铆 id inforooms_") ], "name" : "SallEvent", "capacity" : 1000, "description" : "Salon de Santo Domingo de Morelos", "priceHour" : 100})
```

### Instalaci贸n (desarrollo) 馃敡

Antes de ejecutar debes crear un archivo _.env_ y declarar 2 variables de entorno, que son:
- STRING_CONNECTION, que deber谩 tener la API de conexi贸n a mongoDB
- WORD_SECRET, la palabra secreta con la que se firmara el token
- ID_ROOM, la id del sal贸n

Les recomiendo no compartir estos datos

Tal vez suene muy obvio pero primero clone el repositorio

```
    git clone https://github.com/EleomarPL/front-sallevent-backend
```

Instale las dependencias. Las depedencias ya se encuentran implicitas en el Package del proyecto, solo basta ejecutar la siguiente instrucci贸n:

```
    npm i
```

Ejecute el proyecto mediante el script (no se detectan cambios):

```
    npm start
```

Tambi茅n puedes ejecutar el c贸digo de la siguiente forma, que es la recomendable para el desarrollo, pues detecta los cambios que ejecutes al refrescar (hot reload), y es mediante el script:

```
    npm run start-dev
```

## Construido con 馃洜锔?

- NodeJS y Express
- MongoDB

Principalmente se construyeron con las tecnolog铆as anteriores, aunque, cabe mencionar el uso de m煤ltiples dependencias mas.

## Contribuyendo 馃枃锔?

> Las Pull Request son bienvenidas. Para cambios importantes, primero abra un problema para discutir lo que le gustar铆a cambiar.
> Aseg煤rese de actualizar las pruebas seg煤n corresponda.

## Expresiones de Gratitud 馃巵

Si el proyecto te gusto, o te sirvio para aprender nuevas cosas, puedes agradecernos de la siguiente forma:

- Com茅ntale a otros sobre este proyecto 馃摙
- Regala una estrella a este proyecto 猸?
- Da las gracias p煤blicamente 馃.
