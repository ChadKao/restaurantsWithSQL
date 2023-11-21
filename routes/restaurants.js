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

  const page = parseInt(req.query.page) || 1
  const limit = 6


  Restaurant.findAndCountAll({
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    order: sortOptions[sort],
    offset: (page - 1) * limit,
    limit,
    raw: true
  })
    .then(result => {
      const restaurants = result.rows
      const totalPage = Math.ceil(result.count / limit)      
      const keyword = req.query.keyword?.trim()

      const matchedRestaurants = keyword ? restaurants.filter(restaurant =>
        Object.values(restaurant).some(property => {
          if (typeof property === 'string') {
            return property.toLowerCase().includes(keyword.toLowerCase())
          } else {
            return false
          }
        })) : restaurants

      res.render('index', {
        restaurants: matchedRestaurants,
        keyword,
        prev: page > 1 ? page - 1 : page,
        next: page < totalPage ? page + 1 : page,
        page
      })
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

router.post('/', (req, res, next) => {
  Restaurant.create(req.body)
    .then(() => {
      req.flash('success', '新增成功!')
      res.redirect('/restaurants')
    })
    .catch((error) => {
      error.errorMessage = '新增失敗'
      next(error)
    })
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

router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  Restaurant.update(req.body, { where: { id } })
    .then(() => {
      req.flash('success', '修改成功!')
      res.redirect(`/restaurants/${id}`)
    })
    .catch((error) => {
      error.errorMessage = '修改失敗'
      next(error)
    })
})

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Restaurant.destroy({ where: { id } })
    .then(() => {
      req.flash('success', '刪除成功!')
      res.redirect('/restaurants')
    })
    .catch((error) => {
      error.errorMessage = '刪除失敗'
      next(error)
    })
})

module.exports = router;