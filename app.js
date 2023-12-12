var express  = require('express');
var mongoose = require('mongoose');
const app = express();
//var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
app.use(bodyParser.urlencoded({extended: true}));
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require("dotenv").config();

app.use(express.json());

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
	defaultLayout: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
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
//mongoose.connect(database.url);

//Setting up the Schema
var RestaurantModule = require('./config/restaurantModule');
const RestaurantSchema = require('./models/restaurantdata');
const User = require("./models/user");
const auth = require("./middleware/auth");



// ----------------------------------------------------------------------------------------------------------------
//	Login / Register
// ----------------------------------------------------------------------------------------------------------------


app.get('/login', async (req, res) => {
	res.render('login', {title: "Login"});
});
app.post('/login', async (req, res) => {
	try {
		// Get user input
		const { email, password } = req.body;
	
		// Validate user input
		if (!(email && password)) {
		  res.status(400).send("All input is required");
		}
		// Validate if user exist in our database
		const user = await User.findOne({ email });
	
		if (user && (await bcrypt.compare(password, user.password))) {
		  // Create token
		  const token = jwt.sign(
			{ user_id: user._id, email },
			process.env.TOKEN_KEY,
			{
			  expiresIn: "2h",
			}
		  );
	
		  // save user token
		  user.token = token;
	
		  // user
		  res.status(200).json(user);
		}
		res.status(400).send("Invalid Credentials");
	  } catch (err) {
		console.log(err);
	  }
});



app.get('/register', async (req, res) => {
	res.render('register', {title: "Register"});
});
app.post('/register', async (req, res) => {
	try {
		// Get user input
		const { first_name, last_name, email, password } = req.body;
	
		// Validate user input
		if (!(email && password && first_name && last_name)) {
		  res.status(400).send("All input is required");
		}
	
		// check if user already exist
		// Validate if user exist in our database
		const oldUser = await User.findOne({ email });
	
		if (oldUser) {
		  return res.status(409).send("User Already Exist. Please Login");
		}
	
		//Encrypt user password
		encryptedPassword = await bcrypt.hash(password, 10);
	
		// Create user in our database
		const user = await User.create({
		  first_name,
		  last_name,
		  email: email.toLowerCase(), // sanitize: convert email to lowercase
		  password: encryptedPassword,
		});
	
		// Create token
		const token = jwt.sign(
		  { user_id: user._id, email },
		  process.env.TOKEN_KEY,
		  {
			expiresIn: "2h",
		  }
		);
		// save user token
		user.token = token;
	
		// return new user
		res.status(201).json(user);
	  } catch (err) {
		console.log(err);
	  }
	  // Our register logic ends here
});




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


app.get('/api/restaurants/:res_id', function(req, res) {
	const data = req.params.res_id;
	
	const findRestaurant = RestaurantModule.getRestaurantById(data)
		.then(findRestaurant => {
			res.json(findRestaurant);
		})
		.catch(err => {
			res.status(500).send("ERROR:", err.message);
	});
});


app.put('/api/restaurants/:res_id', function(req, res) {
	const id = req.params.res_id;
	const data = req.body;

	const updateRestaurant = RestaurantModule.getRestaurantById(id, data)
		.then(updateRestaurant => {
			res.json(updateRestaurant);
		})
		.catch(err => {
			res.status(500).send("ERROR:", err.message);
	});
});


app.delete('/api/restaurants/:res_id', function(req, res) {
	try {
		const data = req.params.res_id;
		RestaurantModule.deleteRestaurantById(data);
	
		res.send("Data Deleted", data);
  
	  } catch (err) {
		console.error("ERROR:", err.message);
		res.status(500).send(err.message);
	  }
});

// ----------------------------------------------------------------------------------------------------------------
//	Routes with webpage	//res.render('index', { title: 'Homepage' });
// ----------------------------------------------------------------------------------------------------------------


app.get('/', async(req, res) => {
	return res.status(200).render('index', { title: 'Homepage' });
});



app.get('/addNewRestaurant', function(req, res) {
	res.render('addNewRestaurant', {title: "addNewRestaurant"});
});
app.post('/addNewRestaurant', function(req, res) {
	const newRestaurant = new RestaurantSchema({
		address: {
			building: req.body.buildingField,
			coord: {
				type: [parseFloat(req.body.latField), parseFloat(req.body.longField)]
			},
			street: req.body.streetField,
			zipcode: req.body.zipField,
		},
		borough: req.body.boroughField,
		cuisine: req.body.cuisineField,
		grades: [{
			date: req.body.dateField,
			grade: req.body.gradeField,
			score: parseInt(req.body.scoreField)
		}],
		name: req.body.nameField,
		restaurant_id: parseInt(req.body.idField)
	})

	const output = RestaurantModule.addNewRestaurant(newRestaurant)
		.then(output => {
			res.render('output', {title: "addNewRestaurant", header: "Result of addNewRestaurant:", data: output});
		})
		.catch(err => {
			console.log(err);
			res.render('output', {title: "addNewRestaurant", header: "Result of addNewRestaurant:", data: null});
	});
});



