const mainM = require("../models/main.m");
const bcrypt = require("bcrypt")
const saltRounds = 10;
const loginM=require("../models/login.m")

module.exports = {
  renderHomePage: (req, res, next) => {

    console.log(req.session);
    switch (req.session.role) {
      case 'admin':
        res.redirect("/createacc")
        break;
      case 'teacher':
        res.redirect("/infomation")
        break;
      case 'student':
        res.redirect("/student-infomation")
      default:
        res.redirect("/login")
        break;
    }
    

  },
  renderLoginPage: (req, res, next) => {

    let error = ""
    let hasErr = false

    if(req.session.error!="")
    {
        error=req.session.error
        req.session.error=""
        hasErr=true
    }

    res.render("login",{
      error: error,
      hasError: hasErr,
    });
  },

  handleLogin: async(req, res, next) => {
    try {
      console.log(req.body);
      let username = req.body.username;
      let password = req.body.password;
      
      let pwhash = await bcrypt.hash(password, saltRounds);
      console.log(pwhash);
      let userInDB = await loginM.getAccByUsername(username)

      if(userInDB.length==0){
        req.session.error="Invalid username, try again!!!"
        res.redirect("/login")
      }

      userInDB=userInDB[0]
      console.log(userInDB[0]);
      let cmp = bcrypt.compare(password,userInDB.password)
      console.log(cmp);
      if(!cmp){
        req.session.error="Wrong password, try again!!!"
        res.redirect("/login")
      }

      switch (userInDB.type) {
        case 1:
          userInDB.role="admin"
          break;
        case 2:
          userInDB.role="teacher"
          break;
        case 3:
          userInDB.role="student"
          break;
      }

      req.session.regenerate((err) => {
        if (err) next(err);
        req.session.uid = userInDB.username;
        req.session.role = userInDB.role;
        req.session.save((err) => {
          if (err) next(err);
          res.cookie("username", username, {
            maxAge: 5 * 60 * 1000,
            httpOnly: true,
          });
          res.cookie("password", password, {
            maxAge: 5 * 60 * 1000,
            httpOnly: true,
          });
          res.redirect("/");
        });
      });
    } catch (err) {
      next(err);
    }
  },
  handleLogOut: (req, res, next) => {
    console.log("session: ", req.session);
    delete req.session.uid;
    delete req.session.role;
    console.log("sessionafter : ", req.session);
    res.redirect("/");
  },
 

  
};
