const passport = require('passport')
const localStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')

const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User;

passport.use(new localStrategy({ usernameField: 'email' }, (email, password, done) => {
  return User.findOne({
    attributes: ['id', 'name', 'email', 'password'],
    where: { email },
    raw: true
  })
    .then(user => {
      if (!user) {
        return done(null, false, { message: '帳號或密碼錯誤' })
      }

      return bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) {
            return done(null, false, { message: '帳號或密碼錯誤' })
          }

          return done(null, user)
        })
    })
    .catch(error => {
      error.errorMessage = '登入失敗'
      done(error)
    })
}))

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['email', 'displayName']
}, (accessToken, refreshToken, profile, done) => {
  const { name, email } = profile._json
  return User.findOne({
    attributes: ['id', 'name', 'email'],
    where: { email },
    raw: true
  })
    .then(user => {
      if (user) return done(null, user)
      const randomPassword = Math.random().toString(36).slice(-8)

      return bcrypt.hash(randomPassword, 10)
        .then(hash => User.create({ name, email, password: hash }))
        .then(user => done(null, { id: user.id, email: user.email, name: user.name }))
    })
    .catch(error => {
      error.errorMessage = '登入失敗'
      done(error)
    })
}))

passport.serializeUser((user, done) => {
  const { id, email, name } = user
  done(null, { id, email, name })
})

passport.deserializeUser((user, done) => {
  const id = user.id
  done(null, { id })
})

module.exports = passport