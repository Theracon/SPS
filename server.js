// Dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');

// Use dotenv to save environment variables
require('dotenv').config();

// MongoDB connection
require('./server/config/database');

// Configure app
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.static(path.resolve(__dirname, './client/build')));
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);
app.use(
  session({ secret: 'wonders', resave: false, saveUninitialized: false })
);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(morgan('dev'));

// Set up admin and user routes
app.use('/auth/signup', require('./server/routes/auth/signup'));
app.use('/auth/login', require('./server/routes/auth/login'));
app.use('/auth/logout', require('./server/routes/auth/logout'));
app.use('/admin/products', require('./server/routes/api/admin'));
app.use('/api', require('./server/routes/api/common'));

// Configure app to use static react templates in the 'build' folder
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

// Listener
app.listen(process.env.PORT, () => {
  console.log(`Goodies server alive on http://localhost:${process.env.PORT}`);
});
