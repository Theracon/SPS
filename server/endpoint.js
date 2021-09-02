var mongoose = require("mongoose");

var EndpointSchema = new mongoose.Schema({
  title: String,
  endpoint: String,
  numberOfHits: String,
});

module.exports = mongoose.model("Endpoint", EndpointSchema);
