// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
RestaurantsSchema = new Schema({
    address: {
        building : String,
        coord: 
        {
            type: [Number]
        },
        street :  String,
        zipcode : String,
    },
    borough : String,
    cuisine : String,
    grades: {
        date : Date,
        grade : String,
        score : Number
    },
    name : String,
    restaurant_id : Number
});
const Restaurants = mongoose.model('restaurants', RestaurantsSchema);
module.exports = Restaurants;