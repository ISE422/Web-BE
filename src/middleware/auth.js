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
  authRole: roles =>{
    return (req,res,next)=>{
      if(!roles.includes(req.session.role)){
        return res.status(401).end('You dont have permisstion!!')
      }else{
        next()
      }
    }
  }
};
