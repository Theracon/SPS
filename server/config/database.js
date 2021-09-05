// Dependency
const mongoose = require('mongoose');

// Configure MongoDB
const { MONGODB_URI } = process.env;
mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection
  .once('open', () => console.log('Connection to database successful.'))
  .on('error', (err) => console.log('Error connecting to database: ', err));
