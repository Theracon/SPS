const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const Endpoint = require('./endpoint');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../client/build')));

// Configure app to use express-session
app.use(
  session({ secret: 'wonders', resave: false, saveUninitialized: false })
);

// Configure app to use body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB Configuration
const { MONGODB_URI } = process.env;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get('/api', (req, res) => {
  res.status(200).send({
    title: 'SPS API',
    endpoint: '/api',
    numberOfHits: '1000+',
  });
});

app.get('/api/endpoints', (req, res) => {
  Endpoint.find({}, (err, endpoints) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(endpoints);
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.post('/api/:numberOfHits', (req, res) => {
  if (!req.body.endpoint) {
    res.status(418).send({
      message: 'Null or invalid endpoint.',
    });
  }
  const endpointObject = new Endpoint({
    title: 'SPS API 1.0',
    endpoint: req.body.endpoint,
    numberOfHits: req.params.numberOfHits,
  });
  endpointObject.save((err, endpoint) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(endpoint);
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log(`SPS server breathing on http://localhost:${process.env.PORT}`);
});
