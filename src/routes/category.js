const router = require('express').Router();
const Categoria = require('../models/categoria');
const { check, validationResult } = require('express-validator/check');

//---------datatable prueba
router.get('/', async (req, res, next) => {
    res.render('admin/categorias', { });
});
  
router.get('/datatables-data', async (req, res) => {
    let draw = parseInt(req.query.draw, 10);
    let start = parseInt(req.query.start, 10);
    let length = parseInt(req.query.length, 10);

    if(isNaN(draw) || isNaN(start) || isNaN(length)) {
        return false;
    }

    let recordsTotal = await Categoria.count({});

    let query = {};
    if(req.query.search.value != null && req.query.search.value != "") {
        let value = req.query.search.value;
        query = {
        $or: [{nombre: new RegExp(value, "i")}, {descripcion: new RegExp(value, "i")}]
        }
    }
    console.log('query', query);
    let recordsFiltered = await Categoria.count(query);

    let categorias;
    try {
        categorias = await Categoria.find( query ).limit(length).skip(start).lean().exec();
    } catch(e) {
        return res.json({error: 'Ha ocurrido un error'});
    }
    return res.json({data: categorias, recordsTotal, recordsFiltered});
});

router.post('/newCategory', [
    check('nombre')
      .not().isEmpty().withMessage('Por favor complete este campo')
      .custom((value) => {
        return Categoria.findOne({nombre: value}).exec().then(
          (categoria) => {
            if(categoria) {
              return Promise.reject('Ya existe una categoria con este nombre');
            }
          }
        );
      }),
    check('descripcion')
      .not().isEmpty().withMessage('Por favor complete este campo')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const cat = new Categoria();
    cat.descripcion = req.body.descripcion;
    cat.nombre = req.body.nombre;
    cat.save().then(
        () => {
            return res.json({result: "OK"});
        }, err => {
            return res.status(500).json({result: "FAIL"});
        }
    );
});

router.post('/editCategory',  [
    check('nombre')
        .not().isEmpty().withMessage('Por favor complete este campo'),
    check('descripcion')
        .not().isEmpty().withMessage('Por favor complete este campo'),
    check('_id')
        .not().isEmpty().withMessage('Por favor complete este campo')
], async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    Categoria.update({
        _id: req.body._id
    }, {
        $set: { 
        "descripcion": req.body.descripcion
        }
    }, function (err, category) {
        if (err) return res.status(500).json({result: "FAIL"});
        return res.json({result: "OK"});
    });
});

router.post('/deleteCategory',  [
    check('_id')
        .not().isEmpty().withMessage('Por favor complete este campo')
], async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    Categoria.deleteOne({ _id: req.body._id}, function (err) {
        if (err) return res.status(500).json({result: "FAIL"});
        return res.json({result: "OK"});
    });
});

module.exports = router;