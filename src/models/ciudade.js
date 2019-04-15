const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CiudadeSchema = new Schema({
  id: String,
  nombre: String
});

module.exports = mongoose.model('Ciudade', CiudadeSchema);
