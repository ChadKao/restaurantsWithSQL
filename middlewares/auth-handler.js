module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.isLoggedIn = true
    return next()
  }

  req.flash('error', '尚未登入')
  res.redirect('/users/login') 
}