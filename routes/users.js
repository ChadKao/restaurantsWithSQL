const express = require('express');
const router = express.Router();

const db = require('../models')
const User = db.User;
const passport = require('passport')
const bcrypt = require('bcryptjs')


router.get('/', (req, res) => { res.redirect('/users/login') });

router.get('/register', (req, res) => { res.render('register') });;

router.post('/register', (req, res, next) => {
  const { name, email, password, 'confirm-password': confirmPassword } = req.body

  if (!email || !password || !confirmPassword) {
    req.flash('error', 'email和密碼都是必填')
    return res.redirect('back')
  }

  if (password !== confirmPassword) {
    req.flash('error', '密碼與驗證密碼不相符')
    return res.redirect('back')
  }

  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        req.flash('error', '信箱已被註冊')
        return res.redirect('back')
      }
      bcrypt.hash(password, 10)
        .then(hash => {
          return User.create({ name, email, password: hash })
        })
        .then((user) => {
          if (!user) {
            req.flash('error', '註冊失敗')
            return res.redirect('back')
          }
          req.flash('success', '註冊成功')
          res.redirect('/users/login')
        })
        .catch(error => {
          error.errorMessage = '註冊失敗'
          next(error)
        })
    })
    .catch(error => {
      next(error)
    })
})

router.get('/login', (req, res) => { res.render('login') });;

router.post('/login', passport.authenticate('local', {
  successRedirect: '/restaurants',
  failureRedirect: '/users/login',
  failureFlash: true
}));

router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }))

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/restaurants',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.post('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) { return next(error) }
    req.flash('success', '登出成功')
    res.redirect('/users/login')
  })
});

module.exports = router;