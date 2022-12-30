
const express = require('express')
const router = express.Router()
const mainC = require('../controllers/main.c')
const auth = require('../middleware/auth')



router.get('/',auth.authHaveUser,mainC.renderHomePage)
router.get('/login',mainC.renderLoginPage)
router.post('/login', mainC.handleLogin)
router.post('/logout',auth.authHaveUser, mainC.handleLogOut)




module.exports = router;
