// obtenemos el elemento button
var search_btn= document.getElementById('search_btn');
// obtenemos el elemento input
var search= document.getElementById('search');
// obtenemos el elemento select
var search_results= document.getElementById('search_results');
// obtenemos el elemento div que va a contener la ficha del libro
var modal= document.getElementById('modal');
// elemento h2 de la ficha que va a contener el título
var modal_title= document.getElementById('modal_title');
// elemento p de la ficha que va a contener él o los autores
var modal_authors= document.getElementById('modal_authors');
// elemento p de la ficha que va a contener la cantidad de páginas
var modal_pages= document.getElementById('modal_pages');
// elemento p de la ficha que va a contener la sinopsis
var modal_comments= document.getElementById('modal_comments');
// inicialización de la variable con el array de la base de datos
var db_data= [];

// realizamos una solicitud asíncrona del archivo db.json
fetch('db.json')
	.then(response => {
		// retornamos el contenido formateado en json
		return response.json();
	})
	.then(data => {
		// guardamos el contenido en la variable db_data
		db_data= data;
	})

function processString(string) {
	// elemento object que contiene un diccionario con las letras a reemplazar
	let to_replace= {'á': 'a', 'í': 'i', 'é': 'e', 'ó': 'o', 'ú': 'u', 'ü': 'u', 'ñ': 'n'};
	// convertimos la cadena a minúsculas
	string= string.toLowerCase();
	// reemplazamos las letras acentuadas por sus equivalentes sin acento con una expresión regular
	string= string.replace(/[áéíóúüñ]/g, x => to_replace[x]);
	// eliminamos todos los caracteres que no sean letras o números
	string= string.replace(/\s|[^a-z0-9]/g, '');
	return string;
}

// manejador de eventos del elemento input para capturar el valor y la pulsación de la tecla intro
search.addEventListener('keydown', event => {
	// Si se pulsa la tecla intro
	if (event.key === 'Enter') {
		// variable que utilizaremos de contador para no crear listas de más de 250 elementos
		let counter= 0;
		// si el elemento select no está vacío eliminamos el contenido
		if (search_results.length > 0) {
			search_results.innerHTML = '';
		}
		// guardamos la cadena de búsqueda procesada
		var search_term= processString(search.value);
		// iteramos entre todos los elementos del array
		for (var i=0; i<db_data.length; i++) {
			// guardamos la cadena que contiene título y autor ya procesados
			let data= processString(db_data[i].title + db_data[i].authors);
			// si el término de búsqueda está en la cadena con título y autor
			if (data.includes(search_term)) {
				//si el select ya tiene más de 250 elementos detenemos el proceso
				if (counter > 249) break;
				let new_option = document.createElement('option');;
				// creamos el elemento option, le añadimos el título como texto y el id como valor para luego agregarlo al select
				new_option.text= `${db_data[i].title} (${db_data[i].authors})`;
				new_option.value= db_data[i].id;
				search_results.appendChild(new_option)
				// incrementamos el contador
				counter++;
			}
		}
		// si hay elementos en la lista select, la enfocamos y habilitamos el botón para visualizar la ficha
		if (search_results.length > 0) {
			search_results.selectedIndex = 0;
			search_results.focus();
			search_btn.disabled= false;
		}
	}
});

// manejador de eventos para el botón
search_btn.addEventListener('click', () => {
	// guardamos el id del elemento enfocado en la lista a través de su valor
	var x= search_results.value;
	// inicializamos la variable que contendrá la sinopsis
	let sinopsis;
	// añadimos el texto del h2 con el título del libro, el autor, las páginas en los elementos p
	modal_title.innerText= `Título: ${db_data[x].title}`;
	modal_authors.innerText= `Autor: ${db_data[x].authors}`;
	modal_pages.innerText= `Páginas: ${db_data[x].pages}`;
	// obtenemos el nombre del archivo json en el que se encuentra la sinopsis del libro enfocado en el select. Si el id es menor a 1000, el archivo es 0, de lo contrario se divide por mil para obtener el nombre del archivo. Expresión ternaria
	file_name= (db_data[x].id < 1000) ? 0 : Math.floor(x / 1000);
	// solicitud asíncrona del archivo file_name.json
	fetch(`dbs/${file_name}.json`)
		.then(response => {
			// retornamos el contenido en formato json
			return response.json();
		})
		.then(db_comments => {
			// iteramos entre los elementos del array y verificamos la coincidencia del id
			db_comments.forEach(cm => {
				if (cm.id == x) {
					// guardamos el contenido en la variable
					sinopsis= cm.comments;
				};
			});
			// eliminamos todas las etiquetas html, los símbolos de espacio especiales, los caracteres de saltos de línea de la cadena a través de una expresión regular
			sinopsis= sinopsis.replace(/<[^>]*>|\n\n|\xa0/g, '');
			// añadimos la cadena procesada como texto en el elemento p
			modal_comments.innerText= sinopsis;
			// cambiamos el atributo style display para que se visualice el contenido
			modal.style.display= 'block';
		})
});
