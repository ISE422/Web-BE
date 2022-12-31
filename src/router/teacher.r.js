const express = require('express')
const router = express.Router()
// const mainC = require('../controllers/main.c')
const auth = require('../middleware/auth')
const teacherC = require("../controllers/teacher.c")


router.get('/infomation',  auth.authHaveUser, auth.authRole('teacher'), teacherC.renderInfo)
router.post('/infomation',  auth.authHaveUser, auth.authRole('teacher'), teacherC.handleUpdateInfo)

router.get('/classes',  auth.authHaveUser, auth.authRole('teacher'), teacherC.renderClasses)

// router.get('/scores',  auth.authHaveUser, auth.authRole('teacher'), mainC.renderScores)

// router.get('/leaderboard',  auth.authHaveUser, auth.authRole('teacher'), mainC.renderLeaderBoard)

// router.get('/createreport',  auth.authHaveUser, auth.authRole('teacher'), mainC.renderCreateReport)

module.exports=router