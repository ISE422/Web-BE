const { getClient } = require("../config/postgres");
module.exports={
    getAccByUsername: async(username)=>{
        var client = await getClient()
        var rs = await client.query
        (
            `select * from public."TaiKhoan"
            WHERE "username" like '${username}';`
        )
        return rs.rows
    }
}