app.get('/getAllRestaurants', function(req, res) {
	res.render('getAllRestaurants', {title: "getAllRestaurants"});
});
app.post('/getAllRestaurants', function(req, res) {
	var data = {
		page: req.body.pageField,
		perPage: req.body.perpageField,
		borough: req.body.boroughField
	}

	const findRestaurant = RestaurantModule.getAllRestaurants(data)
		.then(findRestaurant => {
			res.render('output', {title: "getAllRestaurants", header: "Result of getAllRestaurants:", data: findRestaurant});
		})
		.catch(err => {
			res.render('output', {title: "getAllRestaurants", header: "Result of getAllRestaurants:", data: null});
			//res.status(500).send("ERROR:", err.message);
	});
});
app.get('/getAllRestaurants/:page/:perPage/:borough?', async (req, res) => {
	var data = {
		page: parseInt(req.params.page),
		perPage: parseInt(req.params.perPage),
		borough: req.params.borough
	}
	const findRestaurant = RestaurantModule.getAllRestaurants(data)
		.then(findRestaurant => {
			res.render('output', {title: "getAllRestaurants", header: "Result of getAllRestaurants:", data: findRestaurant});
		})
		.catch(err => {
			res.render('output', {title: "getAllRestaurants", header: "Result of getAllRestaurants:", data: null});
			//res.status(500).send("ERROR:", err.message);
	});
});



app.get('/getRestaurantById', function(req, res) {
	res.render('getRestaurantById', {title: "getRestaurantById"});
});
app.post('/getRestaurantById', function(req, res) {
	var id = req.body.idField;
	
	const findRestaurant = RestaurantModule.getRestaurantById(id)
		.then(findRestaurant => {
			res.render('output', {title: "getRestaurantById", header: "Result of getRestaurantById:", data: findRestaurant});
		})
		.catch(err => {
			res.render('output', {title: "getRestaurantById", header: "Result of getRestaurantById:", data: null});
			//res.status(500).send("ERROR:", err.message);
	});
});



app.get('/updateRestaurantById', function(req, res) {
	res.render('updateRestaurantById', {title: "updateRestaurantById"});
});
app.post('/updateRestaurantById', function(req, res) {
	var id = req.body._idField;
	const newRestaurant = new RestaurantSchema({
		address: {
			building: req.body.buildingField,
			coord: {
				type: [parseFloat(req.body.latField), parseFloat(req.body.longField)]
			},
			street: req.body.streetField,
			zipcode: req.body.zipField,
		},
		borough: req.body.boroughField,
		cuisine: req.body.cuisineField,
		grades: [{
			date: req.body.dateField,
			grade: req.body.gradeField,
			score: parseInt(req.body.scoreField)
		}],
		name: req.body.nameField,
		restaurant_id: parseInt(req.body.idField)
	})
	const output = RestaurantModule.updateRestaurantById(id, newRestaurant)
		.then(output => {
			res.render('output', {title: "updateRestaurantById", header: ("Updated Restaurant with id: " + id), data: null});
		})
		.catch(err => {
			console.log(err);
			res.render('output', {title: "updateRestaurantById", header: "Error with updateRestaurantById:", data: null});
	});
});



app.get('/deleteRestaurantById', function(req, res) {
	res.render('deleteRestaurantById', {title: "deleteRestaurantById"});
});
app.post('/deleteRestaurantById', function(req, res) {
	var id = req.body.idField;

	const findRestaurant = RestaurantModule.getRestaurantById(id)
		.then(findRestaurant => {
			try {
				RestaurantModule.deleteRestaurantById(id);
			}
			catch {
				res.render('output', {title: "deleteRestaurantById", header: "Error for deleteRestaurantById:", data: null});
			}
			res.render('output', {title: "deleteRestaurantById", header: ("Deleted Data for ID: "+ id), data: findRestaurant});
		})
		.catch(err => {
			res.render('output', {title: "deleteRestaurantById", header: "Error for deleteRestaurantById:", data: null});
			//res.status(500).send("ERROR:", err.message);
	});
});



app.get('/restaurantGrades', function(req, res) {
	res.render('restaurantGrades', {title: "restaurantGrades"});
});
app.post('/restaurantGrades', function(req, res) {
		var id = req.body.idField;

		const restaurant = RestaurantModule.getRestaurantById(id)
		.then(restaurant => {
			const grades = restaurant && restaurant.grades ? restaurant.grades : [];
			const averageScore = grades.length > 0 ? grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length : 0;
			if(!averageScore) {
				res.render('restaurantGrades', {title: "restaurantGrades", header: "There are no scores for this ID", averageScore: null, data: null});
			}
			res.render('restaurantGrades', {title: "restaurantGrades", header: "Result for restaurantGrades:", averageScore: averageScore, data: restaurant});
		})
		.catch(err => {
			res.render('restaurantGrades', {title: "restaurantGrades", header: "Error for restaurantGrades:", data: null});
			//res.status(500).send("ERROR:", err.message);
	});
});

// ----------------------------------------------------------------------------------------------------------------
//	export app (for index)
// ----------------------------------------------------------------------------------------------------------------

module.exports = app;