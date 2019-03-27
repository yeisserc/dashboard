// Modelo Usuario para la base de datos

// Mongoose es una libreria de Node que nos permite
// conectarnos a una base de datos MongoDB y modelar un esquema
// para ella.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Campos que vamos a guardar en la base de datos
var UserSchema = new Schema({
	local : {
	dni					: String,
	nombre			: String, // Nombre del usuario
	apellido 		: String,
	sexo 				: String,
	email 			: String,
	id_ciudad 	: String,
	celular 		: String,
	fijo 				: String
	},
	facebook: {
		id			 : String,
		email		 : String,
		nombre	 : String,
		apellido : String,
		dni			 : String,
		token 	 : String
	},
	twitter : {
		token 	: String,
		secret  : String,
	},
	categoria : [{nombre: String}],
	CheckWhatsapp : Boolean,
	createdAt	  : {type: Date, default: Date.now} // Fecha de creación
});

// Exportamos el modelo 'User' para usarlo en otras
// partes de la aplicación
var User = mongoose.model('User', UserSchema);

module.exports = User
