# Biblioteca epub

Esta web pretende crear un buscador de libros de la biblioteca utopía solo de forma estadística, sin proporcionar enlaces de descarga.

La base de datos se gestiona a través de archivos json pensado en webs estáticas, de lo contrario el mejor flujo de trabajo es con bases de datos gestionados en el back-end

## Organización de las bases de datos

El archivo db.json contiene más de 161000 elementos, y las claves de cada elemento son:

* id: identificador que representa el número de órden 
* title: Título del libro
* authors: Autor o autores del libro
* pages: Cantidad de páginas

En la carpeta dbs se encuentran otras bases de datos que alojan 1000 elementos cada una, y las claves son:

* id: El mismo identificador que el de la db.json
* comments: Sinópsis del libro

Está separado de esta forma para que se cargue por completo el archivo db.json el cual no tiene un gran tamaño, y que luego, al solicitarse la carga de los datos se cargue el archivo de las sinopsis y no los más de 150 mb del archivo original completo.

En los comentarios del código se explican las funcionalidades aplicadas en las búsquedas.