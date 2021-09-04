// Dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

// Use dotenv to save environment variables
require('dotenv').config();

// MongoDB connection
require('./config/database');

// Configure app
const app = express();
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(
  session({ secret: 'wonders', resave: false, saveUninitialized: false })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set up admin and user routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/users', require('./routes/user'));

// Configure app to use static react templates in the 'build' folder
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Listener
app.listen(process.env.PORT, () => {
  console.log(
    `Goodies server is alive on http://localhost:${process.env.PORT}`
  );
});
