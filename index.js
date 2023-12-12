const http = require("http");
const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();

// Import and execute database connection logic
const database = require("./config/database");
(async () => {
  try {
    await database.connect();
    console.log("Connected to the database");

    const server = http.createServer(app);
    const { API_PORT } = process.env;
    const port = process.env.PORT || API_PORT;

    // Start the server
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
})();
