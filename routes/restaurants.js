const express = require('express');
const router = express.Router();
const db = require('../models')
const Restaurant = db.Restaurant;

router.get('/', (req, res) => {
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
    .then( restaurants => {
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

router.get('/new', (req, res) => {
  res.render('new')
})

router.get('/:id', (req, res) => {
  const id = req.params.id;

  Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
    .then(restaurant => res.render('show', { restaurant }))
    .catch(err => console.log(err))
})

router.post('/', (req, res) => {
  Restaurant.create(req.body)
    .then(() => {
      req.flash('success', '新增成功!')
      res.redirect('/restaurants')
    })
    .catch(err => console.log(err))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id;
  Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(err => console.log(err))
})

router.put('/:id', (req, res) => {
  const id = req.params.id;
  Restaurant.update(req.body, { where: { id } })
    .then(() => {
      req.flash('success', '修改成功!')
      res.redirect(`/restaurants/${id}`)
    })
    .catch(err => console.log(err))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Restaurant.destroy({ where: { id } })
    .then(() => {
      req.flash('success', '刪除成功!')
      res.redirect('/restaurants')
    })
    .catch(err => console.log(err))
})

module.exports = router;