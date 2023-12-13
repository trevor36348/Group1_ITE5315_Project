const RestaurantSchema = require('../models/restaurantdata');

module.exports = {
    addNewRestaurant: async function(body) {
        const restaurant = await RestaurantSchema.create({
            address: {
                building: body.address.building,
                coord: body.address.coord,
                street: body.address.street,
                zipcode: body.address.zipcode,
            },
            borough: body.borough,
            cuisine: body.cuisine,
            grades: body.grades,
            name: body.name,
            restaurant_id: body.restaurant_id,
        });
        return restaurant;
    },

    getAllRestaurants: async function(query) {
        const page = query.page || 1;
	    const perPage = query.perPage || 10;
	    const borough = query.borough;

        var check = null;
        if(borough) { check = {borough} }

        const skip = (perPage * (page - 1));
        
        const restaurant = await RestaurantSchema.find(check).skip(skip).limit(perPage);

        return restaurant;
    },
    
    getRestaurantById: async function(id) {
        return RestaurantSchema.findById(id);
    },

    updateRestaurantById: async function(id, body) {
        const restaurant = await RestaurantSchema.updateOne({ _id: id }, {
            address: {
                building: body.address.building,
                coord: body.address.coord,
                street: body.address.street,
                zipcode: body.address.zipcode,
            },
            borough: body.borough,
            cuisine: body.cuisine,
            grades: body.grades,
            name: body.name,
            restaurant_id: body.restaurant_id,
        });
        return restaurant;
    },

    deleteRestaurantById: async function(id) {
        return RestaurantSchema.deleteOne( { _id: id } );
    }
}