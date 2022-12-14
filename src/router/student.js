const { Router } = require("express");
const express = require("express");
const router = express.Router();
const student = require("../controllers/student");
const { authAdmin, authHaveUser, authRole } = require("../middleware/auth");
const auth = require("../middleware/auth");

router.get(
  "/student-infomation",
  authHaveUser,
  authRole("student"),
  student.getInfoStudent
);

router.get(
  "/student-scores",
  authHaveUser,
  authRole("student"),
  student.getScoresStudent
);

router.get(
  "/edit-student-infomation",
  authHaveUser,
  authRole("student"),
  student.getEditInfoStudent
);

router.get(
  "/student-leaderboard",
  authHaveUser,
  authRole("student"),
  student.getTopStudent
);

// router.get("/test", student.test);

router.post("/edit-student-infomation", student.postInfoStudent);

router.post("/student-scores", student.postScoresStudent);

router.post("/student-leaderboard", student.postTopStudent);

module.exports = router;
