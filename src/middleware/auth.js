const { pgp, db } = require("../config/postgres");

module.exports = {
  authHaveUser: async (req, res, next) => {
    if (req.session.uid) {
      next();
    } else {
      console.log("message: ", req.message);
      res.redirect('/login')
    }
  },
};
