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
var app = express();
const exphbs = require('express-handlebars');
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(database.url);

// Requiring the Schema for the restaurant db
var RestaurantSchema = require('./models/restaurantdata');

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
//	Routes for web API 
// ----------------------------------------------------------------------------------------------------------------


app.post('/api/restaurants', function(req, res) {

});


app.get('/api/restaurants', function(req, res) {
	const page = req.query.page;
	const perPage = req.query.perPage;
	const borough = req.query.borough
	// ...
});


app.get('/api/restaurants/:restaurants_id', function(req, res) {
	
});


app.put('/api/restaurants/:restaurants_id', function(req, res) {

});


app.delete('/api/restaurants/:restaurants_id', function(req, res) {

});


// ----------------------------------------------------------------------------------------------------------------
//	
// ----------------------------------------------------------------------------------------------------------------

app.listen(port);
console.log("App listening on port : " + port);
