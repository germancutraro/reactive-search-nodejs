const express = require('express'),
      app = express(),
      faker = require('faker'),
      port = process.env.PORT || 3000;

// db
require('./libs/db-connection');

// template engine
app.set('view engine', 'ejs');

// model
const User = require('./models/User');

// main endpoint
app.get('/', (req, res) => {
  User.find({}).then(users => {
    res.render('index', {users});
  }).catch(err => console.log(err));
});

// generate dynamic data
app.get('/generate', (req, res) => {
  for (let i = 0; i < 100; i++) {
    let username = faker.name.findName();
    let img = faker.internet.avatar();
    User.create({name: username, image: img}).then(docs => {
      console.log(docs);
    }).catch(err => console.log(err));
  }
  res.redirect('/');
});

// endpoint used for search users
app.get('/search/:name', (req, res) => {
  let regex = new RegExp(`^${req.params.name}`, 'i');
  let query = { name: regex };
  User.find(query).then(foundUsers => {
    if (foundUsers) res.send(foundUsers); // send the data to the frontend
  }).catch(err => console.log(err));
});

// endpoint for see the user list
app.get('/users', (req, res) => {
  User.find({}).then(users => {
    res.send(users);
  }).catch(err => console.log(err));
});

// get user
app.get('/user/:id', (req, res) => {
  User.findById(req.params.id).then(user => {
    if (user)
      res.render('user', {user});
    else
      res.redirect('/');
  });
});

// 404
app.get('*', (req, res) => {
  res.send('404 status');
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
