const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoriaSchema = new Schema({
  nombre: String,
  descripcion: String
});

module.exports = mongoose.model('Categoria', CategoriaSchema);
