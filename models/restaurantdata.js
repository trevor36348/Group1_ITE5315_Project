// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
RestaurantsSchema = new Schema({
    
});
const Restaurants = mongoose.model('restaurants', RestaurantsSchema);
module.exports = Restaurants;