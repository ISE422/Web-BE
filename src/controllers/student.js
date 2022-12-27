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
      editing: false,
    });
  } catch (err) {
    next(err);
  }
};

exports.getEditInfoStudent = async function (req, res, next) {
  try {
    const editting = req.query.edit;
    if (!editting) {
      return res.redirect("/student-infomation");
    }
    const un = req.session.uid;
    const info = await studentM.getInfo(un);
    info.rows[0].gioiTinh
      ? (info.rows[0].isfemale = true)
      : (info.rows[0].ismale = true);
    res.render("info-student", {
      obj: info.rows[0],
      pageTitle: "Home Student",
      editing: true,
    });
  } catch (err) {
    next(err);
  }
};

exports.postInfoStudent = async function (req, res, next) {
  try {
    const obj = req.body;
    const un = req.session.uid;
    obj.genderRad == "Nu" ? (obj.gioiTinh = true) : (obj.gioiTinh = false);

    const uEmail = await studentM.getEmail(obj.Email, un);
    if (uEmail.rows.length !== 0) {
      req.flash("error", "E-mail exists already !");
      return res.redirect("/edit-student-infomation?edit=true");
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
  let scores = req.session.scores;

  if (!scores) {
    scores = null;
  } else {
    scores.map((info) => {
      info.diemtk = ((info.diem15 + info.diem45 + info.diemHK) / 3).toFixed(1);
    });
  }
  try {
    res.render("score-student", {
      pageTitle: "Scores Student",
      scoresArr: scores,
    });
  } catch (error) {
    next(error);
  }
};

exports.postScoresStudent = async function (req, res, next) {
  const info = req.body;
  const un = req.session.uid;
  if (info.semester == "all") {
    let hkArr = [];
    const maHKNHS = await studentM.getMaHKNHS(info.year);
    maHKNHS.rows.map((info) => {
      hkArr.push(info.maHKNH);
    });
    const scores = await studentM.getScoresYear(un, hkArr);
    req.session.scores = scores.rows;
  } else {
    const maHKNH = await studentM.getMaHKNH(info);
    const scores = await studentM.getScores(un, maHKNH.rows[0].maHKNH);

    req.session.scores = scores.rows;
  }
  res.redirect("/student-scores");
};

exports.getTopStudent = async function (req, res, next) {
  let topRanks = req.session.topRanks;
  if (!topRanks) {
    topRanks = null;
  } else {
    let i = 1;

    topRanks.map((info) => {
      info.rank = i;
      i++;
    });
  }

  try {
    res.render("leaderboard-student", {
      pageTitle: "Top Student",
      topRanksArr: topRanks,
    });
  } catch (error) {
    next(error);
  }
};

exports.postTopStudent = async function (req, res, next) {
  const info = req.body;
  let topRank;
  let arrS = [];
  if (info.subjects == "all" && info.semester == "Hoc ki 1") {
    topRank = await studentM.getTopRankAllSemester1Year(info);
    topRank.map((obj) => {
      obj.diem = obj.DiemTongKetHocKy1;
      obj.info = info;
      arrS.push(obj);
    });
  }
  if (info.subjects == "all" && info.semester == "Hoc ki 2") {
    topRank = await studentM.getTopRankAllSemester2Year(info);
    topRank.map((obj) => {
      obj.diem = obj.DiemTongKetHocKy2;
      obj.info = info;
      arrS.push(obj);
    });
  }
  if (info.subjects == "all" && info.semester == "Cả năm học") {
    topRank = await studentM.getTopRankAllYear(info);
    topRank.map((obj) => {
      obj.diem = obj.DiemTongKetNamHoc;
      obj.info = info;
      arrS.push(obj);
    });
  }
  topRank = await studentM.getTopRankSubSemesterYear(info);
  topRank.map((obj) => {
    obj.diem = obj.DiemTKMON;
    obj.info = info;
    arrS.push(obj);
  });
  req.session.topRanks = arrS;
  res.redirect("/student-leaderboard");
};
