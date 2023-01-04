// const {getClient} = require('../config/postgres')
const {db,pgp} = require("../config/postgres")

module.exports={
    updateInfoGiaoVien: async(data)=>{
        
        var rs = await db.any
        (
            `UPDATE public."GiaoVien"
            SET "hoTen"='${data.fullname}',
            "gioiTinh"=${data.genderRad},
            "email"= '${data.email}',
            "ngaySinh"='${data.birthday}',
            "diaChi"='${data.address}'
            WHERE "maGV" like '${data.maGV}';`
        )
        return rs
    },

    getAllByID: async(tablename, field, value)=>{
        
        var rs = await db.any
        (
            `select * from public."${tablename}"
            WHERE "${field}" like '${value}';`
        )
        return rs
    }
}