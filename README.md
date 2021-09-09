# SallEvent Clone

Sitio web (backend) donde se pueden reservar un salón de eventos con diferentes servicios

# Comenzando 🚀

Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas.

### Pre-requisitos 📋

- NodeJS versión 10.16 o superior
- NPM versión 5.6 o superior

Como requisitos previos, se debe contar con 4 colecciones creadas manualmente, a continuación se mostraran
tomando en cuenta el uso de un SGBD de mongodb local:

```
  db.directions.insert({"street" : "Benito Juarez", "state" : "Oaxaca", "municipality" : "Santo Domingo de Morelos", "suburb" : "12"})
```
```
  db.schedules.insert({"sunday" : "Y", "monday" : "Y", "tuesday" : "N", "wednesday" : "N", "thursday" : "N", "friday" : "Y", "saturday" : "Y"})
```
```
  db.inforooms.insert({"idDirection" : [ ObjectId("_aquí id directions_") ], "idSchedule" : [ ObjectId("aquí id schedules") ],})
```
```
  db.room.insert({"idInfo" : [ ObjectId("_aquí id inforooms_") ], "name" : "SallEvent", "capacity" : 1000, "description" : "Salon de Santo Domingo de Morelos", "priceHour" : 100})
```

### Instalación (desarrollo) 🔧

Antes de ejecutar debes crear un archivo _.env_ y declarar 2 variables de entorno, que son:
- STRING_CONNECTION, que deberá tener la API de conexión a mongoDB
- WORD_SECRET, la palabra secreta con la que se firmara el token
- ID_ROOM, la id del salón

Les recomiendo no compartir estos datos

Tal vez suene muy obvio pero primero clone el repositorio

```
    git clone https://github.com/EleomarPL/grade-control-backend
```

Instale las dependencias. Las depedencias ya se encuentran implicitas en el Package del proyecto, solo basta ejecutar la siguiente instrucción:

```
    npm i
```

Ejecute el proyecto mediante el script (no se detectan cambios):

```
    npm start
```

También puedes ejecutar el código de la siguiente forma, que es la recomendable para el desarrollo, pues detecta los cambios que ejecutes al refrescar (hot reload), y es mediante el script:

```
    npm run start-dev
```

## Construido con 🛠️

- NodeJS y Express
- MongoDB

Principalmente se construyeron con las tecnologías anteriores, aunque, cabe mencionar el uso de múltiples dependencias mas.

## Contribuyendo 🖇️

> Las Pull Request son bienvenidas. Para cambios importantes, primero abra un problema para discutir lo que le gustaría cambiar.
> Asegúrese de actualizar las pruebas según corresponda.

## Expresiones de Gratitud 🎁

Si el proyecto te gusto, o te sirvio para aprender nuevas cosas, puedes agradecernos de la siguiente forma:

- Coméntale a otros sobre este proyecto 📢
- Regala una estrella a este proyecto ⭐
- Da las gracias públicamente 🤓.
