// Modelo Usuario para la base de datos

// Mongoose es una libreria de Node que nos permite
// conectarnos a una base de datos MongoDB y modelar un esquema
// para ella.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Campos que vamos a guardar en la base de datos
var AdminSchema = new Schema({
	email: String,
	password: String
});

// Exportamos el modelo 'User' para usarlo en otras
// partes de la aplicación
var Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;