const mainM = require("../models/main.m");
const CryptoJS = require("crypto-js");

// total char of hash
const hashLength = 64;

module.exports = {
  renderHomePage: (req, res, next) => {
    const role = req.session.role;

    switch (role) {
      case "teacher":
        res.redirect("/infomation");
        break;
      case "student":
        res.redirect("/student-infomation");
        break;
      default:
        res.redirect("/admin");
        break;
    }
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
    res.render("info-student", {
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
    try {
      let info = mainM.getInfoByID();
      console.log(info);
      info.gender == "Nu" ? (info.ismale = false) : (info.isfemale = false);
      if (info) {
        res.render("info", {
          obj: info,
          teacher: true,
        });
      }
    } catch (err) {
      next(err);
    }
  },

  handleUpdateInfo: (req, res, next) => {
    let newInfo = req.body;
    console.log("newInfo ", newInfo);

    let user = mainM.getInfoByID();
    // let user
    if (user) {
      let update = mainM.updateInfoByID();
      res.render("info", {
        obj: update,
        showNav: true,
        teacher: true,
      });
    } else {
      res.redirect("/infomation", {});
    }
  },

  renderClasses: (req, res, next) => {
    let obj = [];
    let classes = ["10_1", "10_2", "10_3"];
    if (req.query.class) {
      console.log("have query");
      console.log("classes:::", req.query);
      let arr = [1, 2, 3];
      for (item in arr) {
        let temp = {};
        temp.no = item;
        temp.name = "Nguyen van a";
        temp.gender = "nam";
        temp.dob = "01/01/2002";
        temp.address = "hcm";
        obj.push(temp);
      }
    }
    try {
      res.render("classes", {
        teacher: true,
        list: obj,
        classes: classes,
      });
    } catch (err) {
      next(err);
    }
  },

  renderScores: (req, res, next) => {
    let years = ["2020", "2021", "2022"];
    let scores = [];
    let arr = [1, 2, 3, 4, 5, 6];
    if (req.query.semester && req.query.year) {
      for (item in arr) {
        let temp = {};
        temp.sub = "Toan";
        temp.sem = req.query.semester;
        temp.score_15 = 10;
        temp.score_45 = 9.5;
        temp.score_final = 8.3;
        temp.average = Number(
          ((temp.score_15 + temp.score_45 + temp.score_final) / 3).toFixed(1)
        );

        scores.push(temp);
      }
    }
    console.log("scores:::", req.query);
    try {
      res.render("scores", {
        teacher: true,
        years: years,
        scores: scores,
      });
    } catch (err) {
      next(err);
    }
  },
  renderLeaderBoard: (req, res, next) => {
    console.log("leader:::", req.query);

    let data = [];
    let arr = [1, 2, 3, 4, 5, 6];

    if (req.query.subjects) {
      for (item in arr) {
        let temp = {};
        temp.name = "nguyen van a";
        temp.gpa = 9.4;
        temp.ranking = 1;
        temp.grade = req.query.grade;
        temp.semester = req.query.semester;
        temp.year = req.query.year;
        data.push(temp);
      }
    }
    let years = ["2020", "2021", "2022"];
    try {
      res.render("leaderboard", {
        teacher: true,
        years: years,
        data: data,
      });
    } catch (err) {
      next(err);
    }
  },
  renderCreateReport: (req, res, next) => {
    console.log("report:::", req.query);

    let years = ["2020", "2021", "2022"];

    let data = [];
    let arr = [1, 2, 3, 4, 5, 6];
    let table1 = false;
    let table2 = false;

    if (req.query.report) {
      switch (req.query.report) {
        case "bcmh":
          for (item in arr) {
            let temp = {};
            temp.no = item;
            temp.class = "10_1";
            temp.totalstudents = 40;
            temp.passed = 32;
            temp.rate = Number(
              ((temp.passed * 100) / temp.totalstudents).toFixed(1)
            );
            data.push(temp);
          }
          table1 = true;
          break;
        case "bchk":
          for (item in arr) {
            let temp = {};
            temp.no = item;
            temp.class = "10_1";
            temp.sub = req.query.subjects;
            temp.totalstudents = 40;
            temp.passed = 32;
            temp.rate = Number(
              ((temp.passed * 100) / temp.totalstudents).toFixed(1)
            );
            data.push(temp);
          }
          table2 = true;
          break;
      }
    }

    try {
      res.render("report", {
        teacher: true,
        years: years,
        data: data,
        table1: table1,
        table2: table2,
      });
    } catch (err) {
      next(err);
    }
  },
};
