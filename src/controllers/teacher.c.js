
const adminM = require("../models/admin.m")
const teacherM = require("../models/teacher.m")



module.exports={
    renderInfo: async (req, res, next) => {

        try{
        let error = ""
        let hasErr = false

        if(req.session.error!="")
        {
            error=req.session.error
            req.session.error=""
            hasErr=true
        }

        let hasMess = false
        let mess = ""

        if(req.session.message!="")
        {
            mess=req.session.message
            req.session.message=""
            hasMess=true
        }

        console.log(req.session);

        let info = await adminM.findByName("GiaoVien", "maGV", req.session.uid)
        console.log(info);
        
        res.render("info",{
            error: error,
            hasError: hasErr,
            hasMess: hasMess,
            mess: mess,
            info: info[0]
        })

        }catch(err){
            next(err)
        }
      },
    
      handleUpdateInfo: async(req, res, next) => {
        try {
            console.log(req.body);

            data={}
            data.maGV=req.body.teacherid
            data.fullname=req.body.fullname
            data.genderRad=req.body.genderRad
            data.email=req.body.email
            data.birthday=req.body.birthday
            data.address=req.body.address

            let updateTeacher = await teacherM.updateInfoGiaoVien(data)
            req.session.message = "UPDATED !!!"
            res.redirect("/infomation")

        } catch (error) {
            next(error)
        }
      },

      renderClasses: async(req,res,next)=>{
        try {
            console.log(req.query);

            let error = ""
            let hasErr = false
    
            if(req.session.error!="")
            {
                error=req.session.error
                req.session.error=""
                hasErr=true
            }
    
            let hasMess = false
            let mess = ""
    
            if(req.session.message!="")
            {
                mess=req.session.message
                req.session.message=""
                hasMess=true
            }

            let classes = await adminM.getAllClasses()
            let list = await teacherM.getAllByID("HocSinh", "maLop", req.query.class)
        res.render("classes",{
            error: error,
            hasError: hasErr,
            hasMess: hasMess,
            mess: mess,
            classes: classes,
            list: list,
        })
        } catch (error) {

            next(error)
        }
      }
}