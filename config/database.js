/*module.exports = {
    url : "mongodb+srv://dbTrevor:dbPasswordXe3@projectcluster.qqpmklg.mongodb.net/sample_restaurants?retryWrites=true&w=majority"
};*/
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const { MONGO_URI } = process.env;

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
      //useCreateIndex: false,
      //useFindAndModify: false,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};
