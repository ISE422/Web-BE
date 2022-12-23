const studentM = require("../models/student");

exports.getInfoStudent = async function (req, res, next) {
  try {
    const un = req.session.uid;
    const info = await studentM.getInfo(un);
    info.rows[0].gioiTinh
      ? (info.rows[0].isfemale = true)
      : (info.rows[0].ismale = true);
    res.render("info-student", {
      obj: info.rows[0],
      pageTitle: "Home Student",
    });
  } catch (err) {
    next(err);
  }
};

exports.postInfoStudent = async function (req, res, next) {
  try {
    const obj = req.body;
    obj.genderRad == "Nu" ? (obj.gioiTinh = true) : (obj.gioiTinh = false);

    const uEmail = await studentM.getEmail(obj.Email);
    if (uEmail.rows.length !== 0) {
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
