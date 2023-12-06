var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
app.use(bodyParser.urlencoded({extended: true}));

var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

var path = require('path');
const exphbs = require('express-handlebars');
app.use(express.static(path.join(__dirname, 'public')));


// ----------------------------------------------------------------------------------------------------------------
//	Setting up HBS engine, view engine
// ----------------------------------------------------------------------------------------------------------------

app.engine('.hbs', exphbs.engine({ 
	extname: 'hbs', 
	helpers: {
	  classCheck: function(classCheck) {
		  if(classCheck) { return classCheck; }
		  else { return "Unknown"}
	  }}
  }));

app.set('view engine', 'hbs');


// ----------------------------------------------------------------------------------------------------------------
//	Additional Setup (If Necessary)
// ----------------------------------------------------------------------------------------------------------------
  
//Connecting to the database
mongoose.connect(database.url);

//Setting up the Schema
var RestaurantSchema = require('./models/restaurantdata');
var RestaurantModule = require('./config/restaurantModule');

// ----------------------------------------------------------------------------------------------------------------
//	Routes for web API 
// ----------------------------------------------------------------------------------------------------------------

app.post('/api/restaurants', async function(req, res) {
	try {
	  const data = req.body;
	  const newRestaurant = await RestaurantModule.addNewRestaurant(data);
  
	  console.log("Data Inserted");
	  res.json(newRestaurant); 

	} catch (err) {
	  console.error("ERROR:", err.message);
	  res.status(500).send(err.message);
	}
  });


// need to update with module
app.get('/api/restaurants', function(req, res) {
	const data = req.query;
	
	const findRestaurant = RestaurantModule.getAllRestaurants(data)
		.then(findRestaurant => {
			res.json(findRestaurant);
		})
		.catch(err => {
			res.status(500).send("ERROR:", err.message);
	});
});


app.get('/api/restaurants/:restaurants_id', function(req, res) {

});


app.put('/api/restaurants/:restaurants_id', function(req, res) {

});


app.delete('/api/restaurants/:restaurants_id', function(req, res) {

});



// ----------------------------------------------------------------------------------------------------------------
//	Routes with webpage
// ----------------------------------------------------------------------------------------------------------------


/* 
app.get('/', function(req, res) {
	// Homepage
});


app.post('/addNewRestaurant', function(req, res) {

});


app.get('/getAllRestaurants', function(req, res) {

});


app.get('/getRestaurantById', function(req, res) {

});


app.put('/updateRestaurantById', function(req, res) {

});


app.delete('/deleteRestaurantById', function(req, res) {

});
*/


// ----------------------------------------------------------------------------------------------------------------
//	
// ----------------------------------------------------------------------------------------------------------------

app.listen(port);
console.log("App listening on port : " + port);
