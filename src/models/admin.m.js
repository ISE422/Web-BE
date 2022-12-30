const {getClient} = require('../config/postgres')

module.exports={
    getLastId: async(tablename, nameField)=>{
        var client = await getClient()
        var rs = await client.query
        (`select * from public."${tablename}"
        ORDER BY "${nameField}" ASC 
        `)
        if(rs.rows.length==0){
            return 0
        }else{
            return (rs.rows[rs.rows.length-1])[nameField]
        }
    },

    findByName: async(tablename, nameField, value)=>{
        var client = await getClient()
        var rs = await client.query
        (`select * from public."${tablename}" where "${nameField}" like '${value}'`)
        return rs.rows
    },

    insertClass: async(data)=>{
        var client = await getClient()
        var rs = await client.query
        (`insert into public."Lop" 
        ("maLop", "maKhoi", "tenLop", "maGVCN") values
        ('${data.maLop}','${data.maKhoi}','${data.tenLop}','${data.maGVCN}')`)
        return rs
    },

    getAllClasses: async()=>{
        var client = await getClient()
        var rs = await client.query
        (`select "maLop", "tenLop" from public."Lop"`)
        return rs.rows
    },

    getAllSubjects: async()=>{
        var client = await getClient()
        var rs = await client.query
        (`select "maMH", "tenMH" from public."MonHoc"`)
        return rs.rows
    },

    getQuiDinh: async(name)=>{
        var client = await getClient()
        var rs = await client.query
        (`select "tenQD", "giaTri" from public."QuiDinh" 
        where "maQD" like '${name}'`)
        return rs.rows[0]
    },
    
    countStInClass: async(classID)=>{
        var client = await getClient()
        var rs = await client.query
        (`select * from public."HocSinh" 
        where "maLop" like '${classID}'`)
        return rs.rows.length
    },

    insertAccount: async(data)=>{
        var client = await getClient()
        var rs = await client.query
        (`insert into public."TaiKhoan" 
        ("username", "password", "type") values
        ('${data.username}','${data.password}','${data.type}')`)
        return rs
    },

    insertStudent: async(data)=>{
        var client = await getClient()
        var rs = await client.query
        (`insert into public."HocSinh" 
        ("maHS", "maLop", "hoTen","gioiTinh","email","ngaySinh","diaChi") 
        values
        ('${data.maHS}','${data.maLop}','${data.hoTen}',${data.gioiTinh},
        '${data.email}','${data.ngaySinh}','${data.diaChi}')`)
        return rs
        
    },

    insertTeacher: async(data)=>{
        var client = await getClient()
        var rs = await client.query
        (`insert into public."GiaoVien" 
        ("maGV", "maMH", "hoTen","gioiTinh","email","ngaySinh","diaChi") 
        values
        ('${data.maGV}','${data.maMH}','${data.hoTen}',${data.gioiTinh},
        '${data.email}','${data.ngaySinh}','${data.diaChi}')`)
        return rs
    },

    insertPhanCong: async(data)=>{
        var client = await getClient()
        var rs = await client.query
        (`insert into public."PhanCong" 
        ("maPhanCong", "maGV", "maLop") 
        values
        ('${data.maPhanCong}','${data.maGV}','${data.maLop}')`)
        return rs
    },

    updateQuiDinh: async(maqd, value)=>{
        var client = await getClient()
        var rs = await client.query
        (
            `UPDATE public."QuiDinh"
            SET "giaTri"=${value}
            WHERE "maQD" like '${maqd}';`
        )
        return rs
    },

    insertSubject: async(obj)=>{
        
        var client = await getClient()
        var rs = await client.query
        (
            `INSERT INTO public."MonHoc"(
                "maMH", "tenMH", "diemChuan")
                VALUES ('${obj.maMH}', '${obj.tenMH}', '${obj.diemChuan}');`
        )
        return rs
    },

    countRowInTable: async(tablename)=>{
        var client = await getClient()
        var rs = await client.query
        (`select * from public."${tablename}"`)
        return rs.rows.length
    },

    findValueInTable: async(tablename, field, value)=>{
        var client = await getClient()
        var rs = await client.query
        (`select * from public."${tablename}"
        where "${field}" like '${value}'
        `)
        if(rs.rows.length==0) return false
        else{
            return true
        }
    },

    getAll: async(tablename)=>{
        var client = await getClient()
        var rs = await client.query
        (`select * from public."${tablename}"
        `)
        return rs.rows
    },

    deleteByID: async(tablename,fieldID,value)=>{
    var client = await getClient()
        var rs = await client.query
        (`
        DELETE FROM public."${tablename}"
	    WHERE "${fieldID}" like '${value}';
        `)
        return rs.rows
    },

    updatePhanCong: async(maGV, maLop)=>{
    var client = await getClient()
        var rs = await client.query
        (`
        UPDATE public."PhanCong"
        SET "maLop"='${maLop}'
        WHERE "maGV" like '${maGV}';
        `)
        return rs.rows
    },

    updateSubForTeacher: async(maGV, maMH)=>{
        var client = await getClient()
            var rs = await client.query
            (`
            UPDATE public."GiaoVien"
            SET "maMH"='${maMH}'
            WHERE "maGV" like '${maGV}';
            `)
            return rs.rows
        },

    

    


}