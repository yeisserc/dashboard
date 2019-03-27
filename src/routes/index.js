const router = require('express').Router();
const faker  = require('faker');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/add-product', async (req, res) => {
  const products = await Product.find();
  res.render('products/add-product', {products});
});

router.post('/add-product', (req, res, next) => {
  const product = new Product();
  product.category = req.body.descripcion;
  product.name = req.body.nombre;
  product.save((err) => {
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
  const nuevo = await Product.findById(req.params.id);
  console.log(nuevo)
  res.render('edit', { nuevo });
});

router.post('/edit/:id', async (req, res, next) => {
  const { id } = req.params;
  await Product.update({_id: id}, req.body);
  res.redirect('/add-product');
});

router.get('/delete/:id', async (req, res, next) => {
  let { id } = req.params;
  await Product.remove({_id: id});
  res.redirect('/add-product');
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
