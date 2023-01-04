// const {getdb} = require('../config/postgres')
const {db,pgp} = require("../config/postgres")


module.exports={
    getLastId: async(tablename, nameField)=>{
        var rs = await db.any
        (`select * from public."${tablename}"
        ORDER BY "${nameField}" ASC 
        `)
        if(rs.length==0){
            return 0
        }else{
            return (rs[rs.length-1])[nameField]
        }
    },

    findByName: async(tablename, nameField, value)=>{
        var rs = await db.any
        (`select * from public."${tablename}" where "${nameField}" like '${value}'`)
        return rs
    },

    insertClass: async(data)=>{
        var rs = await db.any
        (`insert into public."Lop" 
        ("maLop", "maKhoi", "tenLop", "maGVCN") values
        ('${data.maLop}','${data.maKhoi}','${data.tenLop}','${data.maGVCN}')`)
        return rs
    },

    getAllClasses: async()=>{
        var rs = await db.any
        (`select "maLop", "tenLop" from public."Lop"`)
        return rs
    },

    getAllSubjects: async()=>{
        var rs = await db.any
        (`select "maMH", "tenMH" from public."MonHoc"`)
        return rs
    },

    getQuiDinh: async(name)=>{
        var rs = await db.any
        (`select "tenQD", "giaTri" from public."QuiDinh" 
        where "maQD" like '${name}'`)
        return rs[0]
    },
    
    countStInClass: async(classID)=>{
        var rs = await db.any
        (`select * from public."HocSinh" 
        where "maLop" like '${classID}'`)
        return rs.length
    },

    insertAccount: async(data)=>{
        var rs = await db.any
        (`insert into public."TaiKhoan" 
        ("username", "password", "type") values
        ('${data.username}','${data.password}','${data.type}')`)
        return rs
    },

    insertStudent: async(data)=>{
        var rs = await db.any
        (`insert into public."HocSinh" 
        ("maHS", "maLop", "hoTen","gioiTinh","email","ngaySinh","diaChi") 
        values
        ('${data.maHS}','${data.maLop}','${data.hoTen}',${data.gioiTinh},
        '${data.email}','${data.ngaySinh}','${data.diaChi}')`)
        return rs
        
    },

    insertTeacher: async(data)=>{
        var rs = await db.any
        (`insert into public."GiaoVien" 
        ("maGV", "maMH", "hoTen","gioiTinh","email","ngaySinh","diaChi") 
        values
        ('${data.maGV}','${data.maMH}','${data.hoTen}',${data.gioiTinh},
        '${data.email}','${data.ngaySinh}','${data.diaChi}')`)
        return rs
    },

    insertPhanCong: async(data)=>{
        var rs = await db.any
        (`insert into public."PhanCong" 
        ("maPhanCong", "maGV", "maLop") 
        values
        ('${data.maPhanCong}','${data.maGV}','${data.maLop}')`)
        return rs
    },

    updateQuiDinh: async(maqd, value)=>{
        var rs = await db.any
        (
            `UPDATE public."QuiDinh"
            SET "giaTri"=${value}
            WHERE "maQD" like '${maqd}';`
        )
        return rs
    },

    insertSubject: async(obj)=>{
        
        var rs = await db.any
        (
            `INSERT INTO public."MonHoc"(
                "maMH", "tenMH", "diemChuan")
                VALUES ('${obj.maMH}', '${obj.tenMH}', '${obj.diemChuan}');`
        )
        return rs
    },

    countRowInTable: async(tablename)=>{
        var rs = await db.any
        (`select * from public."${tablename}"`)
        return rs.length
    },

    findValueInTable: async(tablename, field, value)=>{
        var rs = await db.any
        (`select * from public."${tablename}"
        where "${field}" like '${value}'
        `)
        if(rs.length==0) return false
        else{
            return true
        }
    },

    getAll: async(tablename)=>{
        var rs = await db.any
        (`select * from public."${tablename}"
        `)
        return rs
    },

    deleteByID: async(tablename,fieldID,value)=>{
        var rs = await db.any
        (`
        DELETE FROM public."${tablename}"
	    WHERE "${fieldID}" like '${value}';
        `)
        return rs
    },

    updatePhanCong: async(maGV, maLop)=>{
        var rs = await db.any
        (`
        UPDATE public."PhanCong"
        SET "maLop"='${maLop}'
        WHERE "maGV" like '${maGV}';
        `)
        return rs
    },

    updateSubForTeacher: async(maGV, maMH)=>{
            var rs = await db.any
            (`
            UPDATE public."GiaoVien"
            SET "maMH"='${maMH}'
            WHERE "maGV" like '${maGV}';
            `)
            return rs
        },
    updateClassForStudent: async(maHS, maLop)=>{
            var rs = await db.any
            (`
            UPDATE public."HocSinh"
            SET "maLop"='${maLop}'
            WHERE "maHS" like '${maHS}';
            `)
            return rs
        },
    updateSubName: async(maMH, tenMH)=>{
            var rs = await db.any
            (`
            UPDATE public."MonHoc"
            SET "tenMH"='${tenMH}'
            WHERE "maMH" like '${maMH}';
            `)
            return rs
    }
    
}