const adminM = require("../models/admin.m")
module.exports={
    renderCreateAcc: (req,res,next)=>{
        res.render('createacc')
      },
      renderCreateClass: (req,res,next)=>{
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

        res.render('createclass',{
            error: error,
            hasError: hasErr,
            error: error,
            hasMess: hasMess,
            mess: mess,
        })
      
      },
      renderManageTeacher: (req,res,next)=>{
        res.render('manageteacher')
      
      },
      renderManageStudent: (req,res,next)=>{
        res.render('managestudent')
      
      },
      renderManageRule: (req,res,next)=>{
        res.render('managerule')
      
      },

      handleCreateAcc: (req,res,next)=>{
        console.log(req.body);
      },
      
      handleCreateClass: async (req,res,next)=>{
        console.log("handleCreateClass");
        // console.log(req.body);
        if(req.body){
           let  {grade,classname,classsize,headteacher} = req.body
           console.log("body data:::" ,grade,classname,classsize,headteacher);

        
        let data ={}
        // validate data
        if(!req.body.grade){
            req.session.error = "Value error (Grade), try again!!!"
            res.redirect("/createclass")
        }

        if(req.body.grade!="10" &&req.body.grade!="11" && req.body.grade!="12"){
            console.log("faile check");
            req.session.error = "Value error (Grade), try again!!!"
            console.log("create error");
            return res.redirect("/createclass")
        }else{
            data.maKhoi = "K"+req.body.grade
        }
        

        if(!req.body.classname){
            req.session.error = "Value error (ClassName), try again!!!"
            return res.redirect("/createclass")
        }
        let existedClasses = await adminM.findByName("Lop", "tenLop", req.body.classname)
            
        if(existedClasses.length!=0){
            req.session.error = "Existed Class, try again!!!"
            res.redirect("/createclass")
        }

        if(!req.body.headteacher){
            req.session.error = "Lost of headteacher, try again!!!"
            res.redirect("/createclass")
        }

        let lastID = await adminM.getLastId("Lop","maLop")

        data.maLop=parseInt(lastID)+1
        data.tenLop= req.body.classname
        data.maGVCN = req.body.headteacher
        console.log(data);
        let insertResult = await adminM.insertClass(data)

        req.session.message = "Successful insert class!!!"
        res.redirect("/createclass")

        }
      },
}