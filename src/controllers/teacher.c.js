const studentM = require("../models/student");
const teacherM = require("../models/teacher");

exports.getScores = async function (req, res, next) {
  const uid = req.session.uid;

  const infoClass = await teacherM.getInfoClass(uid);
  const subject = infoClass[0].tenMH;

  let scores = req.session.postArrScoreStudents;
  if (!scores) {
    scores = null;
  } else {
    let i = 1;

    scores.map((info) => {
      info.rank = i;
      i++;
    });
  }

  res.render("scores", {
    pageTitle: "Score-Students",
    infoClass: infoClass,
    subjects: subject,
    idSubjects: infoClass[0].maMH,
    scores: scores,
  });
};

exports.postScores = async function (req, res, next) {
  const info = req.body;

  const tamp = await teacherM.getScoreStudents(info);
  // console.log(postArrScoreStudents);
  req.session.postArrScoreStudents = tamp;

  res.redirect("/scores");
};

exports.postEditScoreStudent = async function (req, res, next) {
  const info = req.body;
  teacherM
    .updateScoreStudent(info)
    .then((result) => {
      req.flash("report", "You have successfully update score-student !");
      res.redirect("/scores");
    })
    .catch((err) => {
      console.log(err);
    });
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
    res.render("leaderboard", {
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
  // Điểm tổng kết theo năm
  if (info.subjects == "all" && info.semester == "Cả năm học") {
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
  } else if (info.subjects == "all" && info.semester != "Cả năm học") {
    // Điểm tổng kết theo năm và theo học kì
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
  } else if (info.subjects != "all" && info.semester != "Cả năm học") {
    // Điểm theo môn học theo từng học kỳ
    topRank = await studentM.getTopRankSubSemesterYear(info);
    topRank.map((obj) => {
      obj.diem = obj.DiemTKMON;
      obj.info = info;
      arrS.push(obj);
    });
  } else {
    // Điểm theo môn học theo cả năm
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
  // Sắp xếp theo thứ tự giảm dần
  arrS.sort((a, b) => b.diem - a.diem);
  // Limit ranking
  const rankingArr = arrS.slice(0, Number(info.limit));

  req.session.topRanks = rankingArr;
  res.redirect("/leaderboard");
};
