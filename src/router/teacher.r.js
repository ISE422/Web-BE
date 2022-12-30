const express = require("express");
const router = express.Router();
const mainC = require("../controllers/main.c");
const teacher = require("../controllers/teacher.c");
const auth = require("../middleware/auth");

router.get(
  "/infomation",
  auth.authHaveUser,
  auth.authRole("teacher"),
  mainC.renderInfo
);
router.post(
  "/infomation",
  auth.authHaveUser,
  auth.authRole("teacher"),
  mainC.handleUpdateInfo
);

router.get(
  "/classes",
  auth.authHaveUser,
  auth.authRole("teacher"),
  mainC.renderClasses
);

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

router.post("/leaderboard", teacher.postTopStudent);

router.post("/scores", teacher.postScores);

router.post("/edit-score-student", teacher.postEditScoreStudent);

// router.get('/createreport',  auth.authHaveUser, auth.authRole('teacher'), teacher.renderCreateReport)

module.exports = router;
