const studentM = require("../models/student");

exports.getInfoStudent = async function (req, res, next) {
  try {
    const un = req.session.uid;
    const info = await studentM.getInfo(un);
    info[0].gioiTinh ? (info[0].ismale = true) : (info[0].isfemale = true);
    res.render("info-student", {
      obj: info[0],
      pageTitle: "Home Student",
    });
  } catch (err) {
    next(err);
  }
};

exports.postInfoStudent = async function (req, res, next) {
  try {
    const obj = req.body;
    obj.genderRad == "Nu" ? (obj.gioiTinh = false) : (obj.gioiTinh = true);

    const uEmail = await studentM.getEmail(obj.Email);
    if (uEmail.length !== 0) {
      req.flash("error", "E-mail exists already !");
      return res.redirect("/student-infomation");
    }
    studentM
      .updateInfo(obj)
      .then((result) => {
        req.flash("report", "You have successfully edited your profile !");
        res.redirect("/student-infomation");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    next(error);
  }
};

exports.getScoresStudent = async function (req, res, next) {
  try {
    res.render("score-student", {
      pageTitle: "Scores Student",
    });
  } catch (error) {
    next(error);
  }
};

exports.getTopStudent = async function (req, res, next) {
  try {
    res.render("leaderboard-student", {
      pageTitle: "Top Student",
    });
  } catch (error) {
    next(error);
  }
};
