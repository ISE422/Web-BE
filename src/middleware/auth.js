const { pgp, db } = require("../config/postgres");

module.exports = {
  authHaveUser: async (req, res, next) => {
    if (req.session.uid) {
      next();
    } else {
      console.log(req.cookies);
      res.render("login", {
        c_username: req.cookies.username,
        c_password: req.cookies.password,
        content: "You need to login",
      });
    }
  },
  authAdmin: (req, res, next) => {
    if (req.session.isAdmin == 1) {
      next();
    } else {
      res.redirect('/')
    }
  },
};
