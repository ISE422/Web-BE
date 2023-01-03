
const express = require("express");
const router = express.Router();
const mainC = require("../controllers/main.c");
const teacher = require("../controllers/teacher.c");
const auth = require("../middleware/auth");
const teacherC = require("../controllers/teacher.c")




// Hung
router.get('/infomation',  auth.authHaveUser, auth.authRole('teacher'), teacherC.renderInfo)
router.post('/infomation',  auth.authHaveUser, auth.authRole('teacher'), teacherC.handleUpdateInfo)

router.get('/classes',  auth.authHaveUser, auth.authRole('teacher'), teacherC.renderClasses)

// Khanh
router.post("/leaderboard", teacher.postTopStudent);

router.post("/scores", teacher.postScores);

router.post("/edit-score-student", teacher.postEditScoreStudent);

router.post("/createreport", teacher.postCreateReport);

// router.get('/createreport',  auth.authHaveUser, auth.authRole('teacher'), teacher.renderCreateReport)

router.get(
  "/scores",
  auth.authHaveUser,
  auth.authRole("teacher"),
  teacher.getScores
);

router.get(
  "/leaderboard",
  auth.authHaveUser,
  auth.authRole("teacher"),
  teacher.getTopStudent
);

router.get(
  "/createreport",
  auth.authHaveUser,
  auth.authRole("teacher"),
  teacher.getCreateReport
);

module.exports = router;
