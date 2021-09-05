// Dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const morgan = require('morgan');

// Use dotenv to save environment variables
require('dotenv').config();

// MongoDB connection
require('./server/config/database');

// Configure app
const app = express();
app.use(express.json());
app.use(express.static(path.resolve(__dirname, './client/build')));
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(
  session({ secret: 'wonders', resave: false, saveUninitialized: false })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Set up admin and user routes
app.use('/auth/users', require('./server/routes/auth/user'));
app.use('/auth/admin', require('./server/routes/auth/admin'));
app.use('/api/admin/:id', require('./server/routes/api/admin'));
app.use('/api/:id', require('./server/routes/api/common'));

// Configure app to use static react templates in the 'build' folder
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

// Listener
app.listen(process.env.PORT, () => {
  console.log(`Goodies server alive on http://localhost:${process.env.PORT}`);
});
