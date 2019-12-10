const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// Configuration du passport
require('./config/passport')(passport);

// Configuration de la base de donnée
const db = require('./config/keys').mongoURI;

// Connexion à MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Middleware EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Middleware Express body parser
app.use(express.urlencoded({ extended: true }));

// Middleware Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Middleware passport
app.use(passport.initialize());
app.use(passport.session());

// Connexion flash
app.use(flash());

//Variables globales
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
