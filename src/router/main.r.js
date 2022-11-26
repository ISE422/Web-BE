
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
router.get('/notification',authHaveUser, authRole(['teacher','student']), mainC.renderNotiPage)


router.get('/addacc', authHaveUser, authRole('admin'), mainC.renderAddAccount)




// router.get('/test', async (req,res,next)=>{
    
//         var client=await getClient();
//             var rs = await client.query('select * from public.\"uid123\"')
//             console.log(rs)
// } )


module.exports = router;

