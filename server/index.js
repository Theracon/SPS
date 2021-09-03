const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
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

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(process.env.PORT, () => {
  console.log(`SPS server breathing on http://localhost:${process.env.PORT}`);
});
