const { Router } = require("express");
const express = require("express");
const router = express.Router();
const student = require("../controllers/student");
const { authAdmin, authHaveUser, authRole } = require("../middleware/auth");
const auth = require("../middleware/auth");
const { getClient } = require("../config/postgres");

router.get(
  "/student-infomation",
  authHaveUser,
  authRole("student"),
  student.getInfoStudent
);

router.post("/edit-student-infomation", student.postInfoStudent);

router.get(
  "/student-scores",
  authHaveUser,
  authRole("student"),
  student.getScoresStudent
);

router.get(
  "/student-leaderboard",
  authHaveUser,
  authRole("student"),
  student.getTopStudent
);

module.exports = router;
