const express = require('express');
const passport = require('passport');

const User = require('../models/user.model');

const router = new express.Router();

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const secret = req.body.secret;
  User.register({ username, secret }, password, function (err, user) {
    if (err) {
      res.redirect('/register');
    } else {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/');
      });
    }
  });
});

router.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;
