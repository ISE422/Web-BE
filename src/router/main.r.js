const { Router } = require('express')
const express = require('express')
const router = express.Router()
const mainC = require('../controllers/main.c')
const { authAdmin } = require('../middleware/auth')
const auth = require('../middleware/auth')
const {getClient} = require('../config/postgres')


router.get('/',mainC.renderHome)
router.post('/test', async (req,res,next)=>{
    
        var client=await getClient();
            var rs = await client.query('select * from public.\"uid123\"')
            console.log(rs)
} )


module.exports = router;