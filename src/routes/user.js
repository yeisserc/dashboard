const router = require('express').Router();
const { check, validationResult } = require('express-validator/check');

const User = require('../models/user');
const Categoria = require('../models/categoria');
const Ciudade = require('../models/ciudade');

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
            $or: [
                {'local.nombre': new RegExp(value, "i")},
                {'facebook.nombre': new RegExp(value, "i")},
                {'local.apellido': new RegExp(value, "i")},
                {'facebook.apellido': new RegExp(value, "i")}
            ]
        }
    }
    // console.log('query', query);
    let recordsFiltered = await User.count(query);

    let users;
    let usersNormalized = [];
    try {
        users = await User.find( query ).limit(length).skip(start).populate('cats', 'nombre').exec();
        // console.log(users);
        for(let i = 0; i < users.length; i++) {
            let obj = [];
            obj.push(users[i]._id);
            if(users[i].local.nombre) {
                obj.push(users[i].local.nombre);
                obj.push(users[i].local.apellido);
                // obj.push(users[i].local.id_ciudad);
            } else {
                obj.push(users[i].facebook.nombre);
                obj.push(users[i].facebook.apellido);
                // obj.push("");
            }
            if(users[i].local.id_ciudad) {
                let ciudad = await Ciudade.findOne({ id: users[i].local.id_ciudad });
                obj.push(ciudad.nombre);
            } else {
                obj.push("");
            }
            
            obj.push(users[i].cats || "");
            obj.push(users[i].active);
            usersNormalized.push(obj);
        }

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
        // console.log(usersNormalized);
    } catch(e) {
        console.log('Ha ocurrido un error', e);
        return res.json({error: 'Ha ocurrido un error'});
    }
    return res.json({data: usersNormalized, recordsTotal, recordsFiltered});
});

router.post('/addCategory', [
    check('categoria')
      .not().isEmpty().withMessage('Por favor complete este campo')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    // console.log('ids', req.body.ids);
    // User.find({ '_id': { $in: req.body.ids } }).then(
    //     (list) => {
    //         console.log(list);
    //         return res.json({result: "OK"});
    //     }
    // );

    // let cat = await Categoria.findById(req.body.categoria);
    // console.log('cat', cat);

    let query = {};

    if(!req.body.selectAll) {
        query['_id'] = { $in: req.body.ids };
    }

    User.updateMany(query, { $addToSet:{cats: req.body.categoria} } ).then(
        () => {
            return res.json({result: "OK"});
        }, err => {
            return res.status(500).json({result: "FAIL"});
        }
    );
});

router.post('/desactivateUser',  [
    check('_id')
        .not().isEmpty().withMessage('Por favor complete este campo')
], async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let user = await User.findById(req.body._id);
    user.active = false;
    user.save().then(
        () => {
            return res.json({result: "OK"});
        }, err => {
            return res.status(500).json({result: "FAIL"});
        }
    );
});

module.exports = router;