const {getClient} = require('../config/postgres')

module.exports={
    updateInfoGiaoVien: async(data)=>{
        var client = await getClient()
        var rs = await client.query
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
        var client = await getClient()
        var rs = await client.query
        (
            `select * from public."${tablename}"
            WHERE "${field}" like '${value}';`
        )
        return rs.rows
    }
}