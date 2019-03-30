const router = require('express').Router();
const faker  = require('faker');
const Product = require('../models/product');
const Cat = require('../models/categoria');
const User = require('../models/user');
// const sgMail = require('@sendgrid/mail');

//---------HOME
router.get('/', (req, res, next) => {
  res.render('index');
});

//---------PESTAÑA CATEGORIAS
router.get('/add-category', async (req, res) => {
  const cats = await Cat.find();
  res.render('products/add-category', {cats});
});

//---------PESTAÑA ENVIOS
router.get('/envios', async (req, res) => {
  const cats = await Cat.find();
  res.render('products/envios', {cats});
});

//---------Enviar DAtos
router.post('/enviar', async (req,res) => {
  // var cat = req.body.categoria;
  // console.log(cat);
  // switch (cat) {
  //   case 1:
  //     //---------------Email---
  //     sgMail . setApiKey ( process . env . SENDGRID_API_KEY );
  //       const  msg  = {
  //         a : [ ' destinatario1@ejemplo.org ' , ' destinatario2@ejemplo.org ' ],
  //         de :  ' sender@example.org ' ,
  //         Asunto :  ' Hola mundo ' ,
  //         texto :  ' Hola mundo llano! ' ,
  //         html :  ' <p> Hello HTML world! </p> ' ,
  //       };
  //       sgMail . sendMultiple (msg);
  //
  //   break;
  //   case 2: break;
  //   case 3: break;
  //   case 4: break;
  //
  //
  //   case expression:
  //
  //     break;
  //   default:
  //
  // }
  const users = await Product.findById();


})

//---------AGREGAR CATEGORIA A USUARIOS
router.post('/update-user', async (req,res) => {
  var cat= req.body.cat; //categoria seleccionada
  var item=req.body.item; //id usuario
  console.log('llego id item',item);
  // var actual =req.body.current;
  // console.log('page actual',actual);
  var result = await Product.findOneAndUpdate({_id : item}, {$set:{categoria : {nombre : cat} }});
      console.log(result);
});


//---------CARGAR CATEGORIAS EN SELECT
router.post('/cargar-categorias', async(req,res) => {
    const cats = await Cat.find();
    res.json(cats);
});


//--------- AGREGAR NUEVA CATEGORIA
router.post('/add-category', (req, res, next) => {
  const cat = new Cat();
  cat.descripcion = req.body.descripcion;
  cat.nombre = req.body.nombre;
  cat.save((err) => {
    if (err) { throw err; }
    res.redirect('/add-category');
  });
});

//---------OBTENER PAGINA "I"
router.get('/products/:page', (req, res, next) => {
  let perPage = 9;
  let page = req.params.page || 1;

  Product
    .find({}) // finding all documents
    .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
    .limit(perPage) // output just 9 items
    .exec((err, products) => {
      Product.count((err, count) => { // count to calculate the number of pages
        if (err) return next(err);
        res.render('products/products', {
          products,
          current: page,
          pages: Math.ceil(count / perPage)
        });
      });
    });
});


//---------PESTAÑA EDITAR
router.get('/edit/:id', async (req, res, next) => {
  const nuevo = await Cat.findById(req.params.id);
  console.log(nuevo)
  res.render('edit', { nuevo });
});

//---------GUARDAR CAMBIOS DE "ID"
router.post('/edit/:id', async (req, res, next) => {
  const { id } = req.params;
  await Cat.update({_id: id}, req.body);
  res.redirect('/add-category');
});

//---------BORRAR INDICE "ID"
router.get('/delete/:id', async (req, res, next) => {
  let { id } = req.params;
  await Cat.remove({_id: id});
  res.redirect('/add-category');
});

// to generate fake data
router.get('/generate-fake-data', (req, res, next) => {
  for(let i = 0; i < 12; i++) {
    const product = new Product();
    product.category = faker.commerce.department();
    product.name = faker.commerce.productName();
    product.price = faker.commerce.price();
    product.cover = faker.image.image();
    product.save(err => {
      if (err) { return next(err); }
    });
  }
  res.redirect('/add-category');
});

module.exports = router;
