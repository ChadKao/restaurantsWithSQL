const express = require('express');
const app = express();
const port = 3000;
const db = require('./models')
const Restaurant = db.Restaurant;
const { engine } = require('express-handlebars');
const methodOverride = require('method-override')


app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


app.get('/', (req, res) => {
  res.redirect('/restaurants')
});

app.get('/restaurants', (req, res) => {
  const sort = req.query.sort 

  const sortOptions = {
    ASC: [['name', 'ASC']],
    DESC: [['name', 'DESC']],
    category: [['category', 'ASC']],
    location: [['location', 'ASC']],
    rating_DESC: [['rating', 'DESC']],
    rating_ASC: [['rating', 'ASC']],
  };



  Restaurant.findAll({
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    order: sortOptions[sort],
    raw: true
  })
    .then(restaurants => {
      const keyword = req.query.keyword?.trim()
      const matchedRestaurants = keyword ? restaurants.filter(restaurant =>
        Object.values(restaurant).some(property => {
          if (typeof property === 'string') {
            return property.toLowerCase().includes(keyword.toLowerCase())
          } else {
            return false
          }
        })) : restaurants
      res.render('index', { restaurants: matchedRestaurants, keyword })
    })
    .catch(err => console.log(err))
})

app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id;

  Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
    .then(restaurant => res.render('show', { restaurant }))
    .catch(err => console.log(err))
})

app.post('/restaurants', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id;
  Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(err => console.log(err))
})

app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id;
  Restaurant.update(req.body, { where: { id } })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(err => console.log(err))
  })

app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id;
  Restaurant.destroy({ where: { id } })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});

