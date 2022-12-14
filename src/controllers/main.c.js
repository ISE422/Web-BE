const mainM = require("../models/main.m");
const CryptoJS = require("crypto-js");

// total char of hash
const hashLength = 64;

module.exports = {
  renderHomePage: (req, res, next) => {
    let admin = false,
      student = false,
      teacher = false;

    switch (req.session.role) {
      case 'admin':
        admin=true
        break;
      case 'teacher':
        teacher=true
        break;
      case 'student':
        student=true
        break;

      default:
        break;
    }

    res.render("home", {
      role: req.session.role,
      showNav: true,
      admin: admin,
      student: student,
      teacher: teacher
    });
  },
  renderLoginPage: (req, res, next) => {
    res.render("login");
  },

  renderAdminPage: (req, res, next) => {
    res.render("info", {
      content: req.session.role,
      username: req.session.uid,
      showNav: true,
    });
  },

  renderStudentPage: (req, res, next) => {
    res.render("info", {
      content: req.session.role,
      username: req.session.uid,
      showNav: true,
    });
  },

  renderTeacherPage: (req, res, next) => {
    res.render("info", {
      username: req.session.uid,
      content: req.session.role,
      showNav: true,
    });
  },

  renderNotiPage: (req, res, next) => {
    res.render("noti", {
      showNav: true,
    });
  },

  renderAddAccount: (req, res, next) => {
    res.render("admin/add.hbs", {
      showNav: true,
      showSide: true,
    });
  },

  handleLogin: (req, res, next) => {
    try {
      console.log(req.body);
      let username = req.body.username;
      let password = req.body.password;
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
  renderInfo: (req, res, next) => {
    try{
      let info = mainM.getInfoByID()
      console.log(info);
      info.gender=='Nu'? info.ismale=false:info.isfemale=false
      if(info){
        res.render('info',{
          obj: info,
          teacher: true
        })
      }
    }catch(err){
      next(err)
    }
  },

  handleUpdateInfo: (req, res, next) => {
    let newInfo = req.body
    console.log("newInfo ", newInfo);
    
    let user = mainM.getInfoByID();
    // let user
    if(user){
      let update = mainM.updateInfoByID()
      res.render('info',{
        obj: update,
        showNav: true,
        teacher: true
      })
    }else{
      res.redirect('/infomation',{
      })
    }
    
  },

  renderClasses: (req, res, next) => {
    try{
        res.render('classes',{
        teacher: true

        })
    }catch(err){
      next(err)
    }
  },

  renderScores: (req, res, next) => {
    try{
        res.render('scores',{
        teacher: true

        })
    }catch(err){
      next(err)
    }
  },
  renderLeaderBoard: (req, res, next) => {
    try{
        res.render('leaderboard',{
        teacher: true

        })
    }catch(err){
      next(err)
    }
  },
  renderCreateReport: (req, res, next) => {
    try{
        res.render('report',{
        teacher: true

        })
    }catch(err){
      next(err)
    }
  },
};
