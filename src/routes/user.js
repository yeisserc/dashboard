const router = require('express').Router();
const User = require('../models/user');

//---------datatable prueba
router.get('/', async (req, res, next) => {
    res.render('admin/usuarios', { });
});
  
router.get('/datatables-data', async (req, res) => {
    let draw = parseInt(req.query.draw, 10);
    let start = parseInt(req.query.start, 10);
    let length = parseInt(req.query.length, 10);

    if(isNaN(draw) || isNaN(start) || isNaN(length)) {
        return false;
    }

    let recordsTotal = await User.count({});

    let query = {};
    if(req.query.search.value != null && req.query.search.value != "") {
        // query = {
        //   $or: [{cedula: req.query.search.value}, {civ: req.query.search.value}, {nombre: req.query.search.value}]
        // }
        let value = req.query.search.value;
        query = {
        $or: [{name: new RegExp(value, "i")}]
        }
    }
    console.log('query', query);
    let recordsFiltered = await User.count(query);

    let users;
    try {
        users = await User.find( query ).limit(length).skip(start).lean().exec();
        // editedUsers = users.map(function(value, index, array) {
        //   console.log(array[index]);
        //   if(!array[index].local.nombre) {
        //     array[index].local.nombre = "";
        //   }
        //   if(!array[index].local.apellido) {
        //     value.local.apellido = "";
        //   }
        //   if(!array[index].local.id_ciudad) {
        //     array[index].local.id_ciudad = "";
        //   }
        //   return array[index];
        // });
        // users = [
        //   {
        //     local: {
        //       nombre: '',
        //       apellido: '',
        //       id_ciudad: ''
        //     }
        //   }
        // ];
        console.log(users);
    } catch(e) {
        console.log('Ha ocurrido un error', e);
        return res.json({error: 'Ha ocurrido un error'});
    }
    return res.json({data: users, recordsTotal, recordsFiltered});
});

module.exports = router;