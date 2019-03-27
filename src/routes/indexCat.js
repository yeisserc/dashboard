const router = require('express').Router();
const faker  = require('faker');
const Cat = require('../models/categoria');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/add-product', async (req, res, next) => {
  const categorias = await Cat.find();
  res.render('products/add-product',{categorias});
});

router.post('/add-categoria', (req, res, next) => {
  const nuevo = new Cat();
  nuevo.nombre = req.body.nombre;
  nuevo.descripcion = req.body.descripcion;

  nuevo.save((err) => {
    if (err) { throw err; }
    res.redirect('/add-product');
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
  const task = await Task.findById(req.params.id);
  console.log(task)
  res.render('edit', { task });
});

router.post('/edit/:id', async (req, res, next) => {
  const { id } = req.params;
  await Task.update({_id: id}, req.body);
  res.redirect('/');
});

router.get('/delete/:id', async (req, res, next) => {
  let { id } = req.params;
  await Task.remove({_id: id});
  res.redirect('/');
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
  res.redirect('/add-product');
});

module.exports = router;
