const express = require('express');
const app = express();
const port = 3000;
const db = require('./models')
const Restaurant = db.Restaurant;

app.get('/', (req, res) => {
  res.redirect('/restaurants')
});

app.get('/restaurants', (req, res) => {
  Restaurant.findAll()
    .then(restaurants => {
      res.send({ restaurants })
    })
    .catch(err => console.log(err))
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id;
  res.send(`restaurants/${id}`)
})

app.get('/restaurants/new', (req, res) => {
  res.send('restaurants/new')
})
  
app.post('/restaurants', (req, res) => {
  res.send('new restaurants')
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id;
  res.send(`restaurants/${id}/edit`)
})

app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id;
  res.send(`restaurants/${id}`)
})


app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id;
  res.send(`restaurants/${id}deleted`)
})




app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});

