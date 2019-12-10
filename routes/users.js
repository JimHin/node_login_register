const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Chargement du modèle user
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Page de connexion
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Page d'enregistrement
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Requête d'enregistrement
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  //Vérification des champs vides
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Veuillez saisir tous les champs' });
  }

  if (password != password2) {
    errors.push({ msg: 'Les mots de passe ne correspondent pas' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Le mot de passe doit contenir au moins 6 caractères' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Cet email est déjà utilisé' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'Vous êtes maintenant enregistré et vous pouvez vous connecter'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
