const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var multer = require('multer');



app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded
app.use(express.static('public'));

// Route Imports
const product = require("./routes/product");
const user = require("./routes/user");
const order = require("./routes/order");

app.use("/api", product);
app.use("/api", user);
app.use("/api", order);





module.exports = app;
