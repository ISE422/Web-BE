const { publicDecrypt } = require("crypto");
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const flash = require("connect-flash");
const myRouter = require("./router/main.r.js");
const http = require("http")

const adminRoute = require("./router/admin.r")
const teacherRoute = require("./router/teacher.r")

require('dotenv').config()

const studentRoutes = require("./router/student");


const app = express();
const port = process.env.port || 5000;

//loger
app.use(cookieParser());
// app.use(morgan("combined"));
app.use(express.static(__dirname + "/public"));

//hbs
require("./config/hbs")(app);
require("./config/session")(app);

// parse data post method
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());

// locals
app.use((req, res, next) => {
  res.locals.reportMessage = req.flash("report");
  res.locals.errorMessage = req.flash("error");
  next();
});

app.use("/", myRouter);

app.use(adminRoute)
app.use(teacherRoute)
app.use(studentRoutes);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode | 500;
  res.status(statusCode).send(err.message);
});

const server=http.createServer(app)
server.listen(port, () => console.log(`sever is running at port ${port}`));
