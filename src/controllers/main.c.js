const mainM = require("../models/main.m");
const CryptoJS = require("crypto-js");

// total char of hash
const hashLength = 64;

module.exports = {
  renderHomePage: (req, res, next) => {
    res.render("home",{
      role: req.session.role,
      showNav: true,
      showSide: true
    });
  },
  renderLoginPage: (req, res, next) => {
    res.render("login");
  },

  renderAdminPage: (req, res, next) => {
    res.render("info",{
      
      content: req.session.role,
      username: req.session.uid,
      showNav: true

    });
  },

  renderStudentPage: (req, res, next) => {
    res.render("info",{
      content: req.session.role,
      username: req.session.uid,
      showNav: true

    });
  },

  renderTeacherPage: (req, res, next) => {
    res.render("info",{
      username: req.session.uid,
      content: req.session.role,
      showNav: true

    });
  },

  renderNotiPage: (req, res, next) => {
    res.render("noti",{
      showNav: true
    });
  },

  renderAddAccount: (req, res, next) => {
    res.render("admin/add.hbs",{
      showNav: true,
      showSide: true
    });
  },



  handleLogin: (req, res, next) => {
    try {

      let username = req.body.txtUsername;
      let password = req.body.txtPassword;
      let passwordHash = CryptoJS.SHA3(password, {
        outputLength: hashLength * 4,
      }).toString(CryptoJS.enc.Hex);

      //find user in database
      let findUserInDB = mainM.getUserByUserName(username);
      //end find user in database

      //handle user
      if (findUserInDB) {
        // right password handle
        if (findUserInDB.password == password) {
          req.session.regenerate((err) => {
            if (err) next(err);
            req.session.uid = findUserInDB.username;
            req.session.role = findUserInDB.role;
            req.session.save((err) => {
              if (err) next(err);
              res.cookie("username", username, {
                maxAge: 5*60*1000,
                httpOnly: true,
              });
              res.cookie("password", password, {
                maxAge: 5*60*1000,
                httpOnly: true,
              });
              res.redirect("/");
            });
          });
        } else {
          res.render("login", {
            notice: "wrong password, try again",
          });
        }
      } else {
        res.render("login", {
          notice: "invalid username, try again",
        });
      }
      // end handle user
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
