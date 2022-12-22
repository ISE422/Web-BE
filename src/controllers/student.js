const studentM = require("../models/student");

exports.getInfoStudent = async function (req, res, next) {
  try {
    let info = await studentM.getInfo();
    // info.gender == "Nu" ? (info.ismale = false) : (info.isfemale = false);
    info.gender == "Nu" ? (info.isfemale = true) : (info.ismale = true);
    res.render("info-student", {
      obj: info,
      pageTitle: "Home Student",
    });
  } catch (err) {
    next(err);
  }
};

exports.postInfoStudent = async function (req, res, next) {
  try {
    const obj = req.body;
    // console.log(obj);
    // let updateInfo = await studentM.updateInfo(obj);
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
