const studentM = require("../models/student");

exports.getInfoStudent = async function (req, res, next) {
  try {
    const un = req.session.uid;
    const info = await studentM.getInfo(un);

    info[0].gioiTinh
      ? (info[0].isfemale = true)
      : (info[0].ismale = true);
    res.render("info-student", {
      obj: info[0],
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
    info[0].gioiTinh
      ? (info[0].isfemale = true)
      : (info[0].ismale = true);
    res.render("info-student", {
      obj: info[0],
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
    if (uEmail.length !== 0) {
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
    maHKNHS.map((info) => {
      hkArr.push(info.maHKNH);
    });
    const scores = await studentM.getScoresYear(un, hkArr);
    req.session.scores = scores;
  } else {
    const maHKNH = await studentM.getMaHKNH(info);

    const scores = await studentM.getScores(un, maHKNH[0].maHKNH);

    req.session.scores = scores;
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
  let tamp = 0;
  // ??i???m t???ng k???t theo n??m
  if (info.subjects == "all" && info.semester == "C??? n??m h???c") {
    topRank = await studentM.getTopRankYear(info);
    let diem;
    topRank.map((obj) => {
      if (tamp == 0) {
        diem = 0;
      }
      diem += obj.DiemTKMON;
      tamp++;
      if (tamp == 18) {
        obj.diem = (diem / 18).toFixed(1);
        obj.info = info;
        arrS.push(obj);
        tamp = 0;
      }
    });
  } else if (info.subjects == "all" && info.semester != "C??? n??m h???c") {
    // ??i???m t???ng k???t theo n??m v?? theo h???c k??
    topRank = await studentM.getTopRankSemesterYear(info);
    let diem;
    topRank.map((obj) => {
      if (tamp == 0) {
        diem = 0;
      }
      diem += obj.DiemTKMON;
      tamp++;
      if (tamp == 9) {
        obj.diem = (diem / 9).toFixed(1);
        obj.info = info;
        arrS.push(obj);
        tamp = 0;
      }
    });
  } else if (info.subjects != "all" && info.semester != "C??? n??m h???c") {
    // ??i???m theo m??n h???c theo t???ng h???c k???
    topRank = await studentM.getTopRankSubSemesterYear(info);
    topRank.map((obj) => {
      obj.diem = obj.DiemTKMON;
      obj.info = info;
      arrS.push(obj);
    });
  } else {
    // ??i???m theo m??n h???c theo c??? n??m
    topRank = await studentM.getTopRankSubYear(info);
    let diem;
    topRank.map((obj) => {
      if (tamp == 0) {
        diem = 0;
      }
      diem += obj.DiemTKMON;
      tamp++;
      if (tamp == 2) {
        obj.diem = (diem / 2).toFixed(1);
        obj.info = info;
        arrS.push(obj);
        tamp = 0;
      }
    });
  }
  // S???p x???p theo th??? t??? gi???m d???n
  arrS.sort((a, b) => b.diem - a.diem);
  // Limit ranking
  const rankingArr = arrS.slice(0, Number(info.limit));

  req.session.topRanks = rankingArr;
  res.redirect("/student-leaderboard");
};
