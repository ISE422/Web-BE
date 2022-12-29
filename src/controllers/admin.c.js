const adminM = require("../models/admin.m")
module.exports={
    renderCreateAcc: async (req,res,next)=>{

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

        let allClasses = await adminM.getAllClasses()
        //console.log(allClasses);

        let allsubjs = await adminM.getAllSubjects()


        res.render('createacc',{
            error: error,
            hasError: hasErr,
            hasMess: hasMess,
            mess: mess,
            classes: allClasses,
            subjs: allsubjs,
        })
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

      handleCreateAcc: async(req,res,next)=>{
        //console.log(req.body);
        //validate data

        // kiem tra siso lop dinh them vao (si so toi da)
        switch (req.body.accountType) {
            case 'student':
                {
                let qdSiSo = await adminM.getQuiDinh("qdsiso")
                //console.log(qdSiSo);
                let siSoToiDa = qdSiSo.giaTri
                let siSoHienTai = await adminM.countStInClass(req.body.classstudying)
                
                //console.log(siSoHienTai, siSoToiDa);
                if(siSoHienTai>= siSoToiDa){
                    req.session.error = "Class is full, try again!!!"
                    res.redirect("/createacc")
                }
        
                let tuoiMin = await adminM.getQuiDinh("qdtuoimin")
                let tuoiMax = await adminM.getQuiDinh("qdtuoimax")
        
                if(!req.body.birthday){
                    req.session.error = "Birthday is empty, try again!!!"
                    res.redirect("/createacc")
                }
                let birthday=Date.parse(req.body.birthday)
                //console.log(birthday);
                var ageDifMs = Date.now() - birthday;
                var ageDate = new Date(ageDifMs); // miliseconds from epoch
                let age =  Math.abs(ageDate.getUTCFullYear() - 1970);
                //console.log(age);
                //console.log(tuoiMin,tuoiMax)
                if(age>tuoiMax.giaTri || age <tuoiMin.giaTri){
                    req.session.error = "Age is not suitable, try again!!!"
                    res.redirect("/createacc")
                }
        
                let lastID = await adminM.getLastId("HocSinh","maHS")
                //console.log(lastID);
                let nextID = parseInt(lastID)+1
        
                let account={}
                account.username= nextID
                account.password="123"
                account.type="3"
                let insertAcc = await adminM.insertAccount(account)
                //console.log(insertAcc);
        
        
                let student={}
                student.maHS = nextID
                student.maLop=req.body.classstudying
                student.hoTen=req.body.fullname
                student.gioiTinh=req.body.genderRad
                student.email=req.body.email
                student.ngaySinh=req.body.birthday
                student.diaChi=req.body.address
        
                let insertSt= await adminM.insertStudent(student)
                //console.log(insertSt);
        
                req.session.message = "Successful insert student!!!"
                res.redirect("/createacc")
                break;
                }
            case 'teacher':
                {
                console.log(req.body);
                if(!req.body.fullname ||!req.body.birthday ||!req.body.address ||!req.body.email){
                    req.session.error = "Please fill all data, try again!!!"
                    res.redirect("/createacc")
                }
                let lastID = await adminM.getLastId("GiaoVien","maGV")
                //console.log(lastID);
                let nextID = parseInt(lastID)+1
        
                let account={}
                account.username= nextID
                account.password="123"
                account.type="2"
                let insertAcc = await adminM.insertAccount(account)

                let PhanCong={}
                let lastIDPhanCong= await adminM.getLastId("PhanCong","maPhanCong")
                let nextIDPhanCong= parseInt(lastIDPhanCong)+1
                PhanCong.maPhanCong = nextIDPhanCong
                PhanCong.maGV=nextID
                PhanCong.maLop=req.body.classteach
                let insertPhanCong= await adminM.insertPhanCong(PhanCong)

                let teacher={}
                teacher.maGV = nextID
                teacher.maMH=req.body.subject
                teacher.hoTen=req.body.fullname
                teacher.gioiTinh=req.body.genderRad
                teacher.email=req.body.email
                teacher.ngaySinh=req.body.birthday
                teacher.diaChi=req.body.address
        
                let insertSt= await adminM.insertTeacher(teacher)
                //console.log(insertSt);
        
                req.session.message = "Successful insert teacher!!!"
                res.redirect("/createacc")
                break;
                }
            default:
                req.session.error = "Invalid account type, try again!!!"
                res.redirect("/createacc")
                break;
        }
      },
      
      handleCreateClass: async (req,res,next)=>{
        //console.log("handleCreateClass");
        // //console.log(req.body);
        if(req.body){
           let  {grade,classname,classsize,headteacher} = req.body
           //console.log("body data:::" ,grade,classname,classsize,headteacher);

        
        let data ={}
        // validate data
        if(!req.body.grade){
            req.session.error = "Value error (Grade), try again!!!"
            res.redirect("/createclass")
        }

        if(req.body.grade!="10" &&req.body.grade!="11" && req.body.grade!="12"){
            //console.log("faile check");
            req.session.error = "Value error (Grade), try again!!!"
            //console.log("create error");
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
        //console.log(data);
        let insertResult = await adminM.insertClass(data)

        req.session.message = "Successful insert class!!!"
        res.redirect("/createclass")

        }
      },
}