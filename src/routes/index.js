const router = require('express').Router();
const faker  = require('faker');
const Product = require('../models/product');
const Cat = require('../models/categoria');
const User = require('../models/user');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/add-category', async (req, res) => {
  const cats = await Cat.find();
  res.render('products/add-category', {cats});
});

router.post('/update-user', (req,res) => {
  var cat= req.body.cat; //categoria seleccionada
  console.log(cat);
  var miArray = [ 2, 4, 6, 8, 10 ];
  miArray.forEach( function(valor, indice, array) {
    console.log("En el índice " + indice + " hay este valor: " + valor);
  });
  // for(let i=0; i<length; i++)
  // User.findOneAndUpdate({_id: valor}, {$set:{'categoria[]': cat }},function(err, doc){
  //   if(err){
  //       console.log("Error al cargar los datos!");
  //   } else {
           // res.json('los datos se agregaron correctemente');
  // }});
});

router.post('/cargar-categorias', async(req,res) => {
    const cats = await Cat.find();
    res.json(cats);
});

router.post('/add-category', (req, res, next) => {
  const cat = new Cat();
  cat.descripcion = req.body.descripcion;
  cat.nombre = req.body.nombre;
  cat.save((err) => {
    if (err) { throw err; }
    res.redirect('/add-category');
  });
});

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

router.get('/edit/:id', async (req, res, next) => {
  const nuevo = await Cat.findById(req.params.id);
  console.log(nuevo)
  res.render('edit', { nuevo });
});

router.post('/edit/:id', async (req, res, next) => {
  const { id } = req.params;
  await Cat.update({_id: id}, req.body);
  res.redirect('/add-category');
});

router.get('/delete/:id', async (req, res, next) => {
  let { id } = req.params;
  await Cat.remove({_id: id});
  res.redirect('/add-category');
});

// to generate fake data
router.get('/generate-fake-data', (req, res, next) => {
  for(let i = 0; i < 90; i++) {
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
