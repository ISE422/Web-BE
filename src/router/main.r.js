const { Router } = require('express')
const express = require('express')
const router = express.Router()
const mainC = require('../controllers/main.c')
const { authAdmin, authHaveUser, authRole } = require('../middleware/auth')
const auth = require('../middleware/auth')
const {getClient} = require('../config/postgres')



router.get('/',auth.authHaveUser,mainC.renderHomePage)
router.get('/login',mainC.renderLoginPage)

router.post('/login', mainC.handleLogin)
router.post('/logout',auth.authHaveUser, mainC.handleLogOut)

router.get('/admin', authHaveUser, authRole('admin'), mainC.renderAdminPage)
router.get('/student', authHaveUser, authRole('student'), mainC.renderStudentPage)
router.get('/teacher', authHaveUser, authRole('teacher'), mainC.renderTeacherPage)
// router.get('/notification',authHaveUser, authRole(['teacher','student']), mainC.renderNotiPage)


// code for teachers

router.get('/infomation',  authHaveUser, authRole('teacher'), mainC.renderInfo)
router.post('/infomation',  authHaveUser, authRole('teacher'), mainC.handleUpdateInfo)

router.get('/classes',  authHaveUser, authRole('teacher'), mainC.renderClasses)

router.get('/scores',  authHaveUser, authRole('teacher'), mainC.renderScores)

router.get('/leaderboard',  authHaveUser, authRole('teacher'), mainC.renderLeaderBoard)

router.get('/createreport',  authHaveUser, authRole('teacher'), mainC.renderCreateReport)



// end code for teachers

// code for admin
router.get('/createacc',  authHaveUser, authRole('admin'), 
mainC.renderCreateAcc)

router.get('/createclass',  authHaveUser, authRole('admin'), 
mainC.renderCreateClass)

router.get('/manageteacher',  authHaveUser, authRole('admin'), 
mainC.renderManageTeacher)

router.get('/managestudent',  authHaveUser, authRole('admin'), 
mainC.renderManageStudent)

router.get('/managerule',  authHaveUser, authRole('admin'), 
mainC.renderManageRule)



// end code for admin


// router.get('/test', async (req,res,next)=>{
    
//         var client=await getClient();
//             var rs = await client.query('select * from public.\"uid123\"')
//             console.log(rs)
// } )


module.exports = router;