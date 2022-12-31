const { countStInClass } = require("../models/admin.m")
const adminM = require("../models/admin.m")
const bcrypt = require("bcrypt")
const saltRounds = 10;
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

        try{
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
        }catch(err){
            next(err)
        }

        
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
      renderManageTeacher: async(req,res,next)=>{

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
        
        try{
            let allteacher = await adminM.getAll("GiaoVien")
            let allsubs = await adminM.getAll("MonHoc")
            let allClasses= await adminM.getAll("Lop")
            let phanCong = await adminM.getAll("PhanCong")
            
            allteacher = allteacher.map(teacher =>{
                let resfind = allsubs.find(item=> item.maMH === teacher.maMH)
                let findClassTeach = phanCong.filter(item=> item.maGV === teacher.maGV)
                teacher.tenLop=""
                if(findClassTeach.length==0)teacher.tenLop+="No class"
                else{
                    let findclass = allClasses.find(temp => temp.maLop===findClassTeach[0].maLop)
                    // console.log(findclass);
                    teacher.tenLop= findclass.tenLop
    
                }
                 
                resfind? teacher.tenMH=resfind.tenMH : teacher.tenMH = "No subject"
                return teacher
            })
    
            
            res.render('manageteacher',{
                allteacher: allteacher,
                allsubjs: allsubs,
                allClasses: allClasses,
                error: error,
                hasError: hasErr,
                hasMess: hasMess,
                mess: mess,
            })
        }catch(err){
            next(err)
        }
      },

      renderManageStudent: async(req,res,next)=>{

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

        try{
            let allStus = await adminM.getAll("HocSinh")
        let allClasses = await adminM.getAll("Lop")

        // console.log(allClasses);

        allStus=allStus.map(item=>{
            let classname = ""
            let classitem = allClasses.find( iclass => iclass.maLop===item.maLop)
            classname=classitem.tenLop
            // console.log(classname);
            item.tenLop=classname
            return item
        })

        // console.log(allStus);

        res.render('managestudent',{
            error: error,
            hasError: hasErr,
            hasMess: hasMess,
            mess: mess,
            allstus: allStus,
            allClasses: allClasses,
            
        })
        }catch(err){
            next(err)
        }
      
      },
      renderManageRule: async (req,res,next)=>{
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

        try{
            // let allClasses = await adminM.getAllClasses()
            let allsubjs = await adminM.getAllSubjects()

            res.render('managerule',{
                error: error,
                hasError: hasErr,
                hasMess: hasMess,
                mess: mess,
                subjs: allsubjs
            })
        }catch(err){
            next(err)
        }
      },

      handleCreateAcc: async(req,res,next)=>{
        
        switch (req.body.accountType) {
            case 'student':
                try{
                let qdSiSo = await adminM.getQuiDinh("qdsiso")
                //console.log(qdSiSo);
                let siSoToiDa = qdSiSo.giaTri
                let siSoHienTai = await adminM.countStInClass(req.body.classstudying)
                
                //console.log(siSoHienTai, siSoToiDa);
                if(siSoHienTai>= siSoToiDa){
                    req.session.error = "Class is full, try again!!!"
                    res.redirect("/createacc")
                    return
                }
        
                let tuoiMin = await adminM.getQuiDinh("qdtuoimin")
                let tuoiMax = await adminM.getQuiDinh("qdtuoimax")
        
                if(!req.body.birthday){
                    req.session.error = "Birthday is empty, try again!!!"
                    res.redirect("/createacc")
                    return
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
                    return
                }
        
                let lastID = await adminM.getLastId("HocSinh","maHS")
                //console.log(lastID);
                let nextID = parseInt(lastID)+1
        
                let account={}
                account.username= nextID
                let tmppass= "123"
                let pwhash= await bcrypt.hash(tmppass, saltRounds);
                account.password=pwhash
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
                }catch(err){
                    next(err)
                    break;
                }
            case 'teacher':
                try{
                console.log(req.body);
                if(!req.body.fullname ||!req.body.birthday ||!req.body.address ||!req.body.email){
                    req.session.error = "Please fill all data, try again!!!"
                    res.redirect("/createacc")
                    return
                }
                let lastID = await adminM.getLastId("GiaoVien","maGV")
                //console.log(lastID);
                let nextID = parseInt(lastID)+1
        
                let account={}
                account.username= nextID
                let tmppass= "123"
                let pwhash= await bcrypt.hash(tmppass, saltRounds);
                account.password=pwhash
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
                }catch(err){
                    next(err)
                    break;
                }
            default:
                req.session.error = "Invalid account type, try again!!!"
                res.redirect("/createacc")
                break;
        }
        return
      },
      
      handleCreateClass: async (req,res,next)=>{
        if(req.body){
            try{
                let  {grade,classname,classsize,headteacher} = req.body
                let data ={}
                // validate data
                if(!req.body.grade){
                    req.session.error = "Value error (Grade), try again!!!"
                    res.redirect("/createclass")
                    return
                }
        
                if(req.body.grade!="10" &&req.body.grade!="11" && req.body.grade!="12"){
                    //console.log("faile check");
                    req.session.error = "Value error (Grade), try again!!!"
                    //console.log("create error");
                    res.redirect("/createclass")
                    return
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
                    return
                }
        
                if(!req.body.headteacher){
                    req.session.error = "Lost of headteacher, try again!!!"
                    res.redirect("/createclass")
                    return
                }
        
                let lastID = await adminM.getLastId("Lop","maLop")
        
                data.maLop=parseInt(lastID)+1
                data.tenLop= req.body.classname
                data.maGVCN = req.body.headteacher
                //console.log(data);
                let insertResult = await adminM.insertClass(data)
        
                req.session.message = "Successful insert class!!!"
                res.redirect("/createclass")
                return
            }catch(err){
                next(err)
            }
        }
      },

      handleRule: async (req,res,next)=>{
        console.log(req.body.option);
        switch (req.body.option) {
            case 'minOld':
                try{
                console.log("case min old");
                let result = await adminM.updateQuiDinh("qdtuoimin",req.body.minOld)
                req.session.message = "updated !!!"
                res.redirect("/managerule")
                break;
                }catch(err){
                    next(err)
                    break;
                }
            case 'maxOld':
                try{
                console.log("case maxOld");
                let result = await adminM.updateQuiDinh("qdtuoimax",req.body.maxOld)
                req.session.message = "updated !!!"
                res.redirect("/managerule")
                break;
                }catch(err){
                    next(err)
                    break;
                }
            case 'maxClassSize':
                try{
                    console.log("case maxClassSize");
                    let result = await adminM.updateQuiDinh("qdsiso",req.body.maxClassSize)
                    req.session.message = "updated !!!"
                    res.redirect("/managerule")
                    break;
                }catch(err){
                    next(err)
                    break;
                }
            case 'maxClassAmount':
                try{
                    console.log("case maxClassAmount");
                    let result = await adminM.updateQuiDinh("qdsllop",req.body.maxClassAmount)
                    req.session.message = "updated !!!"
                    res.redirect("/managerule")
                    break;
                }catch(err){
                    next(err)
                    break;
                }
            case 'maxSubject':
                try{
                    console.log("case maxSubject");
                    let result = await adminM.updateQuiDinh("qdslmonhoc",req.body.maxSubject)
                    req.session.message = "updated !!!"
                    res.redirect("/managerule")
                    break;
                }catch(err){
                    next(err)
                    break;
                }
            case 'passScore':
                try{
                    console.log("case passScore");
                    let result = await adminM.updateQuiDinh("qddiemchuan",req.body.passScore)
                    req.session.message = "updated !!!"
                    res.redirect("/managerule")
                    break;
                }catch(err){
                    next(err)
                    break;
                }
            case 'newSubject':
                try{console.log("case newSubject");

                let data = req.body.newSubject
                let temp = data.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D')
                temp=temp.trim()
                let token = temp.split(" ")
                let newTemp = ""
                token.forEach(element => {
                    newTemp+=element
                });
                newTemp="MH"+newTemp.toUpperCase()

                
                
                let countSub = await adminM.countRowInTable("MonHoc")
                let maxSub = await adminM.getQuiDinh("qdslmonhoc")
                maxSub=maxSub.giaTri
                // let find1 = await adminM.findValueInTable("MonHoc","maMH","MHDAODUC")
                let find2 = await adminM.findValueInTable("MonHoc","maMH",newTemp)
                // console.log(countSub,maxSub,find1,find2);

                if(find2){
                    req.session.error = "existed class !!!"
                    res.redirect("/managerule")
                    break;
                }

                if(countSub>=maxSub){
                    req.session.error = "amount of class is maximum, try again !!!"
                    res.redirect("/managerule")
                    break;
                }

                let obj={}
                obj.maMH=newTemp
                obj.tenMH=data

                let diemchuan = await adminM.getQuiDinh("qddiemchuan")
                console.log(diemchuan);
                diemchuan=diemchuan.giaTri
                obj.diemChuan=diemchuan
                console.log(obj);
                let result = await adminM.insertSubject(obj)
                req.session.message = "updated !!!"
                res.redirect("/managerule")
                break;}
                catch(err){
                    next(err)
                    break;
                }

            case 'changeSubject':
                try{
                console.log("case changeSubject");
                console.log(req.body);
                let update = await adminM.updateSubName(req.body.subject,req.body.newSubName)
                req.session.message = "updated !!!"
                res.redirect("/managerule")
                break;
                    }catch(err){
                    next(err)
                    break;                
                }
            default:
                req.session.error = "Error, try again!!!"
                res.redirect("/managerule")
                break;
            }
            return
      },

      handleTeacher: async (req,res,next)=>{
        console.log(req.body);
        switch (req.body.option) {
            case 'delete':
            try{
                let dlAcc = await adminM.deleteByID("TaiKhoan","username",req.body.teacherid)
                let dlGV = await adminM.deleteByID("GiaoVien","maGV",req.body.teacherid)
                let dlPC = await adminM.deleteByID("PhanCong","maGV",req.body.teacherid)
                req.session.message = "updated !!!"
                res.redirect("/manageteacher")
                break;
            }catch(err){
                next(err)
                break;
            }

            case 'update':
            try{
                
                let updateMH = await adminM.updateSubForTeacher(req.body.teacherid, req.body.subject)
                
                let findPC = await adminM.findValueInTable("PhanCong", "maGV", req.body.teacherid)
                console.log(findPC);
                if(!findPC){
                    let data={}
                    let lastID = await adminM.getLastId("PhanCong","maPhanCong")
                    data.maPhanCong=lastID+1
                    data.maGV=req.body.teacherid
                    data.maLop=req.body.classteach
                    let insertPC = adminM.insertPhanCong(data)
                }else{
                    let updatePC = await adminM.updatePhanCong(req.body.teacherid, req.body.classteach)
                }
                req.session.message = "updated !!!"
                res.redirect("/manageteacher")
                break;
            }catch(err){
                next(err)
                break;
            }

            default:
                req.session.error = "error !!!"
                res.redirect("/manageteacher")
                break;
        }
        return
      },

      handleStudent: async (req,res,next)=>{
        console.log(req.body);
        switch (req.body.option) {
            case 'delete':
                try{
                let dlAcc = await adminM.deleteByID("TaiKhoan","username",req.body.studentid)
                let dlHS = await adminM.deleteByID("HocSinh","maHS",req.body.studentid)
                req.session.message = "deleted !!!"
                res.redirect("/managestudent")
                break;
                }catch(err){
                    next(err)
                    break;
                }
            case 'update':
            try{   
                let qdSiSo = await adminM.getQuiDinh("qdsiso")
                //console.log(qdSiSo);
                let siSoToiDa = qdSiSo.giaTri
                
                console.log(req.body);
                console.log(siSoToiDa);
                
                let sisoHienTai = await countStInClass(req.body.classstu)
                console.log(sisoHienTai);
                if(sisoHienTai>= siSoToiDa){
                    req.session.error = "failed, class is full !!!"
                    res.redirect("/managestudent")
                    return
                }


                
                let updateStu = await adminM.updateClassForStudent(req.body.studentid, req.body.classstu)
                req.session.message = "updated !!!"
                res.redirect("/managestudent")
                break;
            }catch(err){
                next(err)
                break;
            }
        
            default:
                break;
        }
      }

      
}