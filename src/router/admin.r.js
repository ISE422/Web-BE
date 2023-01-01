const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const mainC = require('../controllers/admin.c')

// code for admin
router.get('/createacc',  auth.authHaveUser, auth.authRole('admin'), 
mainC.renderCreateAcc)
router.post("/createacc", auth.authHaveUser, auth.authRole('admin'),
mainC.handleCreateAcc)

router.get('/createclass',  auth.authHaveUser, auth.authRole('admin'), 
mainC.renderCreateClass)
router.post("/createclass", auth.authHaveUser, auth.authRole('admin'),
mainC.handleCreateClass)

router.get('/manageteacher',  auth.authHaveUser, auth.authRole('admin'), 
mainC.renderManageTeacher)
router.post('/manageteacher',  auth.authHaveUser, auth.authRole('admin'), 
mainC.handleTeacher)

router.get('/managestudent',  auth.authHaveUser, auth.authRole('admin'), 
mainC.renderManageStudent)
router.post('/managestudent',  auth.authHaveUser, auth.authRole('admin'), 
mainC.handleStudent)

router.get('/managerule',  auth.authHaveUser, auth.authRole('admin'), 
mainC.renderManageRule)
router.post('/managerule',  auth.authHaveUser, auth.authRole('admin'), 
mainC.handleRule)



// end code for admin


module.exports = router;
