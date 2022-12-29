const { publicDecrypt } = require("crypto");
const express = require("express");
const cookieParser = require('cookie-parser');
const morgan = require("morgan");
const path = require("path");
const myRouter = require("./router/main.r.js");
const adminRoute = require("./router/admin.r")

require('dotenv').config()

const app = express();
const port = process.env.port|| 5000;

//loger
app.use(cookieParser());
// app.use(morgan("combined"));
app.use(express.static(__dirname+'/public'));


//hbs
require("./config/hbs")(app)
require("./config/session")(app)


// parse data post method
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", myRouter);
app.use(adminRoute)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode | 500;
  res.status(statusCode).send(err.message);
});

app.listen(port, () => console.log(`sever is running at port ${port}`));
