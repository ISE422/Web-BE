const mainM = require("../models/main.m");
const CryptoJS = require("crypto-js");

// total char of hash
const hashLength = 64;

module.exports = {
  renderHomePage: (req, res, next) => {
    res.render("home");
  },
  renderLoginPage: (req, res, next) => {
    res.render("login");
  },
  handleLogin: (req, res, next) => {
    try {
      let username = req.body.txtUsername;
      let password = req.body.txtPassword;
      let passwordHash = CryptoJS.SHA3(password, {
        outputLength: hashLength * 4,
      }).toString(CryptoJS.enc.Hex);

      let findUserInDB = mainM.getUserByUserName(username);

      if (findUserInDB) {
        // right password handle
        if (findUserInDB.password == password) {
          req.session.regenerate((err) => {
            if (err) next(err);
            req.session.uid = findUserInDB.username;
            req.session.save((err) => {
              if (err) next(err);
              res.cookie("username", username, {
                maxAge: 900000,
                httpOnly: true,
              });
              res.cookie("password", password, {
                maxAge: 900000,
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
    } catch (err) {
      next(err);
    }
  },
  handleLogOut: (req, res, next) => {
    console.log("session: ", req.session);
    delete req.session.uid;
    console.log("sessionafter : ", req.session);
    res.redirect("/");
  },
};
