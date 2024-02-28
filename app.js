const express = require('express');
const app = express();
const port = 3000;
const { engine } = require('express-handlebars');
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const messageHandler = require('./middlewares/message-handler');
const router = require('./routes');
const errorHandler = require('./middlewares/error-handler');
const handlebars = require('handlebars')

handlebars.registerHelper('eq', (arg1, arg2) => {
  return arg1 === arg2
})

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
console.log(process.env.SESSION_SECRET)
console.log(process.env)


const passport = require('./config/passport')

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(messageHandler)
app.use(router)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});

