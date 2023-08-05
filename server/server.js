const app = require("./app");
const connectDatabase = require("./db");
const cloudinary = require("cloudinary");

//Handling uncaught exceptions;
process.on("uncaughtException", (error) => {
  console.log(`Error: ${error.message}`);
  console.log("shutting down the server for handing uncaught exception");
});

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "./config/.env" });
}

//connect database;
connectDatabase();

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`Server is running on port http://localhost/${port}`);
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
