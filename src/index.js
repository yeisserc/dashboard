const path = require('path');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
// const morgan = require('morgan');
// const MongoStore = require('connect-mongo')(session);
require('./models/admin');

const app = express();
const passport = require('passport');
require('./passport');

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/articles', {
//   useMongoClient: true
// }).then(() => console.log('conneted to db'))
mongoose.connect('mongodb://localhost/Users', {
  useMongoClient: true
}).then(() => console.log('conneted to db'))
.catch(err => console.log(err));

// routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');

// setttings
app.set('port', process.env.PORT || 3001);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
// app.use(indexRoutes);
app.get('/', function(req, res) {
  return res.redirect('/user');
});
app.use('/auth', authRoutes);
app.use('/user', passport.authenticationMiddleware, userRoutes);
// app.use('/user', userRoutes);
app.use('/category', passport.authenticationMiddleware, categoryRoutes);
// app.use('/category', categoryRoutes);

// starting the server
// app.listen(app.get('port'), 'juntosporsantafe.com', () => {
app.listen(app.get('port'), 'localhost', () => {
  console.log('server on port', app.get('port'));
});
