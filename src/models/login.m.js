const {db,pgp} = require("../config/postgres")

module.exports={
    getAccByUsername: async(username)=>{
        var rs = await db.any
        (
            `select * from public."TaiKhoan"
            WHERE "username" like '${username}';`
        )
        return rs
    }
}