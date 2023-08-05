const express = require("express");
const ErrorHandler = require("./middlewares/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use("/", express.static("uploads"));

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "./config/.env" });
}

const user = require("./controllers/user");
const shop = require("./controllers/shop");
const product = require("./controllers/product");
const order = require("./controllers/order");

app.use("/api/v1/user", user);
app.use("/api/v1/shop", shop);
app.use("/api/v1/product", product);
app.use("/api/v1/order", order);

app.use(ErrorHandler);
module.exports = app;
